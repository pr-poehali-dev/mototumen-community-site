'''
Business: API для управления пользователями (просмотр, блокировка, изменение ролей)
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с данными пользователей или результатом операции
'''

import json
import os
import psycopg2
import jwt
from typing import Dict, Any, Optional

def verify_admin_token(token: Optional[str]) -> bool:
    """Проверка JWT токена админа"""
    if not token:
        return False
    try:
        jwt_secret = os.environ.get('JWT_SECRET_KEY', 'default-secret')
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return payload.get('admin', False)
    except:
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    # Проверка авторизации
    auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
    if not verify_admin_token(auth_token):
        return {
            'statusCode': 401,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        # GET - получение списка пользователей
        if method == 'GET':
            cur.execute("""
                SELECT u.id, u.username, u.email, u.created_at, u.is_active,
                       up.full_name, up.avatar_url, up.bio,
                       COALESCE(
                           json_agg(
                               json_build_object('role', ur.role)
                           ) FILTER (WHERE ur.role IS NOT NULL),
                           '[]'
                       ) as roles
                FROM t_p21120869_mototumen_community_.users u
                LEFT JOIN t_p21120869_mototumen_community_.user_profiles up ON u.id = up.user_id
                LEFT JOIN t_p21120869_mototumen_community_.user_roles ur ON u.id = ur.user_id
                GROUP BY u.id, u.username, u.email, u.created_at, u.is_active,
                         up.full_name, up.avatar_url, up.bio
                ORDER BY u.created_at DESC
            """)
            rows = cur.fetchall()
            
            users = []
            for row in rows:
                users.append({
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'createdAt': row[3].isoformat() if row[3] else None,
                    'isActive': row[4],
                    'fullName': row[5],
                    'avatarUrl': row[6],
                    'bio': row[7],
                    'roles': row[8] if row[8] else []
                })
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'users': users}),
                'isBase64Encoded': False
            }
        
        # PUT - обновление статуса пользователя
        elif method == 'PUT':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'User ID required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            # Обновление статуса активности
            if 'isActive' in body_data:
                cur.execute("""
                    UPDATE t_p21120869_mototumen_community_.users
                    SET is_active = %s
                    WHERE id = %s
                """, (body_data['isActive'], user_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # POST - добавление роли пользователю
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('userId')
            role = body_data.get('role')
            
            if not user_id or not role:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'User ID and role required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO t_p21120869_mototumen_community_.user_roles (user_id, role, created_at)
                VALUES (%s, %s, NOW())
                ON CONFLICT DO NOTHING
            """, (user_id, role))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # DELETE - удаление роли у пользователя
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('userId')
            role = query_params.get('role')
            
            if not user_id or not role:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'User ID and role required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                DELETE FROM t_p21120869_mototumen_community_.user_roles
                WHERE user_id = %s AND role = %s
            """, (user_id, role))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
    finally:
        cur.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
