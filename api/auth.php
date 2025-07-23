<?php
require_once 'config.php';

// Авторизация через Telegram
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getInputData();
    
    // Проверяем обязательные поля
    if (!isset($data['telegram_id']) || !isset($data['first_name'])) {
        sendResponse(['error' => 'Telegram ID и имя обязательны'], 400);
    }
    
    $telegram_id = $data['telegram_id'];
    $username = $data['username'] ?? null;
    $first_name = $data['first_name'];
    $last_name = $data['last_name'] ?? null;
    $avatar_url = $data['avatar_url'] ?? null;
    
    try {
        $pdo = getConnection();
        
        // Проверяем существует ли пользователь
        $stmt = $pdo->prepare("SELECT * FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegram_id]);
        $existingUser = $stmt->fetch();
        
        if ($existingUser) {
            // Обновляем данные существующего пользователя
            $stmt = $pdo->prepare("
                UPDATE users 
                SET username = ?, first_name = ?, last_name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE telegram_id = ?
            ");
            $stmt->execute([$username, $first_name, $last_name, $avatar_url, $telegram_id]);
            
            $user = $existingUser;
            $user['username'] = $username;
            $user['first_name'] = $first_name;
            $user['last_name'] = $last_name;
            $user['avatar_url'] = $avatar_url;
        } else {
            // Создаем нового пользователя
            $stmt = $pdo->prepare("
                INSERT INTO users (telegram_id, username, first_name, last_name, avatar_url) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$telegram_id, $username, $first_name, $last_name, $avatar_url]);
            
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
            'avatar_url' => $user['avatar_url'],
            'phone' => $user['phone'],
            'email' => $user['email'],
            'bio' => $user['bio'],
            'experience' => $user['experience'],
            'location' => $user['location'],
            'is_active' => (bool)$user['is_active'],
            'created_at' => $user['created_at'],
            'updated_at' => $user['updated_at']
        ];
        
        sendResponse([
            'success' => true,
            'user' => $userResponse,
            'token' => $token
        ]);
        
    } catch (PDOException $e) {
        error_log("Auth error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
} else {
    sendResponse(['error' => 'Метод не поддерживается'], 405);
}
?>