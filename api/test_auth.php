<?php
// Тестовый скрипт для проверки авторизации
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

echo json_encode([
    'status' => 'success',
    'message' => 'Тест API работает!',
    'method' => $_SERVER['REQUEST_METHOD'],
    'headers' => getallheaders(),
    'input' => file_get_contents('php://input'),
    'post' => $_POST,
    'get' => $_GET
], JSON_UNESCAPED_UNICODE);
?>