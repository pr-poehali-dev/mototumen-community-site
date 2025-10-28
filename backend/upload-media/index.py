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
    Updated: 2025-10-28 20:22 force redeploy with storage.admin rights
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
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'No file provided'}),
            'isBase64Encoded': False
        }
    
    try:
        file_bytes = base64.b64decode(file_base64)
        
        file_hash = hashlib.md5(file_bytes).hexdigest()[:8]
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_ext = file_name.split('.')[-1] if '.' in file_name else 'jpg'
        unique_name = f"{folder}/{timestamp}_{file_hash}.{file_ext}"
        
        print(f"[UPLOAD] folder='{folder}', unique_name='{unique_name}'")
        
        access_key = os.environ.get('YC_ACCESS_KEY_ID')
        secret_key = os.environ.get('YC_SECRET_ACCESS_KEY')
        bucket_name = os.environ.get('YC_STORAGE_BUCKET')
        
        print(f"[UPLOAD] access_key={access_key[:10] if access_key else None}..., bucket={bucket_name}")
        
        if not access_key or not secret_key or not bucket_name:
            raise Exception(f"Missing S3 credentials: access_key={bool(access_key)}, secret_key={bool(secret_key)}, bucket={bool(bucket_name)}")
        
        s3_client = boto3.client(
            's3',
            endpoint_url='https://storage.yandexcloud.net',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name='eu-central-1'
        )
        
        print(f"[UPLOAD] Uploading {unique_name} ({len(file_bytes)} bytes) to {bucket_name}")
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=unique_name,
            Body=file_bytes,
            ContentType=content_type
        )
        
        file_url = f"https://storage.yandexcloud.net/{bucket_name}/{unique_name}"
        
        print(f"[UPLOAD] Success! URL: {file_url}")
        
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
    except Exception as e:
        print(f"[UPLOAD ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }