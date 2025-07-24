<?php
class Order {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $sql = "INSERT INTO orders (user_id, order_number, status, total_amount, shipping_address, notes) 
                VALUES (:user_id, :order_number, :status, :total_amount, :shipping_address, :notes)";
        
        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute([
            ':user_id' => $data['user_id'],
            ':order_number' => $data['order_number'] ?? $this->generateOrderNumber(),
            ':status' => $data['status'] ?? 'pending',
            ':total_amount' => $data['total_amount'],
            ':shipping_address' => $data['shipping_address'] ?? '',
            ':notes' => $data['notes'] ?? ''
        ]);
        
        return $result ? $this->pdo->lastInsertId() : false;
    }

    public function getById($id) {
        $stmt = $this->pdo->prepare("
            SELECT o.*, u.first_name, u.last_name, u.email 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE o.id = :id
        ");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function getByUserId($user_id, $limit = 20, $offset = 0) {
        $stmt = $this->pdo->prepare("
            SELECT * FROM orders 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function updateStatus($id, $status) {
        $validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($status, $validStatuses)) {
            return false;
        }

        $stmt = $this->pdo->prepare("UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :id");
        return $stmt->execute([':id' => $id, ':status' => $status]);
    }

    public function update($id, $data) {
        $sql = "UPDATE orders SET 
                status = :status,
                total_amount = :total_amount,
                shipping_address = :shipping_address,
                notes = :notes,
                updated_at = NOW()
                WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':status' => $data['status'],
            ':total_amount' => $data['total_amount'],
            ':shipping_address' => $data['shipping_address'] ?? '',
            ':notes' => $data['notes'] ?? ''
        ]);
    }

    public function delete($id) {
        // Сначала удаляем все элементы заказа
        $stmt1 = $this->pdo->prepare("DELETE FROM order_items WHERE order_id = :id");
        $stmt1->execute([':id' => $id]);
        
        // Затем удаляем сам заказ
        $stmt2 = $this->pdo->prepare("DELETE FROM orders WHERE id = :id");
        return $stmt2->execute([':id' => $id]);
    }

    private function generateOrderNumber() {
        return 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }

    public function getWithItems($id) {
        $order = $this->getById($id);
        if ($order) {
            $stmt = $this->pdo->prepare("SELECT * FROM order_items WHERE order_id = :order_id");
            $stmt->execute([':order_id' => $id]);
            $order['items'] = $stmt->fetchAll();
        }
        return $order;
    }
}
?>