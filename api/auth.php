<?php
// Включаем отображение ошибок для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

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

// Авторизация через Telegram
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные от Telegram
    $raw_input = file_get_contents('php://input');
    error_log("Raw input: " . $raw_input);
    
    $input = json_decode($raw_input, true);
    error_log("Decoded input: " . print_r($input, true));
    
    if (!$input) {
        error_log("JSON decode error: " . json_last_error_msg());
        sendResponse(['error' => 'Неверный формат данных: ' . json_last_error_msg()], 400);
    }
    
    // Проверяем обязательные поля  
    if (!isset($input['id']) || !isset($input['first_name'])) {
        sendResponse(['error' => 'ID и имя обязательны'], 400);
    }
    
    $telegram_id = $input['id'];
    $username = $input['username'] ?? null;
    $first_name = $input['first_name'];
    $last_name = $input['last_name'] ?? null;
    $avatar_url = $input['photo_url'] ?? null;
    
    try {
        $pdo = getConnection();
        
        // Проверяем существует ли пользователь
        $stmt = $pdo->prepare("SELECT * FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegram_id]);
        $existingUser = $stmt->fetch();
        
        error_log("Telegram ID: $telegram_id");
        error_log("Existing user: " . print_r($existingUser, true));
        
        if ($existingUser) {
            // Обновляем данные существующего пользователя
            $stmt = $pdo->prepare("
                UPDATE users 
                SET username = ?, first_name = ?, last_name = ?, avatar = ?, last_login = NOW(), updated_at = NOW() 
                WHERE telegram_id = ?
            ");
            $stmt->execute([$username, $first_name, $last_name, $avatar_url, $telegram_id]);
            
            error_log("User updated for telegram_id: $telegram_id");
            
            $user = $existingUser;
            $user['username'] = $username;
            $user['first_name'] = $first_name;
            $user['last_name'] = $last_name;
            $user['avatar'] = $avatar_url;
        } else {
            // Создаем нового пользователя
            $name = trim($first_name . ' ' . ($last_name ?? ''));
            $member_since = date('Y');
            
            $stmt = $pdo->prepare("
                INSERT INTO users (telegram_id, username, first_name, last_name, name, avatar, member_since, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([$telegram_id, $username, $first_name, $last_name, $name, $avatar_url, $member_since]);
            
            error_log("New user created with telegram_id: $telegram_id");
            
            $userId = $pdo->lastInsertId();
            
            // Получаем созданного пользователя
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
        }
        
        // Создаем JWT токен
        $tokenPayload = [
            'userId' => $user['id'],
            'telegram_id' => $user['telegram_id'],
            'exp' => time() + (30 * 24 * 60 * 60) // 30 дней
        ];
        
        $token = generateJWT($tokenPayload);
        
        // Подготавливаем данные пользователя для ответа
        $userResponse = [
            'id' => (int)$user['id'],
            'telegram_id' => (int)$user['telegram_id'],
            'username' => $user['username'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'avatar' => $user['avatar'],
            'phone' => $user['phone'],
            'email' => $user['email'],
            'location' => $user['location'],
            'rating' => (float)($user['rating'] ?? 0.0),
            'review_count' => (int)($user['review_count'] ?? 0),
            'is_verified' => (bool)($user['is_verified'] ?? false),
            'response_time' => $user['response_time'] ?? '1 час',
            'member_since' => $user['member_since'],
            'created_at' => $user['created_at'],
            'updated_at' => $user['updated_at']
        ];
        
        sendResponse([
            'success' => true,
            'user' => $userResponse,
            'token' => $token
        ]);
        
    } catch (PDOException $e) {
        error_log("Auth PDO error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера: ' . $e->getMessage()], 500);
    } catch (Exception $e) {
        error_log("Auth general error: " . $e->getMessage());
        sendResponse(['error' => 'Ошибка: ' . $e->getMessage()], 500);
    }
} else {
    sendResponse(['error' => 'Метод не поддерживается'], 405);
}
?>