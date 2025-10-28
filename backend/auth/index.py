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
import urllib.request
import boto3
import jwt
import requests

TELEGRAM_CHANNEL_ID = "@Mt_Russia"

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

def notify_ceo(message: str, notification_type: str = 'info'):
    notify_url = os.environ.get('NOTIFY_CEO_URL')
    if not notify_url:
        print("NOTIFY_CEO_URL not configured")
        return
    
    try:
        requests.post(
            notify_url,
            json={'message': message, 'type': notification_type},
            timeout=5
        )
    except Exception as e:
        print(f"Failed to notify CEO: {e}")

def check_channel_subscription(user_id: int, username: str = None) -> bool:
    """Check if user is subscribed to Mt_Russia announcement channel"""
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        print("[CHECK_SUBSCRIPTION] TELEGRAM_BOT_TOKEN not set, allowing auth")
        return True
    
    print(f"[CHECK_SUBSCRIPTION] Checking user {user_id} in channel {TELEGRAM_CHANNEL_ID}")
    
    try:
        url = f"https://api.telegram.org/bot{bot_token}/getChatMember?chat_id={TELEGRAM_CHANNEL_ID}&user_id={user_id}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        with urllib.request.urlopen(req, timeout=5) as response:
            response_text = response.read().decode()
            print(f"[CHECK_SUBSCRIPTION] Telegram API response: {response_text}")
            data = json.loads(response_text)
            
            if not data.get('ok'):
                error_desc = data.get('description', 'Unknown error')
                print(f"[CHECK_SUBSCRIPTION] API error: {error_desc}")
                return False
            
            status = data.get('result', {}).get('status', '')
            is_member = status in ['member', 'administrator', 'creator']
            
            print(f"[CHECK_SUBSCRIPTION] user_id={user_id}, status={status}, is_member={is_member}")
            return is_member
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if hasattr(e, 'read') else 'no body'
        print(f"[CHECK_SUBSCRIPTION] HTTPError for user {user_id}: code={e.code}, body={error_body}")
        return False
    except Exception as e:
        print(f"[CHECK_SUBSCRIPTION] Error checking subscription for user {user_id}: {e}")
        return False

