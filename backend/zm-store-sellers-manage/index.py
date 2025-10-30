'''
Business: Управление продавцами ZM Store (получение списка, добавление, активация/деактивация)
Args: event с httpMethod (GET/POST/PUT), headers['X-Auth-Token'], body для POST/PUT
Returns: JSON со списком продавцов или результатом операции
'''

import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No auth token'})
        }
    
    telegram_id = token
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        # Проверяем что пользователь - CEO
        cur.execute(
            "SELECT role FROM store_sellers WHERE telegram_id = %s AND is_active = true",
            (telegram_id,)
        )
        user_role = cur.fetchone()
        
        if not user_role or user_role[0] != 'ceo':
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Access denied. CEO only'})
            }
        
        # GET - список всех продавцов
        if method == 'GET':
            cur.execute("""
                SELECT id, user_id, telegram_id, full_name, role, is_active, assigned_at
                FROM store_sellers
                ORDER BY assigned_at DESC
            """)
            rows = cur.fetchall()
            
            sellers = []
            for row in rows:
                sellers.append({
                    'id': row[0],
                    'user_id': row[1],
                    'telegram_id': row[2],
                    'full_name': row[3],
                    'role': row[4],
                    'is_active': row[5],
                    'assigned_at': row[6].isoformat() if row[6] else None
                })
            
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'sellers': sellers})
            }
        
        # POST - добавить нового продавца
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            new_telegram_id = body.get('telegram_id')
            full_name = body.get('full_name')
            
            if not new_telegram_id or not full_name:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'telegram_id and full_name required'})
                }
            
            cur.execute("""
                INSERT INTO store_sellers (user_id, telegram_id, full_name, role, is_active, assigned_by)
                VALUES (%s, %s, %s, 'seller', true, %s)
                RETURNING id
            """, (new_telegram_id, new_telegram_id, full_name, telegram_id))
            
            new_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': new_id})
            }
        
        # PUT - обновить статус продавца (активировать/деактивировать)
        if method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            seller_id = body.get('id')
            is_active = body.get('is_active')
            
            if seller_id is None or is_active is None:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id and is_active required'})
                }
            
            cur.execute("""
                UPDATE store_sellers 
                SET is_active = %s 
                WHERE id = %s AND role != 'ceo'
            """, (is_active, seller_id))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        cur.close()
        conn.close()
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
