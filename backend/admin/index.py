"""
Business: Admin panel - управление пользователями, ролями, разрешениями и активностью
Args: event с httpMethod, body, headers с X-Auth-Token; context с request_id
Returns: HTTP response с данными пользователей, ролей и активности
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
    name_lower = name.lower()
    for key, value in headers.items():
        if key.lower() == name_lower:
            return value
    return None

def get_user_from_token(cur, token: str) -> Optional[Dict]:
    cur.execute(
        f"""
        SELECT u.id, u.email, u.name, u.role
        FROM t_p21120869_mototumen_community_.users u
        JOIN t_p21120869_mototumen_community_.user_sessions s ON u.id = s.user_id
        WHERE s.token = '{token}' AND s.expires_at > NOW()
        """
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
    
    headers_dict = event.get('headers', {})
    token = get_header(headers_dict, 'X-Auth-Token')
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'users')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if action in ['roles', 'user_detail', 'activity'] and not token:
            return {
                'statusCode': 401,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Authentication required'}),
                'isBase64Encoded': False
            }
        
        if token:
            user = get_user_from_token(cur, token)
            if not user:
                return {
                    'statusCode': 401,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Invalid or expired token'}),
                    'isBase64Encoded': False
                }
            
            if user['role'] != 'admin':
                return {
                    'statusCode': 403,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Admin access required'}),
                    'isBase64Encoded': False
                }
        
        if method == 'GET':
            if action == 'users':
                return get_users_with_roles(cur, cors_headers)
            elif action == 'user_detail':
                user_id = params.get('user_id')
                if not user_id:
                    return error_response('user_id required', 400, cors_headers)
                return get_user_details(cur, user_id, cors_headers)
            elif action == 'activity':
                user_id = params.get('user_id')
                if not user_id:
                    return error_response('user_id required', 400, cors_headers)
                return get_user_activity(cur, user_id, cors_headers)
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if action == 'assign_role':
                return assign_role(conn, cur, body, cors_headers)
            elif action == 'remove_role':
                return remove_role(conn, cur, body, cors_headers)
            elif action == 'grant_permission':
                return grant_permission(conn, cur, body, cors_headers)
            elif action == 'revoke_permission':
                return revoke_permission(conn, cur, body, cors_headers)
            elif action == 'log_activity':
                return log_activity(conn, cur, body, cors_headers)
            elif action == 'update_role':
                return update_user_role(conn, cur, body, cors_headers)
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            return update_user_role(conn, cur, body, cors_headers)
        
        return error_response('Unknown action', 400, cors_headers)
        
    except Exception as e:
        return error_response(str(e), 500, cors_headers)
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

def get_users_with_roles(cur, headers):
    cur.execute("""
        SELECT 
            u.id,
            u.name,
            u.email,
            u.username,
            u.first_name,
            u.last_name,
            u.telegram_id,
            u.role as status,
            u.created_at,
            p.location,
            p.avatar_url,
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
        GROUP BY u.id, p.location, p.avatar_url
        ORDER BY u.created_at DESC
    """)
    
    users = [dict(u) for u in cur.fetchall()]
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'users': users}, default=str),
        'isBase64Encoded': False
    }

def get_user_details(cur, user_id, headers):
    cur.execute("""
        SELECT 
            u.id,
            u.name,
            u.email,
            u.username,
            u.first_name,
            u.last_name,
            u.telegram_id,
            u.created_at,
            p.location,
            p.avatar_url,
            p.bio
        FROM t_p21120869_mototumen_community_.users u
        LEFT JOIN t_p21120869_mototumen_community_.user_profiles p ON u.id = p.user_id
        WHERE u.id = %s
    """, (user_id,))
    
    user = cur.fetchone()
    if not user:
        return error_response('User not found', 404, headers)
    
    cur.execute("""
        SELECT role_id, assigned_at, assigned_by
        FROM t_p21120869_mototumen_community_.user_roles
        WHERE user_id = %s
    """, (user_id,))
    roles = [dict(r) for r in cur.fetchall()]
    
    cur.execute("""
        SELECT permission, granted_at, granted_by
        FROM t_p21120869_mototumen_community_.user_permissions
        WHERE user_id = %s
    """, (user_id,))
    permissions = [dict(p) for p in cur.fetchall()]
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'user': dict(user),
            'roles': roles,
            'permissions': permissions
        }, default=str),
        'isBase64Encoded': False
    }

def get_user_activity(cur, user_id, headers):
    limit = 50
    
    cur.execute("""
        SELECT 
            id,
            action,
            location,
            details,
            created_at
        FROM t_p21120869_mototumen_community_.user_activity_log
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT %s
    """, (user_id, limit))
    
    activities = [dict(a) for a in cur.fetchall()]
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'activities': activities}, default=str),
        'isBase64Encoded': False
    }

def assign_role(conn, cur, body, headers):
    user_id = body.get('user_id')
    role_id = body.get('role_id')
    assigned_by = body.get('assigned_by')
    
    if not user_id or not role_id:
        return error_response('user_id and role_id required', 400, headers)
    
    cur.execute("""
        INSERT INTO t_p21120869_mototumen_community_.user_roles 
        (user_id, role_id, assigned_by)
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id, role_id) DO NOTHING
    """, (user_id, role_id, assigned_by))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': 'Role assigned successfully'}),
        'isBase64Encoded': False
    }

def remove_role(conn, cur, body, headers):
    user_id = body.get('user_id')
    role_id = body.get('role_id')
    
    if not user_id or not role_id:
        return error_response('user_id and role_id required', 400, headers)
    
    cur.execute("""
        DELETE FROM t_p21120869_mototumen_community_.user_roles
        WHERE user_id = %s AND role_id = %s
    """, (user_id, role_id))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': 'Role removed successfully'}),
        'isBase64Encoded': False
    }

def grant_permission(conn, cur, body, headers):
    user_id = body.get('user_id')
    permission = body.get('permission')
    granted_by = body.get('granted_by')
    
    if not user_id or not permission:
        return error_response('user_id and permission required', 400, headers)
    
    cur.execute("""
        INSERT INTO t_p21120869_mototumen_community_.user_permissions 
        (user_id, permission, granted_by)
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id, permission) DO NOTHING
    """, (user_id, permission, granted_by))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': 'Permission granted successfully'}),
        'isBase64Encoded': False
    }

def revoke_permission(conn, cur, body, headers):
    user_id = body.get('user_id')
    permission = body.get('permission')
    
    if not user_id or not permission:
        return error_response('user_id and permission required', 400, headers)
    
    cur.execute("""
        DELETE FROM t_p21120869_mototumen_community_.user_permissions
        WHERE user_id = %s AND permission = %s
    """, (user_id, permission))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': 'Permission revoked successfully'}),
        'isBase64Encoded': False
    }

def log_activity(conn, cur, body, headers):
    user_id = body.get('user_id')
    action = body.get('action')
    location = body.get('location')
    details = body.get('details')
    ip_address = body.get('ip_address')
    user_agent = body.get('user_agent')
    
    if not user_id or not action:
        return error_response('user_id and action required', 400, headers)
    
    cur.execute("""
        INSERT INTO t_p21120869_mototumen_community_.user_activity_log 
        (user_id, action, location, details, ip_address, user_agent)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (user_id, action, location, details, ip_address, user_agent))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': 'Activity logged successfully'}),
        'isBase64Encoded': False
    }

def update_user_role(conn, cur, body, headers):
    user_id = body.get('user_id')
    new_role = body.get('role')
    
    if not user_id or not new_role:
        return error_response('user_id and role required', 400, headers)
    
    if new_role not in ['user', 'admin', 'moderator']:
        return error_response('Invalid role', 400, headers)
    
    cur.execute(
        f"SELECT name, first_name FROM t_p21120869_mototumen_community_.users WHERE id = {user_id}"
    )
    target_user = cur.fetchone()
    
    if target_user and target_user['first_name'] == 'Anton':
        return error_response('Нельзя изменить роль главного администратора', 403, headers)
    
    cur.execute(
        f"UPDATE t_p21120869_mototumen_community_.users SET role = '{new_role}' WHERE id = {user_id} RETURNING id, name, role"
    )
    updated_user = cur.fetchone()
    conn.commit()
    
    if not updated_user:
        return error_response('User not found', 404, headers)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'message': 'Role updated',
            'user': dict(updated_user)
        }),
        'isBase64Encoded': False
    }

def error_response(message: str, status_code: int, headers: Dict[str, str]) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }
