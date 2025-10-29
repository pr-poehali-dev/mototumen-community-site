'''
Business: Управление продавцами и товарами магазинов (только для CEO и продавцов)
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с данными о продавцах/товарах или ошибкой доступа
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def is_ceo(user_id: int, conn) -> bool:
    with conn.cursor() as cur:
        cur.execute("""
            SELECT 1 FROM t_p21120869_mototumen_community_.user_roles 
            WHERE user_id = %s AND role_id = 'ceo' LIMIT 1
        """, (user_id,))
        return cur.fetchone() is not None

def is_seller_for_shop(user_id: int, shop_id: int, conn) -> bool:
    with conn.cursor() as cur:
        cur.execute("""
            SELECT 1 FROM t_p21120869_mototumen_community_.shop_sellers 
            WHERE user_id = %s AND shop_id = %s AND is_active = true LIMIT 1
        """, (user_id, shop_id))
        return cur.fetchone() is not None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    
    try:
        params = event.get('queryStringParameters') or {}
        action = params.get('action', '')
        user_id = int(params.get('user_id', 0))
        
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Требуется авторизация'})
            }
        
        # Получить информацию о продавце и его магазине
        if method == 'GET' and action == 'seller-info':
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT s.id, s.name, s.description
                    FROM t_p21120869_mototumen_community_.shops s
                    JOIN t_p21120869_mototumen_community_.shop_sellers ss ON s.id = ss.shop_id
                    WHERE ss.user_id = %s AND ss.is_active = true
                    LIMIT 1
                """, (user_id,))
                shop = cur.fetchone()
                
                if not shop:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'})
                    }
                
                cur.execute("""
                    SELECT * FROM t_p21120869_mototumen_community_.products
                    WHERE shop_id = %s
                    ORDER BY created_at DESC
                """, (shop['id'],))
                products = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'shop': dict(shop),
                        'products': [dict(p) for p in products]
                    }, default=str)
                }
        
        # Добавить товар (только продавец своего магазина)
        if method == 'POST' and action == 'add-product':
            body = json.loads(event.get('body', '{}'))
            shop_id = body.get('shop_id')
            
            if not is_seller_for_shop(user_id, shop_id, conn):
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'})
                }
            
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO t_p21120869_mototumen_community_.products
                    (name, description, price, image_url, category, brand, model, in_stock, shop_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    body.get('name'),
                    body.get('description'),
                    body.get('price'),
                    body.get('image_url'),
                    body.get('category'),
                    body.get('brand'),
                    body.get('model'),
                    body.get('in_stock', True),
                    shop_id
                ))
                product_id = cur.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'id': product_id, 'message': 'Товар добавлен'})
                }
        
        # Обновить товар
        if method == 'PUT' and action == 'update-product':
            product_id = int(params.get('product_id', 0))
            body = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT shop_id FROM t_p21120869_mototumen_community_.products WHERE id = %s
                """, (product_id,))
                product = cur.fetchone()
                
                if not product or not is_seller_for_shop(user_id, product['shop_id'], conn):
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'})
                    }
                
                cur.execute("""
                    UPDATE t_p21120869_mototumen_community_.products
                    SET name = %s, description = %s, price = %s, image_url = %s,
                        category = %s, brand = %s, model = %s, in_stock = %s,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (
                    body.get('name'),
                    body.get('description'),
                    body.get('price'),
                    body.get('image_url'),
                    body.get('category'),
                    body.get('brand'),
                    body.get('model'),
                    body.get('in_stock'),
                    product_id
                ))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Товар обновлен'})
                }
        
        # Удалить товар
        if method == 'DELETE' and action == 'delete-product':
            product_id = int(params.get('product_id', 0))
            
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT shop_id FROM t_p21120869_mototumen_community_.products WHERE id = %s
                """, (product_id,))
                product = cur.fetchone()
                
                if not product or not is_seller_for_shop(user_id, product['shop_id'], conn):
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'})
                    }
                
                cur.execute("""
                    UPDATE t_p21120869_mototumen_community_.products
                    SET in_stock = false, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (product_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Товар удален'})
                }
        
        # Назначить продавца (только CEO)
        if method == 'POST' and action == 'assign-seller':
            if not is_ceo(user_id, conn):
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Только CEO может назначать продавцов'})
                }
            
            body = json.loads(event.get('body', '{}'))
            seller_user_id = body.get('seller_user_id')
            shop_id = body.get('shop_id')
            
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO t_p21120869_mototumen_community_.shop_sellers
                    (user_id, shop_id, assigned_by, is_active)
                    VALUES (%s, %s, %s, true)
                    ON CONFLICT (user_id, shop_id) DO UPDATE SET is_active = true
                """, (seller_user_id, shop_id, user_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Продавец назначен'})
                }
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Endpoint not found'})
        }
        
    finally:
        conn.close()