"""
Business: Admin panel - manage users and roles
Args: event with httpMethod, body, headers with X-Auth-Token; context with request_id
Returns: HTTP response with users list and role management
"""
import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

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
        SELECT u.id, u.email, u.name, u.role
        FROM users u
        JOIN user_sessions s ON u.id = s.user_id
        WHERE s.token = '{token}' AND s.expires_at > NOW()
        """
    )
    return cur.fetchone()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    print(f"Admin API called: {method}, headers: {event.get('headers', {})}")
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    token = get_header(headers, 'X-Auth-Token')
    print(f"[ADMIN] Headers keys: {list(headers.keys())}")
    print(f"[ADMIN] Token extracted: {token[:20] if token else None}...")
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No token provided'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        user = get_user_from_token(cur, token)
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid or expired token'}),
                'isBase64Encoded': False
            }
        
        if user['role'] not in ['admin', 'ceo', 'moderator']:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Admin access required'}),
                'isBase64Encoded': False
            }
        
        query_params = event.get('queryStringParameters', {}) or {}
        action = query_params.get('action', 'users')
        
        if method == 'GET' and action == 'stats':
            cur.execute("SELECT COUNT(*) as total_users FROM users")
            total_users = cur.fetchone()['total_users']
            
            cur.execute("SELECT COUNT(*) as active_users FROM users WHERE role != 'user'")
            active_users = cur.fetchone()['active_users']
            
            cur.execute("SELECT COUNT(*) as total_shops FROM shops")
            total_shops = cur.fetchone()['total_shops']
            
            cur.execute("SELECT COUNT(*) as total_announcements FROM announcements")
            total_announcements = cur.fetchone()['total_announcements']
            
            cur.execute("SELECT COUNT(*) as total_schools FROM schools")
            total_schools = cur.fetchone()['total_schools']
            
            cur.execute("SELECT COUNT(*) as total_services FROM services")
            total_services = cur.fetchone()['total_services']
            
            cur.execute(
                """
                SELECT 
                    a.id, a.action, a.location, a.created_at,
                    u.name as user_name
                FROM user_activity_log a
                LEFT JOIN users u ON a.user_id = u.id
                ORDER BY a.created_at DESC
                LIMIT 10
                """
            )
            recent_activity = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'stats': {
                        'total_users': total_users,
                        'active_users': active_users,
                        'total_shops': total_shops,
                        'total_announcements': total_announcements,
                        'total_schools': total_schools,
                        'total_services': total_services
                    },
                    'recent_activity': [dict(a) for a in recent_activity]
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            cur.execute(
                """
                SELECT 
                    u.id, u.email, u.name, u.role, u.created_at,
                    u.telegram_id, u.username, u.first_name, u.last_name,
                    p.phone, p.bio, p.location
                FROM users u
                LEFT JOIN user_profiles p ON u.id = p.user_id
                ORDER BY u.created_at DESC
                """
            )
            users = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'users': [dict(u) for u in users]
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            if user['role'] == 'moderator':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Модераторы не могут изменять роли'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            new_role = body.get('role')
            
            if not user_id or not new_role:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id and role required'}),
                    'isBase64Encoded': False
                }
            
            if new_role not in ['user', 'admin', 'moderator']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid role'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                f"SELECT role FROM users WHERE id = {user_id}"
            )
            target_user = cur.fetchone()
            
            if target_user and target_user['role'] == 'ceo':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нельзя изменить роль CEO'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                f"UPDATE users SET role = '{new_role}' WHERE id = {user_id} RETURNING id, name, role"
            )
            updated_user = cur.fetchone()
            conn.commit()
            
            if not updated_user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Role updated',
                    'user': dict(updated_user)
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            if user['role'] not in ['admin', 'ceo']:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Only admin/ceo can delete users'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"SELECT role FROM users WHERE id = {user_id}")
            target_user = cur.fetchone()
            
            if target_user and target_user['role'] == 'ceo':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Cannot delete CEO'}),
                    'isBase64Encoded': False
                }
            
            # Удаляем связанные данные
            cur.execute(f"DELETE FROM user_sessions WHERE user_id = {user_id}")
            cur.execute(f"DELETE FROM user_profiles WHERE user_id = {user_id}")
            cur.execute(f"DELETE FROM user_activity_log WHERE user_id = {user_id}")
            cur.execute(f"DELETE FROM user_favorites WHERE user_id = {user_id}")
            cur.execute(f"DELETE FROM user_friends WHERE user_id = {user_id} OR friend_id = {user_id}")
            cur.execute(f"DELETE FROM user_vehicles WHERE user_id = {user_id}")
            
            # Теперь удаляем самого пользователя
            cur.execute(f"DELETE FROM users WHERE id = {user_id} RETURNING id, name")
            deleted_user = cur.fetchone()
            conn.commit()
            
            if not deleted_user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'User deleted',
                    'user': dict(deleted_user)
                }),
                'isBase64Encoded': False
            }
        
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