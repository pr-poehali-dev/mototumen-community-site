"""
Business: Admin panel - manage users, roles, and individual admin passwords
Args: event with httpMethod, body, headers with X-Auth-Token; context with request_id
Returns: HTTP response with users list, role management, and individual password management
"""
import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt

SCHEMA = 't_p21120869_mototumen_community_'

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
        SELECT u.id, u.email, u.name, u.role, u.admin_password_hash
        FROM {SCHEMA}.users u
        JOIN {SCHEMA}.user_sessions s ON u.id = s.user_id
        WHERE s.token = '{token}' AND s.expires_at > NOW()
        """
    )
    return cur.fetchone()

def log_security_event(cur, event_type: str, severity: str, ip: str = None, 
                       user_id: int = None, endpoint: str = None, method: str = None,
                       details: Dict = None, user_agent: str = None):
    details_json = json.dumps(details) if details else '{}'
    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.security_logs 
        (event_type, severity, ip_address, user_id, endpoint, method, details, user_agent)
        VALUES ('{event_type}', '{severity}', '{ip or "unknown"}', 
                {user_id or 'NULL'}, '{endpoint or ""}', '{method or ""}', 
                '{details_json}'::jsonb, '{user_agent or ""}')
        """
    )

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
        
        query_params = event.get('queryStringParameters', {}) or {}
        action = query_params.get('action', 'users')
        
        # Все действия требуют токен (индивидуальные пароли!)
        headers = event.get('headers', {})
        token = get_header(headers, 'X-Auth-Token')
        
        if not token:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No token provided'}),
                'isBase64Encoded': False
            }
        
        user = get_user_from_token(cur, token)
        
        if not user:
            ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
            log_security_event(cur, 'invalid_token', 'medium', ip=ip, 
                             endpoint='/admin', method=method)
            conn.commit()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid or expired token'}),
                'isBase64Encoded': False
            }
        
        if user['role'] not in ['admin', 'ceo', 'moderator']:
            ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
            log_security_event(cur, 'unauthorized_access', 'high', ip=ip, 
                             user_id=user['id'], endpoint='/admin', method=method,
                             details={'role': user['role']})
            conn.commit()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Admin access required'}),
                'isBase64Encoded': False
            }
        
        # ===== ИНДИВИДУАЛЬНЫЕ АДМИНСКИЕ ПАРОЛИ =====
        
        # Проверка: есть ли пароль у текущего админа
        if method == 'GET' and action == 'my-admin-password-status':
            has_password = user.get('admin_password_hash') is not None
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'hasPassword': has_password, 'userId': user['id']}),
                'isBase64Encoded': False
            }
        
        # Установка СВОЕГО пароля (первый вход)
        if method == 'POST' and action == 'set-my-admin-password':
            body = json.loads(event.get('body', '{}'))
            password = body.get('password', '')
            
            if not password or len(password) < 6:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'}),
                    'isBase64Encoded': False
                }
            
            if user.get('admin_password_hash'):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пароль уже установлен. Используйте смену пароля'}),
                    'isBase64Encoded': False
                }
            
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cur.execute(
                f"UPDATE {SCHEMA}.users SET admin_password_hash = %s WHERE id = %s",
                (password_hash, user['id'])
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Пароль установлен'}),
                'isBase64Encoded': False
            }
        
        # Проверка СВОЕГО пароля (вход в админку)
        if method == 'POST' and action == 'verify-my-admin-password':
            body = json.loads(event.get('body', '{}'))
            password = body.get('password', '')
            
            stored_hash = user.get('admin_password_hash')
            if not stored_hash:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пароль не установлен. Установите пароль сначала'}),
                    'isBase64Encoded': False
                }
            
            is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'valid': is_valid}),
                'isBase64Encoded': False
            }
        
        # Смена СВОЕГО пароля
        if method == 'PUT' and action == 'change-my-admin-password':
            body = json.loads(event.get('body', '{}'))
            old_password = body.get('oldPassword', '')
            new_password = body.get('newPassword', '')
            
            if not new_password or len(new_password) < 6:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Новый пароль должен быть не менее 6 символов'}),
                    'isBase64Encoded': False
                }
            
            stored_hash = user.get('admin_password_hash')
            if not stored_hash:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пароль не установлен'}),
                    'isBase64Encoded': False
                }
            
            if not bcrypt.checkpw(old_password.encode('utf-8'), stored_hash.encode('utf-8')):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный старый пароль'}),
                    'isBase64Encoded': False
                }
            
            new_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cur.execute(
                f"UPDATE {SCHEMA}.users SET admin_password_hash = %s WHERE id = %s",
                (new_hash, user['id'])
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Пароль изменён'}),
                'isBase64Encoded': False
            }
        
        # CEO: Сброс пароля любого админа
        if method == 'POST' and action == 'reset-admin-password':
            if user['role'] != 'ceo':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Только CEO может сбрасывать пароли'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            target_user_id = body.get('userId')
            
            if not target_user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                f"UPDATE {SCHEMA}.users SET admin_password_hash = NULL WHERE id = %s AND role IN ('admin', 'ceo', 'moderator')",
                (target_user_id,)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Пароль сброшен. Пользователь должен установить новый'}),
                'isBase64Encoded': False
            }
        
        # ===== ОСТАЛЬНЫЕ АДМИНСКИЕ ДЕЙСТВИЯ =====
        
        # Список пользователей
        if method == 'GET' and action == 'users':
            cur.execute(f"""
                SELECT 
                    u.id,
                    u.email,
                    u.name,
                    u.telegram_id,
                    u.username,
                    u.first_name,
                    u.last_name,
                    u.role,
                    u.created_at,
                    u.updated_at,
                    up.avatar_url,
                    up.bio,
                    up.phone,
                    up.gender,
                    (u.admin_password_hash IS NOT NULL) as has_admin_password,
                    COALESCE(
                        (SELECT json_agg(json_build_object('id', uv.id, 'model', uv.model))
                         FROM {SCHEMA}.user_vehicles uv WHERE uv.user_id = u.id),
                        '[]'::json
                    ) as vehicles
                FROM {SCHEMA}.users u
                LEFT JOIN {SCHEMA}.user_profiles up ON u.id = up.user_id
                ORDER BY u.created_at DESC
            """)
            
            users = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'users': users}, default=str),
                'isBase64Encoded': False
            }
        
        # Изменение роли пользователя (только CEO)
        if method == 'PUT' and action == 'user-role':
            if user['role'] != 'ceo':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Только главный админ может менять роли'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            target_user_id = body.get('userId')
            new_role = body.get('role')
            
            if not target_user_id or not new_role:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId и role обязательны'}),
                    'isBase64Encoded': False
                }
            
            if new_role not in ['user', 'moderator', 'admin', 'ceo']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Недопустимая роль'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                f"UPDATE {SCHEMA}.users SET role = %s WHERE id = %s",
                (new_role, target_user_id)
            )
            conn.commit()
            
            ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
            log_security_event(cur, 'role_change', 'high', ip=ip,
                             user_id=user['id'], endpoint='/admin',
                             details={'target_user_id': target_user_id, 'new_role': new_role})
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Роль изменена'}),
                'isBase64Encoded': False
            }
        
        # Удаление пользователя (только CEO)
        if method == 'DELETE' and action == 'user':
            if user['role'] != 'ceo':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Только главный админ может удалять пользователей'}),
                    'isBase64Encoded': False
                }
            
            user_id = query_params.get('userId')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId обязателен'}),
                    'isBase64Encoded': False
                }
            
            if int(user_id) == user['id']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нельзя удалить самого себя'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"DELETE FROM {SCHEMA}.user_sessions WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {SCHEMA}.user_profiles WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {SCHEMA}.user_vehicles WHERE user_id = %s", (user_id,))
            cur.execute(f"DELETE FROM {SCHEMA}.users WHERE id = %s", (user_id,))
            conn.commit()
            
            ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
            log_security_event(cur, 'user_deleted', 'critical', ip=ip,
                             user_id=user['id'], endpoint='/admin',
                             details={'deleted_user_id': user_id})
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Пользователь удалён'}),
                'isBase64Encoded': False
            }
        
        # Статистика
        if method == 'GET' and action == 'stats':
            cur.execute(f"""
                SELECT 
                    (SELECT COUNT(*) FROM {SCHEMA}.users) as total_users,
                    (SELECT COUNT(*) FROM {SCHEMA}.users WHERE role = 'admin' OR role = 'ceo' OR role = 'moderator') as total_admins,
                    (SELECT COUNT(*) FROM {SCHEMA}.user_sessions WHERE expires_at > NOW()) as active_sessions,
                    (SELECT COUNT(*) FROM {SCHEMA}.organizations) as total_organizations
            """)
            
            stats = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(stats)),
                'isBase64Encoded': False
            }
        
        # Логи активности
        if method == 'GET' and action == 'activity':
            limit = int(query_params.get('limit', 50))
            
            cur.execute(f"""
                SELECT 
                    ual.id,
                    ual.user_id,
                    ual.action_type,
                    ual.timestamp,
                    ual.details,
                    u.name as user_name,
                    u.email as user_email
                FROM {SCHEMA}.user_activity_log ual
                LEFT JOIN {SCHEMA}.users u ON ual.user_id = u.id
                ORDER BY ual.timestamp DESC
                LIMIT {limit}
            """)
            
            activity = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'activity': activity}, default=str),
                'isBase64Encoded': False
            }
        
        # Заявки на организации
        if method == 'GET' and action == 'organization-requests':
            cur.execute(f"""
                SELECT 
                    org_req.id,
                    org_req.user_id,
                    org_req.organization_name,
                    org_req.description,
                    org_req.contact_info,
                    org_req.status,
                    org_req.created_at,
                    org_req.updated_at,
                    u.name as user_name,
                    u.email as user_email
                FROM {SCHEMA}.organization_requests org_req
                LEFT JOIN {SCHEMA}.users u ON org_req.user_id = u.id
                ORDER BY org_req.created_at DESC
            """)
            
            requests = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'requests': requests}, default=str),
                'isBase64Encoded': False
            }
        
        # Одобрение/отклонение заявки организации (только CEO и admin)
        if method == 'PUT' and action == 'organization-request':
            if user['role'] not in ['ceo', 'admin']:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Недостаточно прав'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            request_id = body.get('requestId')
            status = body.get('status')
            
            if not request_id or status not in ['approved', 'rejected']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'requestId и status (approved/rejected) обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                f"SELECT * FROM {SCHEMA}.organization_requests WHERE id = %s",
                (request_id,)
            )
            req = cur.fetchone()
            
            if not req:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заявка не найдена'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                f"UPDATE {SCHEMA}.organization_requests SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                (status, request_id)
            )
            
            if status == 'approved':
                cur.execute(
                    f"""
                    INSERT INTO {SCHEMA}.organizations 
                    (user_id, name, description, contact_info)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (req['user_id'], req['organization_name'], req['description'], req['contact_info'])
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': f'Заявка {status}'}),
                'isBase64Encoded': False
            }
        
        # Список магазинов
        if method == 'GET' and action == 'shops':
            cur.execute(f"""
                SELECT 
                    s.id,
                    s.name,
                    s.description,
                    s.image_url,
                    s.category,
                    s.address,
                    s.phone,
                    s.website,
                    s.working_hours,
                    s.rating,
                    s.created_at,
                    u.name as owner_name
                FROM {SCHEMA}.shops s
                LEFT JOIN {SCHEMA}.users u ON s.user_id = u.id
                ORDER BY s.created_at DESC
            """)
            
            shops = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'shops': shops}, default=str),
                'isBase64Encoded': False
            }
        
        # Удаление магазина (только CEO)
        if method == 'DELETE' and action == 'shop':
            if user['role'] != 'ceo':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Только CEO может удалять магазины'}),
                    'isBase64Encoded': False
                }
            
            shop_id = query_params.get('shopId')
            
            if not shop_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'shopId обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"DELETE FROM {SCHEMA}.shops WHERE id = %s", (shop_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Магазин удалён'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unknown action'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
