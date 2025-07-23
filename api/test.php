<?php
// CORS заголовки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Тестовый ответ
    $response = [
        'status' => 'success',
        'message' => 'API работает!',
        'method' => $_SERVER['REQUEST_METHOD'],
        'timestamp' => date('Y-m-d H:i:s'),
        'data' => []
    ];
    
    // Если POST запрос, показываем полученные данные
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw_input = file_get_contents('php://input');
        $input = json_decode($raw_input, true);
        
        $response['raw_input'] = $raw_input;
        $response['parsed_input'] = $input;
        $response['json_error'] = json_last_error_msg();
    }
    
    http_response_code(200);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>