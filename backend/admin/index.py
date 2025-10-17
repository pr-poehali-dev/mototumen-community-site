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
        
        if user['role'] != 'admin':
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Admin access required'}),
                'isBase64Encoded': False
            }
        
        if method == 'GET':
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
                f"SELECT name, first_name FROM users WHERE id = {user_id}"
            )
            target_user = cur.fetchone()
            
            if target_user and target_user['first_name'] == 'Anton':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нельзя изменить роль главного администратора'}),
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