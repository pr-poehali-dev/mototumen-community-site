"""
Business: Get Telegram channel statistics (member count)
Args: event with httpMethod GET, queryStringParameters with channel username
Returns: JSON with member count and channel info
"""
import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Bot token not configured', 'memberCount': 400}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    channel = params.get('channel', 'MotoTyumen')
    
    try:
        chat_url = f'https://api.telegram.org/bot{bot_token}/getChat?chat_id=@{channel}'
        with urllib.request.urlopen(chat_url, timeout=10) as response:
            chat_data = json.loads(response.read().decode())
        
        if not chat_data.get('ok'):
            raise Exception(chat_data.get('description', 'Failed to get chat'))
        
        members_url = f'https://api.telegram.org/bot{bot_token}/getChatMemberCount?chat_id=@{channel}'
        with urllib.request.urlopen(members_url, timeout=10) as response:
            members_data = json.loads(response.read().decode())
        
        member_count = members_data.get('result', 400) if members_data.get('ok') else 400
        title = chat_data.get('result', {}).get('title', channel)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=600'
            },
            'body': json.dumps({
                'memberCount': member_count,
                'title': title,
                'channel': channel
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'memberCount': 400,
                'title': channel,
                'error': str(e)
            }),
            'isBase64Encoded': False
        }
