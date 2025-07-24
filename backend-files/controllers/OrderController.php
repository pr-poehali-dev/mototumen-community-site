<?php
require_once __DIR__.'/../models/Order.php';
require_once __DIR__.'/../models/OrderItem.php';

class OrderController {
    private $orderModel;
    private $orderItemModel;

    public function __construct($pdo) {
        $this->orderModel = new Order($pdo);
        $this->orderItemModel = new OrderItem($pdo);
    }

    public function createOrder($request) {
        // Валидация
        if (empty($request['user_id']) || empty($request['total_amount']) || empty($request['items'])) {
            http_response_code(400);
            return ['error' => 'user_id, total_amount и items обязательны'];
        }

        if (!is_array($request['items']) || empty($request['items'])) {
            http_response_code(400);
            return ['error' => 'items должен быть непустым массивом'];
        }

        try {
            // Создаем заказ
            $orderId = $this->orderModel->create($request);
            if (!$orderId) {
                throw new Exception('Не удалось создать заказ');
            }

            // Добавляем товары в заказ
            foreach ($request['items'] as $item) {
                if (empty($item['name']) || empty($item['price']) || empty($item['quantity'])) {
                    throw new Exception('Каждый товар должен содержать name, price, quantity');
                }

                $item['order_id'] = $orderId;
                $this->orderItemModel->create($item);
            }

            return [
                'status' => 'success',
                'message' => 'Заказ создан',
                'order_id' => $orderId
            ];

        } catch (Exception $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при создании заказа: ' . $e->getMessage()];
        }
    }

    public function getOrder($orderId) {
        $order = $this->orderModel->getWithItems($orderId);
        if (!$order) {
            http_response_code(404);
            return ['error' => 'Заказ не найден'];
        }
        return $order;
    }

    public function getUserOrders($userId, $limit = 20, $offset = 0) {
        try {
            $orders = $this->orderModel->getByUserId($userId, $limit, $offset);
            
            // Добавляем товары к каждому заказу
            foreach ($orders as &$order) {
                $order['items'] = $this->orderItemModel->getByOrderId($order['id']);
            }
            
            return $orders;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при получении заказов'];
        }
    }

    public function updateOrderStatus($orderId, $request) {
        if (empty($request['status'])) {
            http_response_code(400);
            return ['error' => 'status обязателен'];
        }

        $order = $this->orderModel->getById($orderId);
        if (!$order) {
            http_response_code(404);
            return ['error' => 'Заказ не найден'];
        }

        try {
            $result = $this->orderModel->updateStatus($orderId, $request['status']);
            if ($result) {
                return ['status' => 'success', 'message' => 'Статус заказа обновлен'];
            } else {
                return ['error' => 'Некорректный статус'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при обновлении статуса'];
        }
    }

    public function updateOrder($orderId, $request) {
        $order = $this->orderModel->getById($orderId);
        if (!$order) {
            http_response_code(404);
            return ['error' => 'Заказ не найден'];
        }

        try {
            $result = $this->orderModel->update($orderId, $request);
            if ($result) {
                return ['status' => 'success', 'message' => 'Заказ обновлен'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при обновлении заказа'];
        }
    }

    public function deleteOrder($orderId) {
        $order = $this->orderModel->getById($orderId);
        if (!$order) {
            http_response_code(404);
            return ['error' => 'Заказ не найден'];
        }

        try {
            $result = $this->orderModel->delete($orderId);
            if ($result) {
                return ['status' => 'success', 'message' => 'Заказ удален'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при удалении заказа'];
        }
    }

    public function addOrderItem($orderId, $request) {
        $order = $this->orderModel->getById($orderId);
        if (!$order) {
            http_response_code(404);
            return ['error' => 'Заказ не найден'];
        }

        if (empty($request['name']) || empty($request['price']) || empty($request['quantity'])) {
            http_response_code(400);
            return ['error' => 'name, price, quantity обязательны'];
        }

        $request['order_id'] = $orderId;

        try {
            $result = $this->orderItemModel->create($request);
            if ($result) {
                // Пересчитываем общую сумму заказа
                $newTotal = $this->orderItemModel->getTotalByOrderId($orderId);
                $this->orderModel->update($orderId, ['total_amount' => $newTotal] + $order);
                
                return ['status' => 'success', 'message' => 'Товар добавлен в заказ'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при добавлении товара'];
        }
    }

    public function removeOrderItem($itemId) {
        $item = $this->orderItemModel->getById($itemId);
        if (!$item) {
            http_response_code(404);
            return ['error' => 'Товар не найден'];
        }

        try {
            $orderId = $item['order_id'];
            $result = $this->orderItemModel->delete($itemId);
            
            if ($result) {
                // Пересчитываем общую сумму заказа
                $newTotal = $this->orderItemModel->getTotalByOrderId($orderId);
                $order = $this->orderModel->getById($orderId);
                $this->orderModel->update($orderId, ['total_amount' => $newTotal] + $order);
                
                return ['status' => 'success', 'message' => 'Товар удален из заказа'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при удалении товара'];
        }
    }
}
?>