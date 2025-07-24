<?php
class OrderItem {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $sql = "INSERT INTO order_items (order_id, product_id, name, price, quantity, image_url) 
                VALUES (:order_id, :product_id, :name, :price, :quantity, :image_url)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':order_id' => $data['order_id'],
            ':product_id' => $data['product_id'] ?? null,
            ':name' => $data['name'],
            ':price' => $data['price'],
            ':quantity' => $data['quantity'],
            ':image_url' => $data['image_url'] ?? ''
        ]);
    }

    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM order_items WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function getByOrderId($order_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM order_items WHERE order_id = :order_id ORDER BY id");
        $stmt->execute([':order_id' => $order_id]);
        return $stmt->fetchAll();
    }

    public function update($id, $data) {
        $sql = "UPDATE order_items SET 
                product_id = :product_id,
                name = :name,
                price = :price,
                quantity = :quantity,
                image_url = :image_url,
                updated_at = NOW()
                WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':product_id' => $data['product_id'] ?? null,
            ':name' => $data['name'],
            ':price' => $data['price'],
            ':quantity' => $data['quantity'],
            ':image_url' => $data['image_url'] ?? ''
        ]);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM order_items WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function deleteByOrderId($order_id) {
        $stmt = $this->pdo->prepare("DELETE FROM order_items WHERE order_id = :order_id");
        return $stmt->execute([':order_id' => $order_id]);
    }

    public function updateQuantity($id, $quantity) {
        $stmt = $this->pdo->prepare("UPDATE order_items SET quantity = :quantity, updated_at = NOW() WHERE id = :id");
        return $stmt->execute([':id' => $id, ':quantity' => $quantity]);
    }

    public function getTotalByOrderId($order_id) {
        $stmt = $this->pdo->prepare("SELECT SUM(price * quantity) as total FROM order_items WHERE order_id = :order_id");
        $stmt->execute([':order_id' => $order_id]);
        $result = $stmt->fetch();
        return $result['total'] ?? 0;
    }
}
?>