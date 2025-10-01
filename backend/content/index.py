import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any, List

def get_db_connection():
    '''
    Создает подключение к БД
    '''
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с контентом сайта (магазины, школы, сервисы, объявления)
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - объект с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    query_params = event.get('queryStringParameters', {})
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        content_type = path_params.get('type', query_params.get('type', 'shops'))
        
        if method == 'GET':
            category = query_params.get('category')
            search = query_params.get('search')
            
            if content_type == 'shops':
                query = "SELECT * FROM shops WHERE 1=1"
                params = []
                
                if category and category != 'Все':
                    query += " AND category = %s"
                    params.append(category)
                
                if search:
                    query += " AND (name ILIKE %s OR description ILIKE %s)"
                    params.append(f'%{search}%')
                    params.append(f'%{search}%')
                
                query += " ORDER BY created_at DESC"
                cur.execute(query, params)
                
            elif content_type == 'schools':
                query = "SELECT s.*, array_agg(sc.course_name) as courses FROM schools s LEFT JOIN school_courses sc ON s.id = sc.school_id WHERE 1=1"
                params = []
                
                if category and category != 'Все':
                    query += " AND s.category = %s"
                    params.append(category)
                
                if search:
                    query += " AND (s.name ILIKE %s OR s.description ILIKE %s)"
                    params.append(f'%{search}%')
                    params.append(f'%{search}%')
                
                query += " GROUP BY s.id ORDER BY s.created_at DESC"
                cur.execute(query, params)
                
            elif content_type == 'services':
                query = "SELECT s.*, array_agg(si.service_name) as services FROM services s LEFT JOIN service_items si ON s.id = si.service_id WHERE 1=1"
                params = []
                
                if category and category != 'Все':
                    query += " AND s.category = %s"
                    params.append(category)
                
                if search:
                    query += " AND (s.name ILIKE %s OR s.description ILIKE %s)"
                    params.append(f'%{search}%')
                    params.append(f'%{search}%')
                
                query += " GROUP BY s.id ORDER BY s.created_at DESC"
                cur.execute(query, params)
                
            elif content_type == 'announcements':
                query = "SELECT * FROM announcements WHERE status = 'active'"
                params = []
                
                if category and category != 'Все':
                    query += " AND category = %s"
                    params.append(category)
                
                if search:
                    query += " AND (title ILIKE %s OR description ILIKE %s)"
                    params.append(f'%{search}%')
                    params.append(f'%{search}%')
                
                query += " ORDER BY created_at DESC"
                cur.execute(query, params)
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid content type'}),
                    'isBase64Encoded': False
                }
            
            results = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(row) for row in results], default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if content_type == 'shops':
                cur.execute(
                    "INSERT INTO shops (name, description, category, image, rating, location, phone, website) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (body_data.get('name'), body_data.get('description'), body_data.get('category'), 
                     body_data.get('image'), body_data.get('rating', 0), body_data.get('location'),
                     body_data.get('phone'), body_data.get('website'))
                )
                
            elif content_type == 'schools':
                cur.execute(
                    "INSERT INTO schools (name, description, category, image, rating, hours, location, phone, price, website) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (body_data.get('name'), body_data.get('description'), body_data.get('category'),
                     body_data.get('image'), body_data.get('rating', 0), body_data.get('hours'),
                     body_data.get('location'), body_data.get('phone'), body_data.get('price'),
                     body_data.get('website'))
                )
                school_id = cur.fetchone()['id']
                
                for course in body_data.get('courses', []):
                    cur.execute(
                        "INSERT INTO school_courses (school_id, course_name) VALUES (%s, %s)",
                        (school_id, course)
                    )
                    
            elif content_type == 'services':
                cur.execute(
                    "INSERT INTO services (name, description, category, image, rating, hours, location, phone, website) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (body_data.get('name'), body_data.get('description'), body_data.get('category'),
                     body_data.get('image'), body_data.get('rating', 0), body_data.get('hours'),
                     body_data.get('location'), body_data.get('phone'), body_data.get('website'))
                )
                service_id = cur.fetchone()['id']
                
                for service in body_data.get('services', []):
                    cur.execute(
                        "INSERT INTO service_items (service_id, service_name) VALUES (%s, %s)",
                        (service_id, service)
                    )
                    
            elif content_type == 'announcements':
                cur.execute(
                    "INSERT INTO announcements (title, description, category, image, author, contact, price, location) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (body_data.get('title'), body_data.get('description'), body_data.get('category'),
                     body_data.get('image'), body_data.get('author'), body_data.get('contact'),
                     body_data.get('price'), body_data.get('location'))
                )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            item_id = body_data.get('id')
            
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID is required'}),
                    'isBase64Encoded': False
                }
            
            if content_type == 'shops':
                cur.execute(
                    "UPDATE shops SET name=%s, description=%s, category=%s, image=%s, rating=%s, location=%s, phone=%s, website=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
                    (body_data.get('name'), body_data.get('description'), body_data.get('category'),
                     body_data.get('image'), body_data.get('rating'), body_data.get('location'),
                     body_data.get('phone'), body_data.get('website'), item_id)
                )
                
            elif content_type == 'announcements':
                cur.execute(
                    "UPDATE announcements SET title=%s, description=%s, category=%s, image=%s, price=%s, location=%s, status=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
                    (body_data.get('title'), body_data.get('description'), body_data.get('category'),
                     body_data.get('image'), body_data.get('price'), body_data.get('location'),
                     body_data.get('status', 'active'), item_id)
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
