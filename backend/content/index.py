import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с контентом сайта (магазины, школы, сервисы, объявления)
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
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
        content_type = query_params.get('type', 'shops')
        
        if method == 'GET':
            category = query_params.get('category')
            search = query_params.get('search')
            
            if content_type == 'shops':
                query = "SELECT * FROM shops WHERE 1=1"
                
                if category and category != 'Все':
                    escaped_cat = category.replace("'", "''")
                    query += f" AND category = '{escaped_cat}'"
                
                if search:
                    escaped_search = search.replace("'", "''")
                    query += f" AND (name ILIKE '%{escaped_search}%' OR description ILIKE '%{escaped_search}%')"
                
                query += " ORDER BY created_at DESC"
                cur.execute(query)
                
            elif content_type == 'schools':
                query = "SELECT s.*, array_agg(sc.course_name) as courses FROM schools s LEFT JOIN school_courses sc ON s.id = sc.school_id WHERE 1=1"
                
                if category and category != 'Все':
                    escaped_cat = category.replace("'", "''")
                    query += f" AND s.category = '{escaped_cat}'"
                
                if search:
                    escaped_search = search.replace("'", "''")
                    query += f" AND (s.name ILIKE '%{escaped_search}%' OR s.description ILIKE '%{escaped_search}%')"
                
                query += " GROUP BY s.id ORDER BY s.created_at DESC"
                cur.execute(query)
                
            elif content_type == 'services':
                query = "SELECT s.*, array_agg(si.service_name) as services FROM services s LEFT JOIN service_items si ON s.id = si.service_id WHERE 1=1"
                
                if category and category != 'Все':
                    escaped_cat = category.replace("'", "''")
                    query += f" AND s.category = '{escaped_cat}'"
                
                if search:
                    escaped_search = search.replace("'", "''")
                    query += f" AND (s.name ILIKE '%{escaped_search}%' OR s.description ILIKE '%{escaped_search}%')"
                
                query += " GROUP BY s.id ORDER BY s.created_at DESC"
                cur.execute(query)
                
            elif content_type == 'announcements':
                query = "SELECT * FROM announcements WHERE status = 'active'"
                
                if category and category != 'Все':
                    escaped_cat = category.replace("'", "''")
                    query += f" AND category = '{escaped_cat}'"
                
                if search:
                    escaped_search = search.replace("'", "''")
                    query += f" AND (title ILIKE '%{escaped_search}%' OR description ILIKE '%{escaped_search}%')"
                
                query += " ORDER BY created_at DESC"
                cur.execute(query)
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
            
            def escape(val):
                if val is None:
                    return 'NULL'
                if isinstance(val, (int, float)):
                    return str(val)
                escaped = str(val).replace("'", "''")
                return f"'{escaped}'"
            
            if content_type == 'shops':
                cur.execute(f"""
                    INSERT INTO shops (name, description, category, image, rating, location, phone, website) 
                    VALUES ({escape(body_data.get('name'))}, {escape(body_data.get('description'))}, 
                            {escape(body_data.get('category'))}, {escape(body_data.get('image'))}, 
                            {body_data.get('rating', 0)}, {escape(body_data.get('location'))},
                            {escape(body_data.get('phone'))}, {escape(body_data.get('website'))})
                    RETURNING id
                """)
                
            elif content_type == 'schools':
                cur.execute(f"""
                    INSERT INTO schools (name, description, category, image, rating, hours, location, phone, price, website) 
                    VALUES ({escape(body_data.get('name'))}, {escape(body_data.get('description'))}, 
                            {escape(body_data.get('category'))}, {escape(body_data.get('image'))}, 
                            {body_data.get('rating', 0)}, {escape(body_data.get('hours'))},
                            {escape(body_data.get('location'))}, {escape(body_data.get('phone'))}, 
                            {escape(body_data.get('price'))}, {escape(body_data.get('website'))})
                    RETURNING id
                """)
                school_id = cur.fetchone()['id']
                
                for course in body_data.get('courses', []):
                    cur.execute(f"INSERT INTO school_courses (school_id, course_name) VALUES ({school_id}, {escape(course)})")
                    
            elif content_type == 'services':
                cur.execute(f"""
                    INSERT INTO services (name, description, category, image, rating, hours, location, phone, website) 
                    VALUES ({escape(body_data.get('name'))}, {escape(body_data.get('description'))}, 
                            {escape(body_data.get('category'))}, {escape(body_data.get('image'))}, 
                            {body_data.get('rating', 0)}, {escape(body_data.get('hours'))},
                            {escape(body_data.get('location'))}, {escape(body_data.get('phone'))}, 
                            {escape(body_data.get('website'))})
                    RETURNING id
                """)
                service_id = cur.fetchone()['id']
                
                for service in body_data.get('services', []):
                    cur.execute(f"INSERT INTO service_items (service_id, service_name) VALUES ({service_id}, {escape(service)})")
                    
            elif content_type == 'announcements':
                cur.execute(f"""
                    INSERT INTO announcements (title, description, category, image, author, contact, price, location) 
                    VALUES ({escape(body_data.get('title'))}, {escape(body_data.get('description'))}, 
                            {escape(body_data.get('category'))}, {escape(body_data.get('image'))}, 
                            {escape(body_data.get('author'))}, {escape(body_data.get('contact'))},
                            {escape(body_data.get('price'))}, {escape(body_data.get('location'))})
                    RETURNING id
                """)
            
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
            
            def escape(val):
                if val is None:
                    return 'NULL'
                if isinstance(val, (int, float)):
                    return str(val)
                escaped = str(val).replace("'", "''")
                return f"'{escaped}'"
            
            if content_type == 'shops':
                cur.execute(f"""
                    UPDATE shops SET 
                        name={escape(body_data.get('name'))}, 
                        description={escape(body_data.get('description'))}, 
                        category={escape(body_data.get('category'))},
                        image={escape(body_data.get('image'))}, 
                        rating={body_data.get('rating', 0)}, 
                        location={escape(body_data.get('location'))},
                        phone={escape(body_data.get('phone'))}, 
                        website={escape(body_data.get('website'))}, 
                        updated_at=CURRENT_TIMESTAMP 
                    WHERE id={item_id}
                """)
                
            elif content_type == 'schools':
                cur.execute(f"""
                    UPDATE schools SET 
                        name={escape(body_data.get('name'))}, 
                        description={escape(body_data.get('description'))}, 
                        category={escape(body_data.get('category'))},
                        image={escape(body_data.get('image'))}, 
                        rating={body_data.get('rating', 0)}, 
                        hours={escape(body_data.get('hours'))},
                        location={escape(body_data.get('location'))}, 
                        phone={escape(body_data.get('phone'))}, 
                        price={escape(body_data.get('price'))},
                        website={escape(body_data.get('website'))}, 
                        updated_at=CURRENT_TIMESTAMP 
                    WHERE id={item_id}
                """)
                
            elif content_type == 'services':
                cur.execute(f"""
                    UPDATE services SET 
                        name={escape(body_data.get('name'))}, 
                        description={escape(body_data.get('description'))}, 
                        category={escape(body_data.get('category'))},
                        image={escape(body_data.get('image'))}, 
                        rating={body_data.get('rating', 0)}, 
                        hours={escape(body_data.get('hours'))},
                        location={escape(body_data.get('location'))}, 
                        phone={escape(body_data.get('phone'))}, 
                        website={escape(body_data.get('website'))}, 
                        updated_at=CURRENT_TIMESTAMP 
                    WHERE id={item_id}
                """)
                
            elif content_type == 'announcements':
                cur.execute(f"""
                    UPDATE announcements SET 
                        title={escape(body_data.get('title'))}, 
                        description={escape(body_data.get('description'))}, 
                        category={escape(body_data.get('category'))},
                        image={escape(body_data.get('image'))}, 
                        price={escape(body_data.get('price'))}, 
                        location={escape(body_data.get('location'))},
                        status={escape(body_data.get('status', 'active'))}, 
                        updated_at=CURRENT_TIMESTAMP 
                    WHERE id={item_id}
                """)
            
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