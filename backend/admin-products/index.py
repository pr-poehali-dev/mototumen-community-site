'''
Business: API для управления товарами в магазине (CRUD операции)
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с данными товаров или результатом операции
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
    
    # Проверка авторизации для модифицирующих запросов
    if method in ['POST', 'PUT', 'DELETE']:
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
        # GET - получение списка товаров
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            product_id = query_params.get('id')
            
            if product_id:
                # Получение одного товара
                cur.execute("""
                    SELECT id, name, description, price, image_url, category, 
                           in_stock, brand, model, created_at
                    FROM t_p21120869_mototumen_community_.products
                    WHERE id = %s
                """, (product_id,))
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
                # Получение всех товаров
                cur.execute("""
                    SELECT id, name, description, price, image_url, category, 
                           in_stock, brand, model, created_at
                    FROM t_p21120869_mototumen_community_.products
                    ORDER BY created_at DESC
                """)
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
        
        # POST - создание нового товара
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO t_p21120869_mototumen_community_.products 
                (name, description, price, image_url, category, in_stock, brand, model, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                RETURNING id
            """, (
                body_data.get('name'),
                body_data.get('description'),
                body_data.get('price'),
                body_data.get('image'),
                body_data.get('category'),
                body_data.get('inStock', True),
                body_data.get('brand'),
                body_data.get('model')
            ))
            
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': new_id, 'success': True}),
                'isBase64Encoded': False
            }
        
        # PUT - обновление товара
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
                    category = %s, in_stock = %s, brand = %s, model = %s
                WHERE id = %s
            """, (
                body_data.get('name'),
                body_data.get('description'),
                body_data.get('price'),
                body_data.get('image'),
                body_data.get('category'),
                body_data.get('inStock'),
                body_data.get('brand'),
                body_data.get('model'),
                product_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # DELETE - удаление товара
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
                WHERE id = %s
            """, (product_id,))
            
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