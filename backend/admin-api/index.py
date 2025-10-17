'''
Business: API для управления пользователями, ролями и получения истории действий
Args: event - dict с httpMethod, body, queryStringParameters, headers
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict со списком пользователей, ролями или историей действий
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

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
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'list')
        
        if method == 'GET':
            if action == 'list' or action == 'users':
                return get_users_with_roles()
            elif action == 'activity':
                user_id = params.get('user_id')
                if not user_id:
                    return error_response('user_id обязателен для action=activity', 400)
                return get_user_activity(int(user_id))
            else:
                return error_response('Неизвестный action', 400)
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'assign_role':
                return assign_role(body)
            elif action == 'remove_role':
                return remove_role(body)
            elif action == 'grant_permission':
                return grant_permission(body)
            elif action == 'revoke_permission':
                return revoke_permission(body)
            elif action == 'log_activity':
                return log_activity(body)
            else:
                return error_response('Неизвестный action', 400)
        
        else:
            return error_response('Метод не поддерживается', 405)
    
    except Exception as e:
        return error_response(f'Ошибка сервера: {str(e)}', 500)

def get_users_with_roles() -> Dict[str, Any]:
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT 
                    u.id,
                    u.name,
                    u.email,
                    u.username,
                    u.created_at,
                    p.avatar_url,
                    p.location,
                    COALESCE(
                        json_agg(
                            DISTINCT ur.role_id
                        ) FILTER (WHERE ur.role_id IS NOT NULL),
                        '[]'
                    ) as roles,
                    COALESCE(
                        json_agg(
                            DISTINCT up.permission
                        ) FILTER (WHERE up.permission IS NOT NULL),
                        '[]'
                    ) as permissions
                FROM t_p21120869_mototumen_community_.users u
                LEFT JOIN t_p21120869_mototumen_community_.user_profiles p ON u.id = p.user_id
                LEFT JOIN t_p21120869_mototumen_community_.user_roles ur ON u.id = ur.user_id
                LEFT JOIN t_p21120869_mototumen_community_.user_permissions up ON u.id = up.user_id
                GROUP BY u.id, u.name, u.email, u.username, u.created_at, p.avatar_url, p.location
                ORDER BY u.created_at DESC
            ''')
            
            users = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'users': [dict(user) for user in users]
                }, default=str),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def get_user_activity(user_id: int) -> Dict[str, Any]:
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''
                SELECT 
                    id,
                    action,
                    location,
                    details,
                    created_at
                FROM t_p21120869_mototumen_community_.user_activity_log
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 100
            ''', (user_id,))
            
            activities = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'activities': [dict(activity) for activity in activities]
                }, default=str),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def assign_role(body: Dict[str, Any]) -> Dict[str, Any]:
    user_id = body.get('user_id')
    role_id = body.get('role_id')
    assigned_by = body.get('assigned_by')
    
    if not user_id or not role_id:
        return error_response('user_id и role_id обязательны', 400)
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO t_p21120869_mototumen_community_.user_roles 
                (user_id, role_id, assigned_by)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id, role_id) DO NOTHING
            ''', (user_id, role_id, assigned_by))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Роль назначена'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def remove_role(body: Dict[str, Any]) -> Dict[str, Any]:
    user_id = body.get('user_id')
    role_id = body.get('role_id')
    
    if not user_id or not role_id:
        return error_response('user_id и role_id обязательны', 400)
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('''
                DELETE FROM t_p21120869_mototumen_community_.user_roles 
                WHERE user_id = %s AND role_id = %s
            ''', (user_id, role_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Роль удалена'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def grant_permission(body: Dict[str, Any]) -> Dict[str, Any]:
    user_id = body.get('user_id')
    permission = body.get('permission')
    granted_by = body.get('granted_by')
    
    if not user_id or not permission:
        return error_response('user_id и permission обязательны', 400)
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO t_p21120869_mototumen_community_.user_permissions 
                (user_id, permission, granted_by)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id, permission) DO NOTHING
            ''', (user_id, permission, granted_by))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Разрешение выдано'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def revoke_permission(body: Dict[str, Any]) -> Dict[str, Any]:
    user_id = body.get('user_id')
    permission = body.get('permission')
    
    if not user_id or not permission:
        return error_response('user_id и permission обязательны', 400)
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('''
                DELETE FROM t_p21120869_mototumen_community_.user_permissions 
                WHERE user_id = %s AND permission = %s
            ''', (user_id, permission))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Разрешение отозвано'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def log_activity(body: Dict[str, Any]) -> Dict[str, Any]:
    user_id = body.get('user_id')
    action = body.get('action')
    location = body.get('location')
    details = body.get('details')
    
    if not user_id or not action:
        return error_response('user_id и action обязательны', 400)
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('''
                INSERT INTO t_p21120869_mototumen_community_.user_activity_log 
                (user_id, action, location, details)
                VALUES (%s, %s, %s, %s)
            ''', (user_id, action, location, details))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Действие залогировано'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def error_response(message: str, status_code: int = 400) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }