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

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
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
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email')
                password = body.get('password')
                name = body.get('name')
                
                if not email or not password or not name:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email, password and name required'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                try:
                    cur.execute(
                        "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id, email, name, created_at",
                        (email, password_hash, name)
                    )
                    user = cur.fetchone()
                    
                    cur.execute(
                        "INSERT INTO user_profiles (user_id) VALUES (%s)",
                        (user['id'],)
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
                                'email': user['email'],
                                'name': user['name']
                            }
                        }),
                        'isBase64Encoded': False
                    }
                except psycopg2.IntegrityError:
                    conn.rollback()
                    return {
                        'statusCode': 409,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email already exists'}),
                        'isBase64Encoded': False
                    }
            
            elif action == 'login':
                email = body.get('email')
                password = body.get('password')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email and password required'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id, email, name FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
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
                            'email': user['email'],
                            'name': user['name']
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'logout':
                token = event.get('headers', {}).get('x-auth-token')
                
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
            token = event.get('headers', {}).get('x-auth-token')
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No token provided'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                SELECT u.id, u.email, u.name, u.created_at
                FROM users u
                JOIN user_sessions s ON u.id = s.user_id
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
                        'name': user['name']
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
