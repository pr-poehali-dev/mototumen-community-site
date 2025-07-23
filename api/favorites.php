<?php
require_once 'config.php';

$user = getUserFromToken();
$pdo = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получение избранного пользователя
    try {
        $category = $_GET['category'] ?? null;
        
        $query = "SELECT * FROM favorites WHERE user_id = ?";
        $params = [$user['userId']];
        
        if ($category && $category !== 'all') {
            $query .= " AND category = ?";
            $params[] = $category;
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $favorites = $stmt->fetchAll();
        
        // Преобразуем данные для ответа
        $favoritesResponse = array_map(function($item) {
            return [
                'id' => (int)$item['id'],
                'item_id' => $item['item_id'],
                'category' => $item['category'],
                'name' => $item['name'],
                'description' => $item['description'],
                'image_url' => $item['image_url'],
                'price' => $item['price'] ? (float)$item['price'] : null,
                'rating' => $item['rating'] ? (float)$item['rating'] : null,
                'location' => $item['location'],
                'external_url' => $item['external_url'],
                'created_at' => $item['created_at']
            ];
        }, $favorites);
        
        sendResponse(['success' => true, 'favorites' => $favoritesResponse]);
        
    } catch (PDOException $e) {
        error_log("Favorites get error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Добавление в избранное
    $data = getInputData();
    
    if (!isset($data['item_id']) || !isset($data['category']) || !isset($data['name'])) {
        sendResponse(['error' => 'item_id, category и name обязательны'], 400);
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO favorites (user_id, item_id, category, name, description, image_url, price, rating, location, external_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name), 
                description = VALUES(description), 
                image_url = VALUES(image_url), 
                price = VALUES(price), 
                rating = VALUES(rating), 
                location = VALUES(location), 
                external_url = VALUES(external_url)
        ");
        
        $stmt->execute([
            $user['userId'],
            $data['item_id'],
            $data['category'],
            $data['name'],
            $data['description'] ?? null,
            $data['image_url'] ?? null,
            $data['price'] ?? null,
            $data['rating'] ?? null,
            $data['location'] ?? null,
            $data['external_url'] ?? null
        ]);
        
        sendResponse(['success' => true, 'message' => 'Добавлено в избранное']);
        
    } catch (PDOException $e) {
        error_log("Favorites add error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Удаление из избранного
    $pathInfo = $_SERVER['PATH_INFO'] ?? '';
    $pathParts = explode('/', trim($pathInfo, '/'));
    
    if (count($pathParts) < 2) {
        sendResponse(['error' => 'Неверный формат URL'], 400);
    }
    
    $item_id = $pathParts[0];
    $category = $pathParts[1];
    
    try {
        $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND item_id = ? AND category = ?");
        $stmt->execute([$user['userId'], $item_id, $category]);
        
        sendResponse(['success' => true, 'message' => 'Удалено из избранного']);
        
    } catch (PDOException $e) {
        error_log("Favorites delete error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
    
} else {
    sendResponse(['error' => 'Метод не поддерживается'], 405);
}
?>