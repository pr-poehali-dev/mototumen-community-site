<?php
header('Content-Type: application/json; charset=utf-8');

try {
    // Подключение к БД
    $dsn = "mysql:host=server184.hosting.reg.ru;port=3306;dbname=moto_classifieds;charset=utf8mb4";
    $pdo = new PDO($dsn, 'u3183548_default', '81DitCnnDi2664KZ', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Подключение к БД успешно',
        'info' => [
            'method' => $_SERVER['REQUEST_METHOD'],
            'raw_input' => file_get_contents('php://input'),
            'get_params' => $_GET,
            'post_params' => $_POST
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>