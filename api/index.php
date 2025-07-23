<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Роутинг API запросов
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];

// Убираем базовый путь
$basePath = dirname($scriptName);
$path = str_replace($basePath, '', $requestUri);
$path = parse_url($path, PHP_URL_PATH);
$path = trim($path, '/');

// Убираем index.php из пути если есть
$path = preg_replace('/^index\.php\/?/', '', $path);

// Роутинг
switch ($path) {
    case 'auth':
    case 'auth/telegram':
        require_once 'auth.php';
        break;
        
    case 'user/profile':
    case 'profile':
        require_once 'profile.php';
        break;
        
    case 'user/favorites':
    case 'favorites':
        require_once 'favorites.php';
        break;
        
    case 'user/bikes':
    case 'bikes':
        require_once 'bikes.php';
        break;
        
    default:
        // Проверяем специальные маршруты для DELETE запросов
        if (preg_match('/^(user\/)?favorites\/(.+)$/', $path, $matches)) {
            $_SERVER['PATH_INFO'] = '/' . $matches[2];
            require_once 'favorites.php';
        } elseif (preg_match('/^(user\/)?bikes\/(\d+)$/', $path, $matches)) {
            $_SERVER['PATH_INFO'] = '/' . $matches[2];
            require_once 'bikes.php';
        } else {
            // Главная страница API
            http_response_code(200);
            echo json_encode([
                'message' => 'Moto API Server',
                'version' => '1.0.0',
                'endpoints' => [
                    'POST /auth' => 'Авторизация через Telegram',
                    'GET /user/profile' => 'Получение профиля пользователя',
                    'PUT /user/profile' => 'Обновление профиля пользователя',
                    'GET /user/favorites' => 'Получение избранного',
                    'POST /user/favorites' => 'Добавление в избранное',
                    'DELETE /user/favorites/{item_id}/{category}' => 'Удаление из избранного',
                    'GET /user/bikes' => 'Получение мотоциклов',
                    'POST /user/bikes' => 'Добавление мотоцикла',
                    'DELETE /user/bikes/{bike_id}' => 'Удаление мотоцикла'
                ]
            ], JSON_UNESCAPED_UNICODE);
        }
        break;
}
?>