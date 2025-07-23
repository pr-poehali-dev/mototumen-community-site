<?php
// API endpoint для работы с объявлениями
require_once __DIR__ . '/../config/database.php';

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
    $database = new Database();
    $conn = $database->getConnection();
    
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Получение объявлений
            $user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
            $category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
            $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
            $search = isset($_GET['search']) ? trim($_GET['search']) : '';
            
            $where_conditions = [];
            $params = [];
            
            // Фильтр по пользователю
            if ($user_id) {
                $where_conditions[] = "c.user_id = :user_id";
                $params[':user_id'] = $user_id;
            }
            
            // Фильтр по категории
            if ($category_id) {
                $where_conditions[] = "c.category_id = :category_id";
                $params[':category_id'] = $category_id;
            }
            
            // Поиск по тексту
            if ($search) {
                $where_conditions[] = "(c.title LIKE :search OR c.description LIKE :search)";
                $params[':search'] = "%$search%";
            }
            
            // Показываем только активные объявления (если не запрашиваются объявления конкретного пользователя)
            if (!$user_id) {
                $where_conditions[] = "c.status = 'active'";
            }
            
            $where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';
            
            $query = "SELECT 
                        c.id,
                        c.title,
                        c.description,
                        c.price,
                        c.currency,
                        c.year,
                        c.mileage,
                        c.engine_volume,
                        c.condition_type,
                        c.location,
                        c.status,
                        c.created_at,
                        c.updated_at,
                        cat.name as category_name,
                        u.name as seller_name,
                        u.rating as seller_rating,
                        u.avatar as seller_avatar,
                        u.response_time,
                        COUNT(DISTINCT f.id) as favorites_count,
                        GROUP_CONCAT(DISTINCT i.image_url ORDER BY i.is_main DESC, i.id ASC) as images
                      FROM classifieds c
                      LEFT JOIN categories cat ON c.category_id = cat.id
                      LEFT JOIN users u ON c.user_id = u.id
                      LEFT JOIN favorites f ON c.id = f.classified_id
                      LEFT JOIN images i ON c.id = i.classified_id
                      $where_clause
                      GROUP BY c.id
                      ORDER BY c.created_at DESC
                      LIMIT :limit OFFSET :offset";
            
            $stmt = $conn->prepare($query);
            
            // Привязываем параметры
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            
            $stmt->execute();
            $classifieds = $stmt->fetchAll();
            
            // Обрабатываем результат
            $processed_classifieds = [];
            foreach ($classifieds as $classified) {
                $images = $classified['images'] ? explode(',', $classified['images']) : [];
                
                $processed_classifieds[] = [
                    'id' => (int)$classified['id'],
                    'title' => $classified['title'],
                    'description' => $classified['description'],
                    'price' => (float)$classified['price'],
                    'currency' => $classified['currency'],
                    'year' => (int)$classified['year'],
                    'mileage' => (int)$classified['mileage'],
                    'engine_volume' => (float)$classified['engine_volume'],
                    'condition' => $classified['condition_type'],
                    'location' => $classified['location'],
                    'status' => $classified['status'],
                    'created_at' => $classified['created_at'],
                    'updated_at' => $classified['updated_at'],
                    'category' => $classified['category_name'],
                    'seller' => [
                        'name' => $classified['seller_name'],
                        'rating' => (float)$classified['seller_rating'],
                        'avatar' => $classified['seller_avatar'],
                        'response_time' => $classified['response_time']
                    ],
                    'favorites_count' => (int)$classified['favorites_count'],
                    'images' => $images,
                    'main_image' => !empty($images) ? $images[0] : null
                ];
            }
            
            // Подсчет общего количества для пагинации
            $count_query = "SELECT COUNT(DISTINCT c.id) as total FROM classifieds c 
                           LEFT JOIN categories cat ON c.category_id = cat.id
                           LEFT JOIN users u ON c.user_id = u.id
                           $where_clause";
            $count_stmt = $conn->prepare($count_query);
            foreach ($params as $key => $value) {
                $count_stmt->bindValue($key, $value);
            }
            $count_stmt->execute();
            $total = $count_stmt->fetch()['total'];
            
            echo json_encode([
                'status' => 'success',
                'data' => [
                    'classifieds' => $processed_classifieds,
                    'pagination' => [
                        'total' => (int)$total,
                        'limit' => $limit,
                        'offset' => $offset,
                        'has_more' => ($offset + $limit) < $total
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