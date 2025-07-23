<?php
// API endpoint для работы с карточкой пользователя
require_once __DIR__ . '/../config/database.php';

// CORS заголовки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Получаем user_id из параметров
    $user_id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    if (!$user_id) {
        throw new Exception('Не указан ID пользователя');
    }
    
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Получение данных пользователя
            $query = "SELECT 
                        u.id,
                        u.telegram_id,
                        u.name,
                        u.first_name,
                        u.last_name,
                        u.username,
                        u.avatar,
                        u.email,
                        u.phone,
                        u.location,
                        u.rating,
                        u.review_count,
                        u.is_verified,
                        u.response_time,
                        u.member_since,
                        u.last_login,
                        COUNT(c.id) as total_ads
                      FROM users u 
                      LEFT JOIN classifieds c ON u.id = c.user_id 
                      WHERE u.id = :user_id
                      GROUP BY u.id";
            
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            
            $user = $stmt->fetch();
            
            if (!$user) {
                throw new Exception('Пользователь не найден');
            }
            
            // Получаем последние объявления пользователя
            $ads_query = "SELECT 
                            c.id,
                            c.title,
                            c.price,
                            c.status,
                            c.created_at,
                            i.image_url as main_image
                          FROM classifieds c
                          LEFT JOIN images i ON c.id = i.classified_id AND i.is_main = 1
                          WHERE c.user_id = :user_id 
                          ORDER BY c.created_at DESC 
                          LIMIT 5";
            
            $ads_stmt = $conn->prepare($ads_query);
            $ads_stmt->bindParam(':user_id', $user_id);
            $ads_stmt->execute();
            $recent_ads = $ads_stmt->fetchAll();
            
            echo json_encode([
                'status' => 'success',
                'data' => [
                    'user' => [
                        'id' => (int)$user['id'],
                        'telegram_id' => $user['telegram_id'],
                        'name' => $user['name'],
                        'first_name' => $user['first_name'],
                        'last_name' => $user['last_name'],
                        'username' => $user['username'],
                        'avatar' => $user['avatar'],
                        'email' => $user['email'],
                        'phone' => $user['phone'],
                        'location' => $user['location'],
                        'rating' => (float)$user['rating'],
                        'review_count' => (int)$user['review_count'],
                        'is_verified' => (bool)$user['is_verified'],
                        'response_time' => $user['response_time'],
                        'member_since' => $user['member_since'],
                        'last_login' => $user['last_login'],
                        'total_ads' => (int)$user['total_ads']
                    ],
                    'recent_ads' => $recent_ads
                ]
            ]);
            break;
            
        case 'PUT':
            // Обновление данных пользователя
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('Неверный формат данных');
            }
            
            // Проверяем, что пользователь существует
            $check_query = "SELECT id FROM users WHERE id = :user_id";
            $check_stmt = $conn->prepare($check_query);
            $check_stmt->bindParam(':user_id', $user_id);
            $check_stmt->execute();
            
            if (!$check_stmt->fetch()) {
                throw new Exception('Пользователь не найден');
            }
            
            // Обновляемые поля
            $allowed_fields = [
                'name', 'email', 'phone', 'location', 'response_time'
            ];
            
            $update_fields = [];
            $params = [':user_id' => $user_id];
            
            foreach ($allowed_fields as $field) {
                if (isset($input[$field])) {
                    $update_fields[] = "`$field` = :$field";
                    $params[":$field"] = $input[$field];
                }
            }
            
            if (empty($update_fields)) {
                throw new Exception('Нет данных для обновления');
            }
            
            $query = "UPDATE users SET " . implode(', ', $update_fields) . ", updated_at = NOW() WHERE id = :user_id";
            $stmt = $conn->prepare($query);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $stmt->execute();
            
            // Возвращаем обновленные данные
            $updated_query = "SELECT * FROM users WHERE id = :user_id";
            $updated_stmt = $conn->prepare($updated_query);
            $updated_stmt->bindParam(':user_id', $user_id);
            $updated_stmt->execute();
            $updated_user = $updated_stmt->fetch();
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Данные пользователя обновлены',
                'data' => [
                    'user' => [
                        'id' => (int)$updated_user['id'],
                        'telegram_id' => $updated_user['telegram_id'],
                        'name' => $updated_user['name'],
                        'first_name' => $updated_user['first_name'],
                        'last_name' => $updated_user['last_name'],
                        'username' => $updated_user['username'],
                        'avatar' => $updated_user['avatar'],
                        'email' => $updated_user['email'],
                        'phone' => $updated_user['phone'],
                        'location' => $updated_user['location'],
                        'rating' => (float)$updated_user['rating'],
                        'review_count' => (int)$updated_user['review_count'],
                        'is_verified' => (bool)$updated_user['is_verified'],
                        'response_time' => $updated_user['response_time'],
                        'member_since' => $updated_user['member_since']
                    ]
                ]
            ]);
            break;
            
        default:
            throw new Exception('Метод не поддерживается');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>