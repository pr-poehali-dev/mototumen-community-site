"""
Business: User authentication (register, login, logout, verify token)
Args: event with httpMethod, body, headers; context with request_id
Returns: HTTP response with auth tokens and user data
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

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
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
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
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
                user = cur.fetchone()
                
                if user:
                    if photo_url:
                        cur.execute(
                            "UPDATE user_profiles SET avatar_url = %s WHERE user_id = %s",
                            (photo_url, user['id'])
                        )
                    
                    if username:
                        cur.execute(
                            "UPDATE user_profiles SET telegram = %s WHERE user_id = %s",
                            (username, user['id'])
                        )
                    
                    token = generate_token()
                    expires_at = datetime.now() + timedelta(days=30)
                    
                    cur.execute(
                        "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                        (user['id'], token, expires_at)
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'token': token,
                            'user': {
                                'id': user['id'],
                                'name': user['name'],
                                'email': user['email'],
                                'role': user['role']
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
                    user = cur.fetchone()
                    
                    cur.execute(
                        "INSERT INTO user_profiles (user_id, avatar_url, telegram) VALUES (%s, %s, %s)",
                        (user['id'], photo_url, username)
                    )
                    
                    token = generate_token()
                    expires_at = datetime.now() + timedelta(days=30)
                    
                    cur.execute(
                        "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                        (user['id'], token, expires_at)
                    )
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'token': token,
                            'user': {
                                'id': user['id'],
                                'name': user['name'],
                                'email': user['email'],
                                'role': user['role']
                            }
                        }),
                        'isBase64Encoded': False
                    }
            

            
            elif action == 'logout':
                token = get_header(event.get('headers', {}), 'X-Auth-Token')
                
                if token:
                    cur.execute("DELETE FROM user_sessions WHERE token = %s", (token,))
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Logged out'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            headers = event.get('headers', {})
            token = get_header(headers, 'X-Auth-Token')
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
            user = cur.fetchone()
            
            if not user:
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
                        'id': user['id'],
                        'email': user['email'],
                        'name': user['name'],
                        'role': user['role'],
                        'callsign': user.get('callsign')
                    }
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