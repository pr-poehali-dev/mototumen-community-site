<?php
require_once 'config.php';

$user = getUserFromToken();
$pdo = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получение мотоциклов пользователя
    try {
        $stmt = $pdo->prepare("
            SELECT * FROM user_bikes 
            WHERE user_id = ? 
            ORDER BY is_primary DESC, created_at DESC
        ");
        $stmt->execute([$user['userId']]);
        $bikes = $stmt->fetchAll();
        
        // Преобразуем данные для ответа
        $bikesResponse = array_map(function($bike) {
            return [
                'id' => (int)$bike['id'],
                'brand' => $bike['brand'],
                'model' => $bike['model'],
                'year' => $bike['year'] ? (int)$bike['year'] : null,
                'engine_volume' => $bike['engine_volume'] ? (int)$bike['engine_volume'] : null,
                'color' => $bike['color'],
                'mileage' => (int)$bike['mileage'],
                'is_primary' => (bool)$bike['is_primary'],
                'notes' => $bike['notes'],
                'created_at' => $bike['created_at'],
                'updated_at' => $bike['updated_at']
            ];
        }, $bikes);
        
        sendResponse(['success' => true, 'bikes' => $bikesResponse]);
        
    } catch (PDOException $e) {
        error_log("Bikes get error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Добавление мотоцикла
    $data = getInputData();
    
    if (!isset($data['brand']) || !isset($data['model'])) {
        sendResponse(['error' => 'Марка и модель обязательны'], 400);
    }
    
    try {
        // Если это основной мотоцикл, убираем флаг у других
        if (isset($data['is_primary']) && $data['is_primary']) {
            $stmt = $pdo->prepare("UPDATE user_bikes SET is_primary = FALSE WHERE user_id = ?");
            $stmt->execute([$user['userId']]);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO user_bikes (user_id, brand, model, year, engine_volume, color, mileage, is_primary, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $user['userId'],
            $data['brand'],
            $data['model'],
            $data['year'] ?? null,
            $data['engine_volume'] ?? null,
            $data['color'] ?? null,
            $data['mileage'] ?? 0,
            $data['is_primary'] ?? false,
            $data['notes'] ?? null
        ]);
        
        $bikeId = $pdo->lastInsertId();
        
        // Получаем созданный мотоцикл
        $stmt = $pdo->prepare("SELECT * FROM user_bikes WHERE id = ?");
        $stmt->execute([$bikeId]);
        $newBike = $stmt->fetch();
        
        $bikeResponse = [
            'id' => (int)$newBike['id'],
            'brand' => $newBike['brand'],
            'model' => $newBike['model'],
            'year' => $newBike['year'] ? (int)$newBike['year'] : null,
            'engine_volume' => $newBike['engine_volume'] ? (int)$newBike['engine_volume'] : null,
            'color' => $newBike['color'],
            'mileage' => (int)$newBike['mileage'],
            'is_primary' => (bool)$newBike['is_primary'],
            'notes' => $newBike['notes'],
            'created_at' => $newBike['created_at'],
            'updated_at' => $newBike['updated_at']
        ];
        
        sendResponse(['success' => true, 'bike' => $bikeResponse]);
        
    } catch (PDOException $e) {
        error_log("Bikes add error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Удаление мотоцикла
    $pathInfo = $_SERVER['PATH_INFO'] ?? '';
    $bikeId = (int)trim($pathInfo, '/');
    
    if (!$bikeId) {
        sendResponse(['error' => 'Неверный ID мотоцикла'], 400);
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM user_bikes WHERE id = ? AND user_id = ?");
        $stmt->execute([$bikeId, $user['userId']]);
        
        if ($stmt->rowCount() === 0) {
            sendResponse(['error' => 'Мотоцикл не найден'], 404);
        }
        
        sendResponse(['success' => true, 'message' => 'Мотоцикл удален']);
        
    } catch (PDOException $e) {
        error_log("Bikes delete error: " . $e->getMessage());
        sendResponse(['error' => 'Внутренняя ошибка сервера'], 500);
    }
    
} else {
    sendResponse(['error' => 'Метод не поддерживается'], 405);
}
?>