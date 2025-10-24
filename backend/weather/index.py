import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get weather data for Tyumen with road condition
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response with weather data
    '''
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
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    api_key = os.environ.get('OPENWEATHER_API_KEY', '')
    
    if not api_key:
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'temperature': 15,
                'condition': 'clear',
                'wind_speed': 5,
                'road_condition': 'dry',
                'description': 'Ясно',
                'demo': True
            })
        }
    
    city = 'Tyumen'
    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=ru'
    
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
        
        temp = round(data['main']['temp'])
        condition = data['weather'][0]['main'].lower()
        description = data['weather'][0]['description']
        wind_speed = round(data['wind']['speed'])
        
        road_condition = 'dry'
        if condition in ['rain', 'drizzle', 'thunderstorm']:
            road_condition = 'wet'
        elif condition in ['snow', 'sleet']:
            road_condition = 'icy'
        elif temp < 0:
            road_condition = 'icy'
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'temperature': temp,
                'condition': condition,
                'wind_speed': wind_speed,
                'road_condition': road_condition,
                'description': description,
                'demo': False
            })
        }
    except urllib.error.URLError:
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'temperature': 15,
                'condition': 'clear',
                'wind_speed': 5,
                'road_condition': 'dry',
                'description': 'Ясно',
                'demo': True
            })
        }
