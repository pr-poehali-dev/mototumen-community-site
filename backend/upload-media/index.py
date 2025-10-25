import json
import base64
import boto3
import os
from typing import Dict, Any
from datetime import datetime
import hashlib

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Загрузка медиафайлов в Yandex Object Storage
    Args: event - POST с base64 файлом, context - объект с request_id
    Returns: HTTP response с URL загруженного файла
    Updated: 2025-10-25 new YC credentials
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    body_data = json.loads(body_str)
    file_base64 = body_data.get('file')
    file_name = body_data.get('fileName', 'upload')
    content_type = body_data.get('contentType', 'image/jpeg')
    folder = body_data.get('folder', 'general')
    
    if not file_base64:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No file provided'}),
            'isBase64Encoded': False
        }
    
    file_bytes = base64.b64decode(file_base64)
    
    file_hash = hashlib.md5(file_bytes).hexdigest()[:8]
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    file_ext = file_name.split('.')[-1] if '.' in file_name else 'jpg'
    unique_name = f"{folder}/{timestamp}_{file_hash}.{file_ext}"
    
    s3_client = boto3.client(
        's3',
        endpoint_url='https://storage.yandexcloud.net',
        aws_access_key_id=os.environ.get('YC_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('YC_SECRET_ACCESS_KEY'),
        region_name='ru-central1'
    )
    
    bucket_name = os.environ.get('YC_STORAGE_BUCKET')
    
    s3_client.put_object(
        Bucket=bucket_name,
        Key=unique_name,
        Body=file_bytes,
        ContentType=content_type,
        ACL='public-read'
    )
    
    file_url = f"https://storage.yandexcloud.net/{bucket_name}/{unique_name}"
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'url': file_url,
            'fileName': unique_name,
            'size': len(file_bytes)
        })
    }