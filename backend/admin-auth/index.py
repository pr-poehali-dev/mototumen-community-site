'''
Business: API для управления паролем администратора (установка, проверка, смена)
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с результатом операции
'''

import json
import os
from typing import Dict, Any
import psycopg2
import bcrypt


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('SELECT COUNT(*) FROM admin_auth')
            count = cur.fetchone()[0]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'hasPassword': count > 0})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            password = body_data.get('password', '')
            
            if not password or len(password) < 6:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'})
                }
            
            if action == 'setup':
                cur.execute('SELECT COUNT(*) FROM admin_auth')
                if cur.fetchone()[0] > 0:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пароль уже установлен'})
                    }
                
                password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                cur.execute('INSERT INTO admin_auth (password_hash) VALUES (%s)', (password_hash,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Пароль установлен'})
                }
            
            elif action == 'verify':
                cur.execute('SELECT password_hash FROM admin_auth ORDER BY id DESC LIMIT 1')
                row = cur.fetchone()
                
                if not row:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пароль не установлен'})
                    }
                
                stored_hash = row[0]
                is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'valid': is_valid})
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            old_password = body_data.get('oldPassword', '')
            new_password = body_data.get('newPassword', '')
            
            if not new_password or len(new_password) < 6:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Новый пароль должен быть не менее 6 символов'})
                }
            
            cur.execute('SELECT password_hash FROM admin_auth ORDER BY id DESC LIMIT 1')
            row = cur.fetchone()
            
            if not row:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пароль не установлен'})
                }
            
            stored_hash = row[0]
            if not bcrypt.checkpw(old_password.encode('utf-8'), stored_hash.encode('utf-8')):
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный старый пароль'})
                }
            
            new_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cur.execute('UPDATE admin_auth SET password_hash = %s, updated_at = CURRENT_TIMESTAMP', (new_hash,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Пароль изменён'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
