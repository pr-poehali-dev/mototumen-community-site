<?php
require_once __DIR__.'/../models/UserBike.php';

class BikeController {
    private $bikeModel;

    public function __construct($pdo) {
        $this->bikeModel = new UserBike($pdo);
    }

    public function addBike($userId, $request) {
        // Валидация
        $required = ['brand', 'model', 'year'];
        foreach ($required as $field) {
            if (empty($request[$field])) {
                http_response_code(400);
                return ['error' => "Поле $field обязательно"];
            }
        }

        // Проверяем год
        $currentYear = date('Y');
        if ($request['year'] < 1900 || $request['year'] > $currentYear + 1) {
            http_response_code(400);
            return ['error' => 'Некорректный год выпуска'];
        }

        $request['user_id'] = $userId;

        try {
            $result = $this->bikeModel->create($request);
            if ($result) {
                return [
                    'status' => 'success',
                    'message' => 'Мотоцикл добавлен',
                    'bike_id' => $this->pdo->lastInsertId()
                ];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при добавлении мотоцикла'];
        }
    }

    public function getUserBikes($userId) {
        try {
            $bikes = $this->bikeModel->getByUserId($userId);
            return $bikes;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при получении мотоциклов'];
        }
    }

    public function getBike($bikeId) {
        $bike = $this->bikeModel->getById($bikeId);
        if (!$bike) {
            http_response_code(404);
            return ['error' => 'Мотоцикл не найден'];
        }
        return $bike;
    }

    public function updateBike($bikeId, $request) {
        $bike = $this->bikeModel->getById($bikeId);
        if (!$bike) {
            http_response_code(404);
            return ['error' => 'Мотоцикл не найден'];
        }

        // Проверяем год, если он передан
        if (isset($request['year'])) {
            $currentYear = date('Y');
            if ($request['year'] < 1900 || $request['year'] > $currentYear + 1) {
                http_response_code(400);
                return ['error' => 'Некорректный год выпуска'];
            }
        }

        try {
            $result = $this->bikeModel->update($bikeId, $request);
            if ($result) {
                return ['status' => 'success', 'message' => 'Мотоцикл обновлен'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при обновлении мотоцикла'];
        }
    }

    public function deleteBike($bikeId) {
        $bike = $this->bikeModel->getById($bikeId);
        if (!$bike) {
            http_response_code(404);
            return ['error' => 'Мотоцикл не найден'];
        }

        try {
            $result = $this->bikeModel->delete($bikeId);
            if ($result) {
                return ['status' => 'success', 'message' => 'Мотоцикл удален'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при удалении мотоцикла'];
        }
    }

    public function setPrimaryBike($bikeId, $userId) {
        $bike = $this->bikeModel->getById($bikeId);
        if (!$bike) {
            http_response_code(404);
            return ['error' => 'Мотоцикл не найден'];
        }

        // Проверяем, что мотоцикл принадлежит пользователю
        if ($bike['user_id'] != $userId) {
            http_response_code(403);
            return ['error' => 'Доступ запрещен'];
        }

        try {
            $result = $this->bikeModel->setPrimary($bikeId, $userId);
            if ($result) {
                return ['status' => 'success', 'message' => 'Основной мотоцикл установлен'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при установке основного мотоцикла'];
        }
    }
}
?>