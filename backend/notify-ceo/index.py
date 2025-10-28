"""
Business: Send Telegram notifications to all CEOs
Args: event with httpMethod, body containing message and notification_type; context with request_id
Returns: HTTP response with success status
"""
import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

SCHEMA = 't_p21120869_mototumen_community_'

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def get_ceo_telegram_ids(cur) -> List[int]:
    cur.execute(
        f"SELECT telegram_id FROM {SCHEMA}.users WHERE role = 'ceo' AND telegram_id IS NOT NULL"
    )
    rows = cur.fetchall()
    return [row['telegram_id'] for row in rows]

def send_telegram_message(bot_token: str, chat_id: int, message: str) -> bool:
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"Failed to send message to {chat_id}: {e}")
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        body = json.loads(event.get('body', '{}'))
        message = body.get('message', '')
        notification_type = body.get('type', 'info')
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Message is required'}),
                'isBase64Encoded': False
            }
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        if not bot_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Bot token not configured'}),
                'isBase64Encoded': False
            }
        
        ceo_ids = get_ceo_telegram_ids(cur)
        
        if not ceo_ids:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No CEOs found with Telegram ID'}),
                'isBase64Encoded': False
            }
        
        icon_map = {
            'info': 'ℹ️',
            'warning': '⚠️',
            'error': '❌',
            'success': '✅',
            'password_reset': '🔑',
            'new_user': '👤',
            'organization_request': '🏢'
        }
        
        icon = icon_map.get(notification_type, 'ℹ️')
        formatted_message = f"{icon} <b>МотоТюмень Админка</b>\n\n{message}"
        
        success_count = 0
        for chat_id in ceo_ids:
            if send_telegram_message(bot_token, chat_id, formatted_message):
                success_count += 1
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'sent_to': success_count,
                'total_ceos': len(ceo_ids)
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
