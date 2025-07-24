<?php
require_once __DIR__.'/../models/User.php';
require_once __DIR__.'/../models/UserBike.php';
require_once __DIR__.'/../models/UserSettings.php';

class UserController {
    private $userModel;
    private $bikeModel;
    private $settingsModel;

    public function __construct($pdo) {
        $this->userModel = new User($pdo);
        $this->bikeModel = new UserBike($pdo);
        $this->settingsModel = new UserSettings($pdo);
    }

    public function register($request) {
        // Валидация
        if (empty($request['username']) || empty($request['email'])) {
            http_response_code(400);
            return ['error' => 'Username и email обязательны'];
        }

        try {
            $result = $this->userModel->create($request);
            if ($result) {
                $userId = $this->pdo->lastInsertId();
                // Создаем дефолтные настройки
                $this->settingsModel->create(['user_id' => $userId]);
                
                return [
                    'status' => 'success',
                    'message' => 'Пользователь зарегистрирован',
                    'user_id' => $userId
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при регистрации: ' . $e->getMessage()];
        }
    }

    public function getProfile($userId) {
        $user = $this->userModel->getById($userId);
        if (!$user) {
            http_response_code(404);
            return ['error' => 'Пользователь не найден'];
        }

        // Получаем дополнительные данные
        $user['bikes'] = $this->bikeModel->getByUserId($userId);
        $user['settings'] = $this->settingsModel->getByUserId($userId);
        
        // Убираем чувствительные данные
        unset($user['created_at'], $user['updated_at']);
        
        return $user;
    }

    public function updateProfile($userId, $request) {
        $user = $this->userModel->getById($userId);
        if (!$user) {
            http_response_code(404);
            return ['error' => 'Пользователь не найден'];
        }

        try {
            $result = $this->userModel->update($userId, $request);
            if ($result) {
                return ['status' => 'success', 'message' => 'Профиль обновлен'];
            } else {
                return ['error' => 'Ошибка при обновлении'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка базы данных: ' . $e->getMessage()];
        }
    }

    public function deleteUser($userId) {
        $user = $this->userModel->getById($userId);
        if (!$user) {
            http_response_code(404);
            return ['error' => 'Пользователь не найден'];
        }

        try {
            // Удаляем связанные данные
            $this->settingsModel->delete($userId);
            
            $result = $this->userModel->delete($userId);
            if ($result) {
                return ['status' => 'success', 'message' => 'Пользователь удален'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при удалении: ' . $e->getMessage()];
        }
    }

    public function getUsers($limit = 50, $offset = 0) {
        try {
            $users = $this->userModel->getAll($limit, $offset);
            
            // Убираем чувствительные данные
            foreach ($users as &$user) {
                unset($user['created_at'], $user['updated_at']);
            }
            
            return $users;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при получении пользователей'];
        }
    }

    public function loginByTelegram($telegramId) {
        $user = $this->userModel->getByTelegramId($telegramId);
        if (!$user) {
            http_response_code(404);
            return ['error' => 'Пользователь не найден'];
        }

        if (!$user['is_active']) {
            http_response_code(403);
            return ['error' => 'Аккаунт заблокирован'];
        }

        return $this->getProfile($user['id']);
    }
}
?>