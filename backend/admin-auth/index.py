'''
Business: Авторизация администратора с проверкой пароля через БД
Args: event с httpMethod и body (password)
Returns: HTTP response с JWT токеном или ошибкой
'''

import json
import os
import psycopg2
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    # CORS
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    # Получаем пароль из запроса
    body = event.get('body') or '{}'
    if body.strip() == '':
        body = '{}'
    body_data = json.loads(body)
    password: str = body_data.get('password', '')
    
    if not password:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Password required'}),
            'isBase64Encoded': False
        }
    
    # Подключаемся к БД
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    # Получаем хеш пароля из БД
    cur.execute("SELECT password_hash FROM t_p21120869_mototumen_community_.admin_auth WHERE id = 1")
    result = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not result:
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Admin not found'}),
            'isBase64Encoded': False
        }
    
    password_hash = result[0]
    
    # Проверяем пароль
    if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
        # Генерируем JWT токен
        jwt_secret = os.environ.get('JWT_SECRET_KEY', 'default-secret')
        token = jwt.encode({
            'admin': True,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, jwt_secret, algorithm='HS256')
        
        return {
            'statusCode': 200,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'token': token, 'success': True}),
            'isBase64Encoded': False
        }
    else:
        return {
            'statusCode': 401,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Invalid password'}),
            'isBase64Encoded': False
        }