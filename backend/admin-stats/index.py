'''
Business: Статистика для админского дашборда
Args: event с httpMethod, headers (X-Admin-Token)
Returns: JSON со статистикой и последними действиями
'''
import json
import os
import psycopg2
from typing import Dict, Any

DATABASE_URL = os.environ.get('DATABASE_URL')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    headers = event.get('headers', {})
    admin_token = headers.get('X-Admin-Token') or headers.get('x-admin-token')
    
    print(f"DEBUG: Headers received: {headers}")
    print(f"DEBUG: Admin token: {admin_token}")
    
    if not admin_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # Проверка админского токена (простой запрос без параметров)
    safe_token = admin_token.replace("'", "''")  # Экранирование одинарных кавычек
    cursor.execute(
        f"SELECT id FROM t_p21120869_mototumen_community_.admin_auth WHERE token = '{safe_token}'"
    )
    admin = cursor.fetchone()
    
    if not admin:
        cursor.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid admin token'})
        }
    
    # Статистика пользователей
    cursor.execute("SELECT COUNT(*) FROM t_p21120869_mototumen_community_.users")
    total_users = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM t_p21120869_mototumen_community_.users WHERE status = 'active'")
    active_users = cursor.fetchone()[0]
    
    # Статистика магазинов
    cursor.execute("SELECT COUNT(*) FROM t_p21120869_mototumen_community_.shops")
    total_shops = cursor.fetchone()[0]
    
    # Статистика объявлений
    cursor.execute("SELECT COUNT(*) FROM t_p21120869_mototumen_community_.announcements")
    total_announcements = cursor.fetchone()[0]
    
    # Статистика школ
    cursor.execute("SELECT COUNT(*) FROM t_p21120869_mototumen_community_.schools")
    total_schools = cursor.fetchone()[0]
    
    # Последняя активность (топ 10)
    cursor.execute("""
        SELECT 
            ual.id,
            ual.action,
            ual.created_at,
            u.username as user_name,
            COALESCE(ur.role_name, 'user') as user_role,
            up.city as location
        FROM t_p21120869_mototumen_community_.user_activity_log ual
        LEFT JOIN t_p21120869_mototumen_community_.users u ON ual.user_id = u.id
        LEFT JOIN t_p21120869_mototumen_community_.user_roles ur ON u.id = ur.user_id
        LEFT JOIN t_p21120869_mototumen_community_.user_profiles up ON u.id = up.user_id
        ORDER BY ual.created_at DESC
        LIMIT 10
    """)
    
    activity_rows = cursor.fetchall()
    recent_activity = []
    for row in activity_rows:
        recent_activity.append({
            'id': row[0],
            'action': row[1],
            'created_at': row[2].isoformat() if row[2] else None,
            'user_name': row[3] or 'Неизвестный',
            'user_role': row[4],
            'location': row[5]
        })
    
    cursor.close()
    conn.close()
    
    result = {
        'stats': {
            'total_users': total_users,
            'active_users': active_users,
            'total_shops': total_shops,
            'total_announcements': total_announcements,
            'total_schools': total_schools
        },
        'recent_activity': recent_activity
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(result)
    }