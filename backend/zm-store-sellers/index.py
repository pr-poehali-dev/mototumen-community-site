'''
Business: API для управления продавцами магазина ZM Store (только для CEO)
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с данными продавцов или результатом операции
'''

import json
import os
import psycopg2
import jwt
from typing import Dict, Any, Optional

def verify_ceo_token(token: Optional[str], dsn: str) -> Optional[int]:
    """Проверка что пользователь - CEO"""
    if not token:
        return None
    try:
        jwt_secret = os.environ.get('JWT_SECRET_KEY', 'default-secret')
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        user_id = payload.get('userId')
        
        if not user_id:
            return None
        
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT role FROM t_p21120869_mototumen_community_.user_roles
            WHERE user_id = %s AND role = 'CEO'
        """, (user_id,))
        
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        return user_id if result else None
    except:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
    
    dsn = os.environ.get('DATABASE_URL')
    
    auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
    ceo_id = verify_ceo_token(auth_token, dsn)
    
    if not ceo_id:
        return {
            'statusCode': 403,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Access denied. CEO only'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT id FROM t_p21120869_mototumen_community_.shops WHERE name = 'ZM Store'")
        shop_row = cur.fetchone()
        
        if not shop_row:
            return {
                'statusCode': 404,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'ZM Store not found'}),
                'isBase64Encoded': False
            }
        
        zm_store_id = shop_row[0]
        
        if method == 'GET':
            cur.execute("""
                SELECT ss.id, ss.user_id, u.username, u.first_name, u.last_name, 
                       ss.assigned_at, ss.is_active
                FROM t_p21120869_mototumen_community_.shop_sellers ss
                JOIN t_p21120869_mototumen_community_.users u ON ss.user_id = u.id
                WHERE ss.shop_id = %s
                ORDER BY ss.assigned_at DESC
            """, (zm_store_id,))
            
            rows = cur.fetchall()
            sellers = []
            for row in rows:
                sellers.append({
                    'id': row[0],
                    'userId': row[1],
                    'username': row[2],
                    'firstName': row[3],
                    'lastName': row[4],
                    'assignedAt': row[5].isoformat() if row[5] else None,
                    'isActive': row[6]
                })
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'sellers': sellers}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('userId')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'userId required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT id FROM t_p21120869_mototumen_community_.shop_sellers
                WHERE user_id = %s AND shop_id = %s
            """, (user_id, zm_store_id))
            
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Seller already assigned'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO t_p21120869_mototumen_community_.shop_sellers
                (user_id, shop_id, assigned_by, assigned_at, is_active)
                VALUES (%s, %s, %s, NOW(), true)
                RETURNING id
            """, (user_id, zm_store_id, ceo_id))
            
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': new_id, 'success': True}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            seller_id = query_params.get('id')
            
            if not seller_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Seller ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                DELETE FROM t_p21120869_mototumen_community_.shop_sellers
                WHERE id = %s AND shop_id = %s
            """, (seller_id, zm_store_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
