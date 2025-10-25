"""
Business: User authentication + profiles + garage + friends
Args: event with httpMethod, body, headers with X-Auth-Token; context with request_id  
Returns: HTTP response with auth tokens, user data, profiles, vehicles, friends data
"""
import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def get_header(headers: Dict[str, Any], name: str) -> Optional[str]:
    """Get header value case-insensitive"""
    name_lower = name.lower()
    for key, value in headers.items():
        if key.lower() == name_lower:
            return value
    return None

def get_user_from_token(cur, token: str) -> Optional[Dict]:
    cur.execute(
        f"""
        SELECT u.id, u.email, u.name
        FROM users u
        JOIN user_sessions s ON u.id = s.user_id
        WHERE s.token = '{token}' AND s.expires_at > NOW()
        """
    )
    return cur.fetchone()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    token = get_header(headers, 'X-Auth-Token')
    query_params = event.get('queryStringParameters') or {}
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        user = None
        if token:
            user = get_user_from_token(cur, token)
        
        # === AUTHENTICATION ENDPOINTS ===
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'telegram_auth':
                telegram_id = body.get('telegram_id')
                first_name = body.get('first_name')
                last_name = body.get('last_name')
                username = body.get('username')
                photo_url = body.get('photo_url', '')
                print(f'[TELEGRAM AUTH] telegram_id={telegram_id}, photo_url={photo_url}')
                
                if not telegram_id or not first_name:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'telegram_id and first_name required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT id, name, email, role FROM users WHERE telegram_id = %s",
                    (telegram_id,)
                )
                auth_user = cur.fetchone()
                
                if auth_user:
                    if photo_url:
                        cur.execute(
                            "UPDATE user_profiles SET avatar_url = %s WHERE user_id = %s",
                            (photo_url, auth_user['id'])
                        )
                    
                    if username:
                        cur.execute(
                            "UPDATE user_profiles SET telegram = %s WHERE user_id = %s",
                            (username, auth_user['id'])
                        )
                    
                    new_token = generate_token()
                    expires_at = datetime.now() + timedelta(days=30)
                    
                    cur.execute(
                        "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                        (auth_user['id'], new_token, expires_at)
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'token': new_token,
                            'user': {
                                'id': auth_user['id'],
                                'name': auth_user['name'],
                                'email': auth_user['email'],
                                'role': auth_user['role']
                            }
                        }),
                        'isBase64Encoded': False
                    }
                else:
                    name = first_name + (f' {last_name}' if last_name else '')
                    
                    cur.execute(
                        "INSERT INTO users (telegram_id, name, first_name, last_name, username, email, password_hash, role) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id, name, email, role",
                        (telegram_id, name, first_name, last_name, username, f'tg_{telegram_id}@telegram.user', '', 'user')
                    )
                    auth_user = cur.fetchone()
                    
                    cur.execute(
                        "INSERT INTO user_profiles (user_id, avatar_url, telegram) VALUES (%s, %s, %s)",
                        (auth_user['id'], photo_url, username)
                    )
                    
                    new_token = generate_token()
                    expires_at = datetime.now() + timedelta(days=30)
                    
                    cur.execute(
                        "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                        (auth_user['id'], new_token, expires_at)
                    )
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'token': new_token,
                            'user': {
                                'id': auth_user['id'],
                                'name': auth_user['name'],
                                'email': auth_user['email'],
                                'role': auth_user['role']
                            }
                        }),
                        'isBase64Encoded': False
                    }
            
            elif action == 'logout':
                logout_token = get_header(event.get('headers', {}), 'X-Auth-Token')
                
                if logout_token:
                    cur.execute("DELETE FROM user_sessions WHERE token = %s", (logout_token,))
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Logged out'}),
                    'isBase64Encoded': False
                }
        
        # === VERIFY TOKEN (GET /auth) ===
        if method == 'GET' and not ('vehicle' in path or 'friend' in path or query_params.get('action') in ['garage', 'friends', 'public']):
            print(f"[AUTH GET] Headers: {list(headers.keys())}")
            print(f"[AUTH GET] Token extracted: {token[:20] if token else None}...")
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No token provided'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                SELECT u.id, u.email, u.name, u.role, u.created_at, p.callsign
                FROM users u
                JOIN user_sessions s ON u.id = s.user_id
                LEFT JOIN user_profiles p ON u.id = p.user_id
                WHERE s.token = %s AND s.expires_at > NOW()
                """,
                (token,)
            )
            verify_user = cur.fetchone()
            
            if not verify_user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid or expired token'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user': {
                        'id': verify_user['id'],
                        'email': verify_user['email'],
                        'name': verify_user['name'],
                        'role': verify_user['role'],
                        'callsign': verify_user.get('callsign')
                    }
                }),
                'isBase64Encoded': False
            }
        
        # === GARAGE (vehicles) ===
        if 'vehicle' in path or query_params.get('action') == 'garage':
            if method == 'GET':
                user_id = query_params.get('user_id') or (user and user['id'])
                if not user_id:
                    return {'statusCode': 401, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Auth required'}), 'isBase64Encoded': False}
                
                cur.execute(f"SELECT * FROM user_vehicles WHERE user_id = {user_id} ORDER BY is_primary DESC, created_at DESC")
                vehicles = cur.fetchall()
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'vehicles': [dict(v) for v in vehicles]}, default=str), 'isBase64Encoded': False}
            
            elif method == 'POST' and user:
                body = json.loads(event.get('body', '{}'))
                vtype = body.get('vehicle_type')
                if not vtype:
                    return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'vehicle_type required'}), 'isBase64Encoded': False}
                
                brand = body.get('brand', '').replace("'", "''")
                model = body.get('model', '').replace("'", "''")
                desc = body.get('description', '').replace("'", "''")
                mods = body.get('modifications', '').replace("'", "''")
                photo_url_input = body.get('photo_url', '')
                
                if isinstance(photo_url_input, list):
                    photo_json = json.dumps(photo_url_input)
                elif photo_url_input:
                    photo_json = json.dumps([photo_url_input])
                else:
                    photo_json = '[]'
                
                photo_json_escaped = photo_json.replace("'", "''")
                year = body.get('year') or 'NULL'
                is_primary = body.get('is_primary', False)
                mileage = body.get('mileage') or 'NULL'
                power_hp = body.get('power_hp') or 'NULL'
                displacement = body.get('displacement') or 'NULL'
                
                if is_primary:
                    cur.execute(f"UPDATE user_vehicles SET is_primary = false WHERE user_id = {user['id']}")
                
                cur.execute(f"INSERT INTO user_vehicles (user_id, vehicle_type, brand, model, year, photo_url, description, is_primary, mileage, power_hp, displacement, modifications) VALUES ({user['id']}, '{vtype}', '{brand}', '{model}', {year}, '{photo_json_escaped}', '{desc}', {is_primary}, {mileage}, {power_hp}, {displacement}, '{mods}') RETURNING *")
                vehicle = cur.fetchone()
                conn.commit()
                return {'statusCode': 201, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'vehicle': dict(vehicle)}, default=str), 'isBase64Encoded': False}
            
            elif method == 'PUT' and user:
                vid = query_params.get('vehicle_id')
                if not vid:
                    return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'vehicle_id required'}), 'isBase64Encoded': False}
                
                body = json.loads(event.get('body', '{}'))
                vtype = body.get('vehicle_type', 'moto')
                brand = body.get('brand', '').replace("'", "''")
                model = body.get('model', '').replace("'", "''")
                desc = body.get('description', '').replace("'", "''")
                mods = body.get('modifications', '').replace("'", "''")
                photo_url_input = body.get('photo_url', '')
                
                if isinstance(photo_url_input, str) and photo_url_input.startswith('['):
                    photo_json = photo_url_input
                elif isinstance(photo_url_input, list):
                    photo_json = json.dumps(photo_url_input)
                elif photo_url_input:
                    photo_json = json.dumps([photo_url_input])
                else:
                    photo_json = '[]'
                
                photo_json_escaped = photo_json.replace("'", "''")
                year = body.get('year') or 'NULL'
                mileage = body.get('mileage') or 'NULL'
                power_hp = body.get('power_hp') or 'NULL'
                displacement = body.get('displacement') or 'NULL'
                
                cur.execute(f"UPDATE user_vehicles SET vehicle_type = '{vtype}', brand = '{brand}', model = '{model}', year = {year}, photo_url = '{photo_json_escaped}', description = '{desc}', mileage = {mileage}, power_hp = {power_hp}, displacement = {displacement}, modifications = '{mods}' WHERE id = {vid} AND user_id = {user['id']} RETURNING *")
                vehicle = cur.fetchone()
                if not vehicle:
                    return {'statusCode': 404, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Not found'}), 'isBase64Encoded': False}
                
                conn.commit()
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'vehicle': dict(vehicle)}, default=str), 'isBase64Encoded': False}
            
            elif method == 'DELETE' and user:
                vid = query_params.get('vehicle_id')
                if not vid:
                    return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'vehicle_id required'}), 'isBase64Encoded': False}
                
                cur.execute(f"DELETE FROM user_vehicles WHERE id = {vid} AND user_id = {user['id']}")
                conn.commit()
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'message': 'Deleted'}), 'isBase64Encoded': False}
        
        # === FRIENDS ===
        elif 'friend' in path or query_params.get('action') == 'friends':
            if method == 'GET':
                target_user_id = query_params.get('user_id')
                
                if target_user_id:
                    cur.execute(f"""
                        SELECT u.id, u.name, u.username, p.avatar_url, p.location, 'accepted' as status, f.created_at
                        FROM user_friends f
                        JOIN users u ON (CASE WHEN f.user_id = {target_user_id} THEN f.friend_id = u.id ELSE f.user_id = u.id END)
                        LEFT JOIN user_profiles p ON u.id = p.user_id
                        WHERE (f.user_id = {target_user_id} OR f.friend_id = {target_user_id}) AND f.status = 'accepted'
                        ORDER BY f.created_at DESC
                    """)
                    friends = cur.fetchall()
                    return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'friends': [dict(f) for f in friends]}, default=str), 'isBase64Encoded': False}
                
                if not user:
                    return {'statusCode': 401, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Auth required'}), 'isBase64Encoded': False}
                
                cur.execute(f"""
                    SELECT u.id, u.name, u.username, p.avatar_url, p.location, f.status, f.created_at,
                    CASE WHEN f.user_id = {user['id']} THEN 'sent' ELSE 'received' END as direction
                    FROM user_friends f
                    JOIN users u ON (CASE WHEN f.user_id = {user['id']} THEN f.friend_id = u.id ELSE f.user_id = u.id END)
                    LEFT JOIN user_profiles p ON u.id = p.user_id
                    WHERE (f.user_id = {user['id']} OR f.friend_id = {user['id']})
                    ORDER BY f.created_at DESC
                """)
                friends = cur.fetchall()
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'friends': [dict(f) for f in friends]}, default=str), 'isBase64Encoded': False}
            
            if not user:
                return {'statusCode': 401, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Auth required'}), 'isBase64Encoded': False}
            
            elif method == 'POST':
                body = json.loads(event.get('body', '{}'))
                friend_id = body.get('friend_id')
                if not friend_id or friend_id == user['id']:
                    return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Invalid friend_id'}), 'isBase64Encoded': False}
                
                cur.execute(f"SELECT * FROM user_friends WHERE (user_id = {user['id']} AND friend_id = {friend_id}) OR (user_id = {friend_id} AND friend_id = {user['id']})")
                existing = cur.fetchone()
                if existing:
                    if existing['status'] == 'pending':
                        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'message': 'Заявка уже отправлена, ожидаем принятие', 'friendship': dict(existing)}, default=str), 'isBase64Encoded': False}
                    else:
                        return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Already friends'}), 'isBase64Encoded': False}
                
                cur.execute(f"INSERT INTO user_friends (user_id, friend_id, status) VALUES ({user['id']}, {friend_id}, 'pending') RETURNING *")
                friendship = cur.fetchone()
                conn.commit()
                return {'statusCode': 201, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'friendship': dict(friendship)}, default=str), 'isBase64Encoded': False}
            
            elif method == 'PUT':
                body = json.loads(event.get('body', '{}'))
                friend_id = body.get('friend_id')
                status = body.get('status')
                if not friend_id or status not in ['accepted', 'rejected']:
                    return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Invalid params'}), 'isBase64Encoded': False}
                
                cur.execute(f"UPDATE user_friends SET status = '{status}', updated_at = NOW() WHERE user_id = {friend_id} AND friend_id = {user['id']} AND status = 'pending' RETURNING *")
                friendship = cur.fetchone()
                if not friendship:
                    return {'statusCode': 404, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Not found'}), 'isBase64Encoded': False}
                
                conn.commit()
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'friendship': dict(friendship)}, default=str), 'isBase64Encoded': False}
            
            elif method == 'DELETE':
                friend_id = query_params.get('friend_id')
                if not friend_id:
                    return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'friend_id required'}), 'isBase64Encoded': False}
                
                cur.execute(f"DELETE FROM user_friends WHERE (user_id = {user['id']} AND friend_id = {friend_id}) OR (user_id = {friend_id} AND friend_id = {user['id']})")
                conn.commit()
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'message': 'Removed'}), 'isBase64Encoded': False}
        
        # === PUBLIC PROFILES ===
        elif query_params.get('action') == 'public' or query_params.get('user_id'):
            user_id = query_params.get('user_id')
            search = query_params.get('search', '').replace("'", "''")
            
            if user_id:
                cur.execute(f"SELECT u.id, u.name, u.username, u.created_at, u.role, p.phone, p.bio, p.location, p.avatar_url, p.is_public, p.gender, p.callsign, p.telegram, u.username as telegram_username FROM users u LEFT JOIN user_profiles p ON u.id = p.user_id WHERE u.id = {user_id}")
                udata = cur.fetchone()
                if not udata or not udata.get('is_public', True):
                    return {'statusCode': 403, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Private'}), 'isBase64Encoded': False}
                
                cur.execute(f"SELECT * FROM user_vehicles WHERE user_id = {user_id} ORDER BY is_primary DESC, created_at DESC")
                vehicles = cur.fetchall()
                
                cur.execute(f"SELECT COUNT(*) as cnt FROM user_friends WHERE (user_id = {user_id} OR friend_id = {user_id}) AND status = 'accepted'")
                fcnt = cur.fetchone()
                
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'user': dict(udata), 'vehicles': [dict(v) for v in vehicles], 'friends_count': fcnt['cnt'] if fcnt else 0}, default=str), 'isBase64Encoded': False}
            
            else:
                search_cond = f"AND (u.name ILIKE '%{search}%' OR u.username ILIKE '%{search}%')" if search else ""
                cur.execute(f"SELECT u.id, u.name, u.username, u.created_at, p.location, p.avatar_url FROM users u LEFT JOIN user_profiles p ON u.id = p.user_id WHERE p.is_public = true {search_cond} ORDER BY u.created_at DESC LIMIT 100")
                users = cur.fetchall()
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'users': [dict(u) for u in users]}, default=str), 'isBase64Encoded': False}
        
        # === PROFILE (my profile) ===
        else:
            if not user:
                return {'statusCode': 401, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Auth required'}), 'isBase64Encoded': False}
            
            if method == 'GET':
                cur.execute(f"SELECT u.id, u.email, u.name, u.created_at, u.telegram_id, u.username as telegram_username, p.phone, p.avatar_url, p.bio, p.location, p.gender, p.callsign, p.telegram FROM users u LEFT JOIN user_profiles p ON u.id = p.user_id WHERE u.id = {user['id']}")
                profile = cur.fetchone()
                
                cur.execute(f"SELECT item_type, item_id, created_at FROM user_favorites WHERE user_id = {user['id']} ORDER BY created_at DESC")
                favorites = cur.fetchall()
                
                cur.execute(f"SELECT COUNT(*) as cnt FROM user_friends WHERE friend_id = {user['id']} AND status = 'pending'")
                pending_req = cur.fetchone()
                pending_count = pending_req['cnt'] if pending_req else 0
                
                cur.execute(f"SELECT COUNT(*) as cnt FROM user_friends WHERE (user_id = {user['id']} OR friend_id = {user['id']}) AND status = 'accepted'")
                friends_cnt = cur.fetchone()
                friends_count = friends_cnt['cnt'] if friends_cnt else 0
                
                cur.execute(f"SELECT COUNT(*) as cnt FROM user_vehicles WHERE user_id = {user['id']}")
                vehicles_cnt = cur.fetchone()
                vehicles_count = vehicles_cnt['cnt'] if vehicles_cnt else 0
                
                cur.execute(f"SELECT COUNT(*) as cnt FROM user_favorites WHERE user_id = {user['id']}")
                favorites_cnt = cur.fetchone()
                favorites_count = favorites_cnt['cnt'] if favorites_cnt else 0
                
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'profile': dict(profile) if profile else {}, 'favorites': [dict(f) for f in favorites], 'pending_friend_requests': pending_count, 'friends_count': friends_count, 'vehicles_count': vehicles_count, 'favorites_count': favorites_count}, default=str), 'isBase64Encoded': False}
            
            elif method == 'PUT':
                body = json.loads(event.get('body', '{}'))
                updates = []
                
                for field in ['phone', 'bio', 'location', 'avatar_url', 'gender', 'callsign', 'telegram']:
                    if field in body:
                        val = str(body[field]).replace("'", "''") if body[field] else 'NULL'
                        updates.append(f"{field} = '{val}'" if body[field] else f"{field} = NULL")
                
                if updates:
                    updates.append("updated_at = NOW()")
                    cur.execute(f"UPDATE user_profiles SET {', '.join(updates)} WHERE user_id = {user['id']}")
                    conn.commit()
                
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'message': 'Updated'}), 'isBase64Encoded': False}
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
