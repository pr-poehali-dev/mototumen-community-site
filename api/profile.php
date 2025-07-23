<?php
require_once 'config.php';

$user = getUserFromToken();
$pdo = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получение профиля пользователя
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$user['userId']]);
        $userProfile = $stmt->fetch();
        
        if (!$userProfile) {
            sendResponse(['error' => 'Пользователь не найден'], 404);
        }
        
        $userResponse = [
            'id' => (int)$userProfile['id'],
            'telegram_id' => (int)$userProfile['telegram_id'],
            'username' => $userProfile['username'],
            'first_name' => $userProfile['first_name'],
            'last_name' => $userProfile['last_name'],
            'avatar_url' => $userProfile['avatar_url'],
            'phone' => $userProfile['phone'],
            'email' => $userProfile['email'],
            'bio' => $userProfile['bio'],
            'experience' => $userProfile['experience'],
            'location' => $userProfile['location'],
            'is_active' => (bool)$userProfile['is_active'],
            'created_at' => $userProfile['created_at'],
            'updated_at' => $userProfile['updated_at']
        ];
        
        sendResponse(['success' => true, 'user' => $userResponse]);
        
    } catch (PDOException $e) {
        error_log("Profile get error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Обновление профиля пользователя
    $data = getInputData();
    
    try {
        $phone = $data['phone'] ?? null;
        $email = $data['email'] ?? null;
        $bio = $data['bio'] ?? null;
        $experience = $data['experience'] ?? null;
        $location = $data['location'] ?? null;
        
        $stmt = $pdo->prepare("
            UPDATE users 
            SET phone = ?, email = ?, bio = ?, experience = ?, location = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        ");
        $stmt->execute([$phone, $email, $bio, $experience, $location, $user['userId']]);
        
        // Получаем обновленные данные
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$user['userId']]);
        $updatedUser = $stmt->fetch();
        
        $userResponse = [
            'id' => (int)$updatedUser['id'],
            'telegram_id' => (int)$updatedUser['telegram_id'],
            'username' => $updatedUser['username'],
            'first_name' => $updatedUser['first_name'],
            'last_name' => $updatedUser['last_name'],
            'avatar_url' => $updatedUser['avatar_url'],
            'phone' => $updatedUser['phone'],
            'email' => $updatedUser['email'],
            'bio' => $updatedUser['bio'],
            'experience' => $updatedUser['experience'],
            'location' => $updatedUser['location'],
            'is_active' => (bool)$updatedUser['is_active'],
            'created_at' => $updatedUser['created_at'],
            'updated_at' => $updatedUser['updated_at']
        ];
        
        sendResponse(['success' => true, 'user' => $userResponse]);
        
    } catch (PDOException $e) {
        error_log("Profile update error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
    
} else {
    sendResponse(['error' => 'Метод не поддерживается'], 405);
}
?>