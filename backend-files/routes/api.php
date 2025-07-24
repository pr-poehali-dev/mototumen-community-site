<?php
require_once __DIR__.'/../config/db.php';
require_once __DIR__.'/../controllers/UserController.php';
require_once __DIR__.'/../controllers/BikeController.php';
require_once __DIR__.'/../controllers/OrderController.php';
require_once __DIR__.'/../controllers/SettingsController.php';
require_once __DIR__.'/../controllers/FavoriteController.php';

// CORS заголовки
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2)[0];
$method = $_SERVER['REQUEST_METHOD'];

// Получаем данные из body для POST/PUT запросов
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Функция для отправки JSON ответа
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Функция для получения параметров из URL
function getUrlParams($pattern, $uri) {
    if (preg_match($pattern, $uri, $matches)) {
        array_shift($matches); // Убираем полное совпадение
        return $matches;
    }
    return false;
}

try {
    // ========== ПОЛЬЗОВАТЕЛИ ==========
    
    // POST /api/users/register - Регистрация
    if ($request_uri === '/api/users/register' && $method === 'POST') {
        $controller = new UserController($pdo);
        $result = $controller->register($input);
        sendResponse($result);
    }
    
    // POST /api/users/login/telegram - Вход через Telegram
    if ($request_uri === '/api/users/login/telegram' && $method === 'POST') {
        $controller = new UserController($pdo);
        $result = $controller->loginByTelegram($input['telegram_id']);
        sendResponse($result);
    }
    
    // GET /api/users/{id} - Получить профиль
    if ($params = getUrlParams('#^/api/users/(\d+)$#', $request_uri) && $method === 'GET') {
        $controller = new UserController($pdo);
        $result = $controller->getProfile($params[0]);
        sendResponse($result);
    }
    
    // PUT /api/users/{id} - Обновить профиль
    if ($params = getUrlParams('#^/api/users/(\d+)$#', $request_uri) && $method === 'PUT') {
        $controller = new UserController($pdo);
        $result = $controller->updateProfile($params[0], $input);
        sendResponse($result);
    }
    
    // DELETE /api/users/{id} - Удалить пользователя
    if ($params = getUrlParams('#^/api/users/(\d+)$#', $request_uri) && $method === 'DELETE') {
        $controller = new UserController($pdo);
        $result = $controller->deleteUser($params[0]);
        sendResponse($result);
    }
    
    // GET /api/users - Получить всех пользователей
    if ($request_uri === '/api/users' && $method === 'GET') {
        $controller = new UserController($pdo);
        $limit = $_GET['limit'] ?? 50;
        $offset = $_GET['offset'] ?? 0;
        $result = $controller->getUsers($limit, $offset);
        sendResponse($result);
    }
    
    // ========== МОТОЦИКЛЫ ==========
    
    // POST /api/users/{id}/bikes - Добавить мотоцикл
    if ($params = getUrlParams('#^/api/users/(\d+)/bikes$#', $request_uri) && $method === 'POST') {
        $controller = new BikeController($pdo);
        $result = $controller->addBike($params[0], $input);
        sendResponse($result);
    }
    
    // GET /api/users/{id}/bikes - Получить мотоциклы пользователя
    if ($params = getUrlParams('#^/api/users/(\d+)/bikes$#', $request_uri) && $method === 'GET') {
        $controller = new BikeController($pdo);
        $result = $controller->getUserBikes($params[0]);
        sendResponse($result);
    }
    
    // GET /api/bikes/{id} - Получить мотоцикл
    if ($params = getUrlParams('#^/api/bikes/(\d+)$#', $request_uri) && $method === 'GET') {
        $controller = new BikeController($pdo);
        $result = $controller->getBike($params[0]);
        sendResponse($result);
    }
    
    // PUT /api/bikes/{id} - Обновить мотоцикл
    if ($params = getUrlParams('#^/api/bikes/(\d+)$#', $request_uri) && $method === 'PUT') {
        $controller = new BikeController($pdo);
        $result = $controller->updateBike($params[0], $input);
        sendResponse($result);
    }
    
    // DELETE /api/bikes/{id} - Удалить мотоцикл
    if ($params = getUrlParams('#^/api/bikes/(\d+)$#', $request_uri) && $method === 'DELETE') {
        $controller = new BikeController($pdo);
        $result = $controller->deleteBike($params[0]);
        sendResponse($result);
    }
    
    // PUT /api/bikes/{id}/primary - Установить основным
    if ($params = getUrlParams('#^/api/bikes/(\d+)/primary$#', $request_uri) && $method === 'PUT') {
        $controller = new BikeController($pdo);
        $result = $controller->setPrimaryBike($params[0], $input['user_id']);
        sendResponse($result);
    }
    
    // ========== ЗАКАЗЫ ==========
    
    // POST /api/orders - Создать заказ
    if ($request_uri === '/api/orders' && $method === 'POST') {
        $controller = new OrderController($pdo);
        $result = $controller->createOrder($input);
        sendResponse($result);
    }
    
    // GET /api/orders/{id} - Получить заказ
    if ($params = getUrlParams('#^/api/orders/(\d+)$#', $request_uri) && $method === 'GET') {
        $controller = new OrderController($pdo);
        $result = $controller->getOrder($params[0]);
        sendResponse($result);
    }
    
    // PUT /api/orders/{id} - Обновить заказ
    if ($params = getUrlParams('#^/api/orders/(\d+)$#', $request_uri) && $method === 'PUT') {
        $controller = new OrderController($pdo);
        $result = $controller->updateOrder($params[0], $input);
        sendResponse($result);
    }
    
    // DELETE /api/orders/{id} - Удалить заказ
    if ($params = getUrlParams('#^/api/orders/(\d+)$#', $request_uri) && $method === 'DELETE') {
        $controller = new OrderController($pdo);
        $result = $controller->deleteOrder($params[0]);
        sendResponse($result);
    }
    
    // PUT /api/orders/{id}/status - Обновить статус
    if ($params = getUrlParams('#^/api/orders/(\d+)/status$#', $request_uri) && $method === 'PUT') {
        $controller = new OrderController($pdo);
        $result = $controller->updateOrderStatus($params[0], $input);
        sendResponse($result);
    }
    
    // GET /api/users/{id}/orders - Получить заказы пользователя
    if ($params = getUrlParams('#^/api/users/(\d+)/orders$#', $request_uri) && $method === 'GET') {
        $controller = new OrderController($pdo);
        $limit = $_GET['limit'] ?? 20;
        $offset = $_GET['offset'] ?? 0;
        $result = $controller->getUserOrders($params[0], $limit, $offset);
        sendResponse($result);
    }
    
    // POST /api/orders/{id}/items - Добавить товар в заказ
    if ($params = getUrlParams('#^/api/orders/(\d+)/items$#', $request_uri) && $method === 'POST') {
        $controller = new OrderController($pdo);
        $result = $controller->addOrderItem($params[0], $input);
        sendResponse($result);
    }
    
    // DELETE /api/order-items/{id} - Удалить товар из заказа
    if ($params = getUrlParams('#^/api/order-items/(\d+)$#', $request_uri) && $method === 'DELETE') {
        $controller = new OrderController($pdo);
        $result = $controller->removeOrderItem($params[0]);
        sendResponse($result);
    }
    
    // ========== НАСТРОЙКИ ==========
    
    // GET /api/users/{id}/settings - Получить настройки
    if ($params = getUrlParams('#^/api/users/(\d+)/settings$#', $request_uri) && $method === 'GET') {
        $controller = new SettingsController($pdo);
        $result = $controller->getSettings($params[0]);
        sendResponse($result);
    }
    
    // PUT /api/users/{id}/settings - Обновить настройки
    if ($params = getUrlParams('#^/api/users/(\d+)/settings$#', $request_uri) && $method === 'PUT') {
        $controller = new SettingsController($pdo);
        $result = $controller->updateSettings($params[0], $input);
        sendResponse($result);
    }
    
    // PUT /api/users/{id}/settings/theme - Сменить тему
    if ($params = getUrlParams('#^/api/users/(\d+)/settings/theme$#', $request_uri) && $method === 'PUT') {
        $controller = new SettingsController($pdo);
        $result = $controller->setTheme($params[0], $input['theme']);
        sendResponse($result);
    }
    
    // PUT /api/users/{id}/settings/language - Сменить язык
    if ($params = getUrlParams('#^/api/users/(\d+)/settings/language$#', $request_uri) && $method === 'PUT') {
        $controller = new SettingsController($pdo);
        $result = $controller->setLanguage($params[0], $input['language']);
        sendResponse($result);
    }
    
    // PUT /api/users/{id}/settings/notifications/toggle - Переключить уведомления
    if ($params = getUrlParams('#^/api/users/(\d+)/settings/notifications/toggle$#', $request_uri) && $method === 'PUT') {
        $controller = new SettingsController($pdo);
        $result = $controller->toggleNotifications($params[0]);
        sendResponse($result);
    }
    
    // POST /api/users/{id}/settings/reset - Сбросить настройки
    if ($params = getUrlParams('#^/api/users/(\d+)/settings/reset$#', $request_uri) && $method === 'POST') {
        $controller = new SettingsController($pdo);
        $result = $controller->resetSettings($params[0]);
        sendResponse($result);
    }
    
    // ========== ИЗБРАННОЕ ==========
    
    // POST /api/favorites - Добавить в избранное
    if ($request_uri === '/api/favorites' && $method === 'POST') {
        $controller = new FavoriteController($pdo);
        $result = $controller->addToFavorites($input);
        sendResponse($result);
    }
    
    // DELETE /api/favorites/{id} - Удалить из избранного
    if ($params = getUrlParams('#^/api/favorites/(\d+)$#', $request_uri) && $method === 'DELETE') {
        $controller = new FavoriteController($pdo);
        $result = $controller->removeFromFavorites($params[0]);
        sendResponse($result);
    }
    
    // POST /api/favorites/toggle - Переключить избранное
    if ($request_uri === '/api/favorites/toggle' && $method === 'POST') {
        $controller = new FavoriteController($pdo);
        $result = $controller->toggleFavorite($input);
        sendResponse($result);
    }
    
    // GET /api/users/{id}/favorites - Получить избранное пользователя
    if ($params = getUrlParams('#^/api/users/(\d+)/favorites$#', $request_uri) && $method === 'GET') {
        $controller = new FavoriteController($pdo);
        $itemType = $_GET['type'] ?? null;
        $result = $controller->getUserFavorites($params[0], $itemType);
        sendResponse($result);
    }
    
    // GET /api/favorites/check - Проверить избранное
    if ($request_uri === '/api/favorites/check' && $method === 'GET') {
        $controller = new FavoriteController($pdo);
        $result = $controller->checkFavorite($_GET['user_id'], $_GET['item_type'], $_GET['item_id']);
        sendResponse($result);
    }
    
    // PUT /api/favorites/{id}/notes - Обновить заметку
    if ($params = getUrlParams('#^/api/favorites/(\d+)/notes$#', $request_uri) && $method === 'PUT') {
        $controller = new FavoriteController($pdo);
        $result = $controller->updateNotes($params[0], $input);
        sendResponse($result);
    }
    
    // GET /api/users/{id}/favorites/count - Количество избранного
    if ($params = getUrlParams('#^/api/users/(\d+)/favorites/count$#', $request_uri) && $method === 'GET') {
        $controller = new FavoriteController($pdo);
        $itemType = $_GET['type'] ?? null;
        $result = $controller->getFavoritesCount($params[0], $itemType);
        sendResponse($result);
    }
    
    // ========== ПРОВЕРКА ЗДОРОВЬЯ API ==========
    
    // GET /api/health - Проверка работоспособности
    if ($request_uri === '/api/health' && $method === 'GET') {
        sendResponse([
            'status' => 'ok',
            'timestamp' => date('Y-m-d H:i:s'),
            'version' => '1.0.0'
        ]);
    }
    
    // ========== ОБРАБОТКА НЕИЗВЕСТНЫХ МАРШРУТОВ ==========
    
    http_response_code(404);
    sendResponse(['error' => 'Endpoint not found', 'uri' => $request_uri, 'method' => $method]);

} catch (Exception $e) {
    http_response_code(500);
    sendResponse(['error' => 'Internal server error: ' . $e->getMessage()]);
}
?>