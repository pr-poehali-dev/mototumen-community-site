"""
Business: User profile management (get, update profile and favorites)
Args: event with httpMethod, body, headers with X-Auth-Token; context with request_id
Returns: HTTP response with profile data
"""
import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def get_user_from_token(cur, token: str) -> Optional[Dict]:
    cur.execute(
        """
        SELECT u.id, u.email, u.name
        FROM users u
        JOIN user_sessions s ON u.id = s.user_id
        WHERE s.token = %s AND s.expires_at > NOW()
        """,
        (token,)
    )
    return cur.fetchone()

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
    
    headers = event.get('headers', {})
    token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
    
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
        
        if method == 'GET':
            cur.execute(
                """
                SELECT 
                    u.id, u.email, u.name, u.created_at,
                    p.phone, p.avatar_url, p.bio, p.location
                FROM users u
                LEFT JOIN user_profiles p ON u.id = p.user_id
                WHERE u.id = %s
                """,
                (user['id'],)
            )
            profile = cur.fetchone()
            
            cur.execute(
                """
                SELECT item_type, item_id, created_at
                FROM user_favorites
                WHERE user_id = %s
                ORDER BY created_at DESC
                """,
                (user['id'],)
            )
            favorites = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'profile': dict(profile) if profile else {},
                    'favorites': [dict(f) for f in favorites]
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            phone = body.get('phone')
            bio = body.get('bio')
            location = body.get('location')
            avatar_url = body.get('avatar_url')
            
            cur.execute(
                """
                UPDATE user_profiles 
                SET phone = COALESCE(%s, phone),
                    bio = COALESCE(%s, bio),
                    location = COALESCE(%s, location),
                    avatar_url = COALESCE(%s, avatar_url),
                    updated_at = NOW()
                WHERE user_id = %s
                """,
                (phone, bio, location, avatar_url, user['id'])
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Profile updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'add_favorite':
                item_type = body.get('item_type')
                item_id = body.get('item_id')
                
                if not item_type or not item_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'item_type and item_id required'}),
                        'isBase64Encoded': False
                    }
                
                try:
                    cur.execute(
                        "INSERT INTO user_favorites (user_id, item_type, item_id) VALUES (%s, %s, %s)",
                        (user['id'], item_type, item_id)
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'message': 'Added to favorites'}),
                        'isBase64Encoded': False
                    }
                except psycopg2.IntegrityError:
                    conn.rollback()
                    return {
                        'statusCode': 409,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Already in favorites'}),
                        'isBase64Encoded': False
                    }
            
            elif action == 'remove_favorite':
                item_type = body.get('item_type')
                item_id = body.get('item_id')
                
                if not item_type or not item_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'item_type and item_id required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "DELETE FROM user_favorites WHERE user_id = %s AND item_type = %s AND item_id = %s",
                    (user['id'], item_type, item_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Removed from favorites'}),
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