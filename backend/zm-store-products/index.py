'''
Business: API для управления товарами ZM Store (доступ для CEO и продавцов магазина)
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с данными товаров или результатом операции
'''

import json
import os
import psycopg2
import jwt
from typing import Dict, Any, Optional, Tuple

def verify_zm_store_access(token: Optional[str], dsn: str) -> Optional[Tuple[int, bool]]:
    """Проверка доступа к ZM Store. Возвращает (user_id, is_ceo)"""
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
        
        is_ceo = cur.fetchone() is not None
        
        if is_ceo:
            cur.close()
            conn.close()
            return (user_id, True)
        
        cur.execute("""
            SELECT ss.id FROM t_p21120869_mototumen_community_.shop_sellers ss
            JOIN t_p21120869_mototumen_community_.shops s ON ss.shop_id = s.id
            WHERE ss.user_id = %s AND s.name = 'ZM Store' AND ss.is_active = true
        """, (user_id,))
        
        is_seller = cur.fetchone() is not None
        cur.close()
        conn.close()
        
        return (user_id, False) if is_seller else None
    except:
        return None

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
    
    dsn = os.environ.get('DATABASE_URL')
    
    auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
    access = verify_zm_store_access(auth_token, dsn)
    
    if not access:
        return {
            'statusCode': 403,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Access denied. ZM Store sellers only'}),
            'isBase64Encoded': False
        }
    
    user_id, is_ceo = access
    
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
            query_params = event.get('queryStringParameters') or {}
            product_id = query_params.get('id')
            
            if product_id:
                cur.execute("""
                    SELECT id, name, description, price, image_url, category, 
                           in_stock, brand, model, created_at
                    FROM t_p21120869_mototumen_community_.products
                    WHERE id = %s AND shop_id = %s
                """, (product_id, zm_store_id))
                row = cur.fetchone()
                
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {**cors_headers, 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Product not found'}),
                        'isBase64Encoded': False
                    }
                
                product = {
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'price': float(row[3]),
                    'image': row[4],
                    'category': row[5],
                    'inStock': row[6],
                    'brand': row[7],
                    'model': row[8],
                    'createdAt': row[9].isoformat() if row[9] else None
                }
                
                return {
                    'statusCode': 200,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps(product),
                    'isBase64Encoded': False
                }
            else:
                cur.execute("""
                    SELECT id, name, description, price, image_url, category, 
                           in_stock, brand, model, created_at
                    FROM t_p21120869_mototumen_community_.products
                    WHERE shop_id = %s
                    ORDER BY created_at DESC
                """, (zm_store_id,))
                rows = cur.fetchall()
                
                products = []
                for row in rows:
                    products.append({
                        'id': row[0],
                        'name': row[1],
                        'description': row[2],
                        'price': float(row[3]),
                        'image': row[4],
                        'category': row[5],
                        'inStock': row[6],
                        'brand': row[7],
                        'model': row[8],
                        'createdAt': row[9].isoformat() if row[9] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'products': products}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO t_p21120869_mototumen_community_.products 
                (name, description, price, image_url, category, in_stock, brand, model, shop_id, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                RETURNING id
            """, (
                body_data.get('name'),
                body_data.get('description'),
                body_data.get('price'),
                body_data.get('image'),
                body_data.get('category'),
                body_data.get('inStock', True),
                body_data.get('brand'),
                body_data.get('model'),
                zm_store_id
            ))
            
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': new_id, 'success': True}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            query_params = event.get('queryStringParameters') or {}
            product_id = query_params.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Product ID required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                UPDATE t_p21120869_mototumen_community_.products
                SET name = %s, description = %s, price = %s, image_url = %s, 
                    category = %s, in_stock = %s, brand = %s, model = %s, updated_at = NOW()
                WHERE id = %s AND shop_id = %s
            """, (
                body_data.get('name'),
                body_data.get('description'),
                body_data.get('price'),
                body_data.get('image'),
                body_data.get('category'),
                body_data.get('inStock'),
                body_data.get('brand'),
                body_data.get('model'),
                product_id,
                zm_store_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            product_id = query_params.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors_headers, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Product ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                DELETE FROM t_p21120869_mototumen_community_.products
                WHERE id = %s AND shop_id = %s
            """, (product_id, zm_store_id))
            
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
