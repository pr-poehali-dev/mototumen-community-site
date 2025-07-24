<?php
require_once __DIR__.'/../models/Favorite.php';

class FavoriteController {
    private $favoriteModel;

    public function __construct($pdo) {
        $this->favoriteModel = new Favorite($pdo);
    }

    public function addToFavorites($request) {
        // Валидация
        if (empty($request['user_id']) || empty($request['item_type']) || empty($request['item_id'])) {
            http_response_code(400);
            return ['error' => 'user_id, item_type, item_id обязательны'];
        }

        $validTypes = ['product', 'bike', 'user', 'article'];
        if (!in_array($request['item_type'], $validTypes)) {
            http_response_code(400);
            return ['error' => 'Некорректный тип элемента. Доступны: ' . implode(', ', $validTypes)];
        }

        try {
            $result = $this->favoriteModel->create($request);
            if ($result) {
                return ['status' => 'success', 'message' => 'Добавлено в избранное'];
            } else {
                return ['error' => 'Элемент уже в избранном'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при добавлении в избранное'];
        }
    }

    public function removeFromFavorites($favoriteId) {
        $favorite = $this->favoriteModel->getById($favoriteId);
        if (!$favorite) {
            http_response_code(404);
            return ['error' => 'Элемент не найден в избранном'];
        }

        try {
            $result = $this->favoriteModel->delete($favoriteId);
            if ($result) {
                return ['status' => 'success', 'message' => 'Удалено из избранного'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при удалении из избранного'];
        }
    }

    public function removeByItem($userId, $itemType, $itemId) {
        try {
            $result = $this->favoriteModel->deleteByItem($userId, $itemType, $itemId);
            if ($result) {
                return ['status' => 'success', 'message' => 'Удалено из избранного'];
            } else {
                http_response_code(404);
                return ['error' => 'Элемент не найден в избранном'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при удалении из избранного'];
        }
    }

    public function getUserFavorites($userId, $itemType = null) {
        try {
            $favorites = $this->favoriteModel->getByUserId($userId, $itemType);
            return $favorites;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при получении избранного'];
        }
    }

    public function checkFavorite($userId, $itemType, $itemId) {
        try {
            $exists = $this->favoriteModel->exists($userId, $itemType, $itemId);
            return ['is_favorite' => $exists];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при проверке избранного'];
        }
    }

    public function toggleFavorite($request) {
        // Валидация
        if (empty($request['user_id']) || empty($request['item_type']) || empty($request['item_id'])) {
            http_response_code(400);
            return ['error' => 'user_id, item_type, item_id обязательны'];
        }

        try {
            $result = $this->favoriteModel->toggle(
                $request['user_id'],
                $request['item_type'],
                $request['item_id'],
                $request['notes'] ?? ''
            );
            return $result;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при переключении избранного'];
        }
    }

    public function updateNotes($favoriteId, $request) {
        $favorite = $this->favoriteModel->getById($favoriteId);
        if (!$favorite) {
            http_response_code(404);
            return ['error' => 'Элемент не найден в избранном'];
        }

        try {
            $result = $this->favoriteModel->updateNotes($favoriteId, $request['notes'] ?? '');
            if ($result) {
                return ['status' => 'success', 'message' => 'Заметка обновлена'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при обновлении заметки'];
        }
    }

    public function getFavoritesCount($userId, $itemType = null) {
        try {
            $count = $this->favoriteModel->getCount($userId, $itemType);
            return ['count' => $count];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при подсчете избранного'];
        }
    }

    public function getFavoritesByType($userId) {
        try {
            $types = ['product', 'bike', 'user', 'article'];
            $result = [];
            
            foreach ($types as $type) {
                $result[$type] = $this->favoriteModel->getByUserId($userId, $type);
            }
            
            return $result;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при получении избранного по типам'];
        }
    }
}
?>