def upload_avatar_to_s3(photo_url: str, user_id: int) -> Optional[str]:
    """Download avatar from URL and upload to S3"""
    if not photo_url or not photo_url.startswith('http'):
        return None
    
    try:
        req = urllib.request.Request(photo_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            image_data = response.read()
        
        file_hash = hashlib.md5(image_data).hexdigest()[:8]
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_name = f"avatars/{user_id}_{timestamp}_{file_hash}.jpg"
        
        s3_client = boto3.client(
            's3',
            endpoint_url='https://storage.yandexcloud.net',
            aws_access_key_id=os.environ.get('YC_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('YC_SECRET_ACCESS_KEY'),
            region_name='ru-central1'
        )
        
        bucket_name = os.environ.get('YC_STORAGE_BUCKET')
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=image_data,
            ContentType='image/jpeg',
            ACL='public-read'
        )
        
        return f"https://storage.yandexcloud.net/{bucket_name}/{file_name}"
    except Exception as e:
        print(f"[AVATAR UPLOAD ERROR] {str(e)}")
        return None

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
    
    # DEBUG: Check channel info
    if method == 'GET' and query_params.get('debug') == 'channel':
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        if not bot_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN not set'}),
                'isBase64Encoded': False
            }
        
        try:
            # Get chat info
            chat_url = f"https://api.telegram.org/bot{bot_token}/getChat?chat_id={TELEGRAM_CHANNEL_ID}"
            chat_req = urllib.request.Request(chat_url)
            with urllib.request.urlopen(chat_req, timeout=5) as response:
                chat_data = json.loads(response.read().decode())
            
            # Get bot info as member
            bot_url = f"https://api.telegram.org/bot{bot_token}/getChatMember?chat_id={TELEGRAM_CHANNEL_ID}&user_id=7757894867"
            bot_req = urllib.request.Request(bot_url)
            with urllib.request.urlopen(bot_req, timeout=5) as response:
                bot_data = json.loads(response.read().decode())
            
            # Try to get Nevsky's status
            nevsky_url = f"https://api.telegram.org/bot{bot_token}/getChatMember?chat_id={TELEGRAM_CHANNEL_ID}&user_id=5880308588"
            nevsky_req = urllib.request.Request(nevsky_url)
            try:
                with urllib.request.urlopen(nevsky_req, timeout=5) as response:
                    nevsky_data = json.loads(response.read().decode())
            except Exception as e:
                nevsky_data = {'error': str(e)}
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'channel_id': TELEGRAM_CHANNEL_ID,
                    'chat_info': chat_data,
                    'bot_member_info': bot_data,
                    'nevsky_member_info': nevsky_data
                }, ensure_ascii=False, indent=2),
                'isBase64Encoded': False
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
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
            
            if action == 'verify_jwt_token':
                jwt_token = body.get('token')
                
                if not jwt_token:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Token required'}),
                        'isBase64Encoded': False
                    }
                
                try:
                    jwt_secret = os.environ.get('JWT_SECRET_KEY', 'твой_секретный_ключ_123')
                    payload = jwt.decode(jwt_token, jwt_secret, algorithms=['HS256'])
                    
                    telegram_id = payload.get('id')
                    first_name = payload.get('first_name')
                    last_name = payload.get('last_name')
                    username = payload.get('username')
                    
                    if not check_channel_subscription(telegram_id, username):
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({
                                'error': 'subscription_required',
                                'message': 'Для авторизации необходимо подписаться на канал @Mt_Russia'
                            }),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(
                        "SELECT id, name, email, role FROM users WHERE telegram_id = %s",
                        (telegram_id,)
                    )
                    auth_user = cur.fetchone()
                    
                    if auth_user:
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
                                    'role': auth_user['role'],
                                    'telegram_id': telegram_id,
                                    'first_name': first_name,
                                    'last_name': last_name,
                                    'username': username
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
                            "INSERT INTO user_profiles (user_id, telegram) VALUES (%s, %s)",
                            (auth_user['id'], username)
                        )
                        
                        new_token = generate_token()
                        expires_at = datetime.now() + timedelta(days=30)
                        
                        cur.execute(
                            "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                            (auth_user['id'], new_token, expires_at)
                        )
                        conn.commit()
                        
                        notify_ceo(
                            f"🎉 <b>Новая регистрация</b>\n\n"
                            f"Пользователь: {name}\n"
                            f"Telegram: @{username if username else 'не указан'}\n"
                            f"ID: {auth_user['id']}",
                            'new_user'
                        )
                        
                        return {
                            'statusCode': 201,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({
                                'token': new_token,
                                'user': {
                                    'id': auth_user['id'],
                                    'name': auth_user['name'],
                                    'email': auth_user['email'],
                                    'role': auth_user['role'],
                                    'telegram_id': telegram_id,
                                    'first_name': first_name,
                                    'last_name': last_name,
                                    'username': username
                                }
                            }),
                            'isBase64Encoded': False
                        }
                        
                except jwt.ExpiredSignatureError:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Token expired'}),
                        'isBase64Encoded': False
                    }
                except jwt.InvalidTokenError as e:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Invalid token: {str(e)}'}),
                        'isBase64Encoded': False
                    }
            
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
                
                if not check_channel_subscription(telegram_id):
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'error': 'subscription_required',
                            'message': 'Для авторизации необходимо подписаться на канал @MotoTyumen'
                        }),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT id, name, email, role FROM users WHERE telegram_id = %s",
                    (telegram_id,)
                )
                auth_user = cur.fetchone()
                
                if auth_user:
                    if photo_url:
                        s3_url = upload_avatar_to_s3(photo_url, auth_user['id'])
                        avatar_to_save = s3_url if s3_url else photo_url
                        cur.execute(
                            "UPDATE user_profiles SET avatar_url = %s WHERE user_id = %s",
                            (avatar_to_save, auth_user['id'])
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
                    
                    s3_avatar_url = None
                    if photo_url:
                        s3_avatar_url = upload_avatar_to_s3(photo_url, auth_user['id'])
                    avatar_to_save = s3_avatar_url if s3_avatar_url else photo_url
                    
                    cur.execute(
                        "INSERT INTO user_profiles (user_id, avatar_url, telegram) VALUES (%s, %s, %s)",
                        (auth_user['id'], avatar_to_save, username)
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
        
        # === VERIFY TOKEN (GET /auth?verify=true) ===
        if method == 'GET' and query_params.get('verify') == 'true':
            print(f"[AUTH GET VERIFY] Headers: {list(headers.keys())}")
            print(f"[AUTH GET VERIFY] Token extracted: {token[:20] if token else None}...")
            
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
                try:
                    body = json.loads(event.get('body', '{}'))
                    print(f"[GARAGE POST] Body: {body}")
                    
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
                    elif isinstance(photo_url_input, str) and photo_url_input.strip():
                        try:
                            json.loads(photo_url_input)
                            photo_json = photo_url_input
                        except (json.JSONDecodeError, ValueError):
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
                    
                    sql = f"INSERT INTO user_vehicles (user_id, vehicle_type, brand, model, year, photo_url, description, is_primary, mileage, power_hp, displacement, modifications) VALUES ({user['id']}, '{vtype}', '{brand}', '{model}', {year}, '{photo_json_escaped}', '{desc}', {is_primary}, {mileage}, {power_hp}, {displacement}, '{mods}') RETURNING *"
                    print(f"[GARAGE POST] SQL: {sql}")
                    
                    cur.execute(sql)
                    vehicle = cur.fetchone()
                    conn.commit()
                    
                    vehicle_dict = {
                        'id': vehicle['id'],
                        'user_id': vehicle['user_id'],
                        'vehicle_type': vehicle['vehicle_type'],
                        'brand': vehicle['brand'],
                        'model': vehicle['model'],
                        'year': vehicle['year'],
                        'photo_url': vehicle['photo_url'],
                        'description': vehicle['description'],
                        'is_primary': vehicle['is_primary'],
                        'mileage': vehicle['mileage'],
                        'power_hp': vehicle['power_hp'],
                        'displacement': vehicle['displacement'],
                        'modifications': vehicle['modifications'],
                        'created_at': str(vehicle['created_at']) if vehicle.get('created_at') else None
                    }
                    
                    return {'statusCode': 201, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'vehicle': vehicle_dict}), 'isBase64Encoded': False}
                except Exception as e:
                    print(f"[GARAGE POST ERROR] {str(e)}")
                    return {'statusCode': 500, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': str(e)}), 'isBase64Encoded': False}
            
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
                
                vehicle_dict = {
                    'id': vehicle['id'],
                    'user_id': vehicle['user_id'],
                    'vehicle_type': vehicle['vehicle_type'],
                    'brand': vehicle['brand'],
                    'model': vehicle['model'],
                    'year': vehicle['year'],
                    'photo_url': vehicle['photo_url'],
                    'description': vehicle['description'],
                    'is_primary': vehicle['is_primary'],
                    'mileage': vehicle['mileage'],
                    'power_hp': vehicle['power_hp'],
                    'displacement': vehicle['displacement'],
                    'modifications': vehicle['modifications'],
                    'created_at': str(vehicle['created_at']) if vehicle.get('created_at') else None
                }
                
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'vehicle': vehicle_dict}), 'isBase64Encoded': False}
            
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
                
                cur.execute(f"SELECT COUNT(*) as cnt FROM user_favorites WHERE user_id = {user_id}")
                fav_cnt = cur.fetchone()
                
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'user': dict(udata), 'vehicles': [dict(v) for v in vehicles], 'friends_count': fcnt['cnt'] if fcnt else 0, 'favorites_count': fav_cnt['cnt'] if fav_cnt else 0}, default=str), 'isBase64Encoded': False}
            
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
                
                cur.execute(f"SELECT COUNT(*) as cnt FROM user_achievements WHERE user_id = {user['id']}")
                achievements_cnt = cur.fetchone()
                achievements_count = achievements_cnt['cnt'] if achievements_cnt else 0
                
                cur.execute("SELECT COUNT(*) as cnt FROM achievements")
                total_ach = cur.fetchone()
                total_achievements = total_ach['cnt'] if total_ach else 0
                
                cur.execute(f"SELECT COUNT(*) as cnt FROM user_badges WHERE user_id = {user['id']}")
                badges_cnt = cur.fetchone()
                badges_count = badges_cnt['cnt'] if badges_cnt else 0
                
                return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'profile': dict(profile) if profile else {}, 'favorites': [dict(f) for f in favorites], 'pending_friend_requests': pending_count, 'friends_count': friends_count, 'vehicles_count': vehicles_count, 'favorites_count': favorites_count, 'achievements_count': achievements_count, 'total_achievements': total_achievements, 'badges_count': badges_count}, default=str), 'isBase64Encoded': False}
            
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