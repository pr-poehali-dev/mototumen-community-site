<?php
class UserBike {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $sql = "INSERT INTO user_bikes (user_id, brand, model, year, engine_volume, color, mileage, is_primary, notes) 
                VALUES (:user_id, :brand, :model, :year, :engine_volume, :color, :mileage, :is_primary, :notes)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $data['user_id'],
            ':brand' => $data['brand'],
            ':model' => $data['model'],
            ':year' => $data['year'],
            ':engine_volume' => $data['engine_volume'] ?? null,
            ':color' => $data['color'] ?? '',
            ':mileage' => $data['mileage'] ?? 0,
            ':is_primary' => $data['is_primary'] ?? 0,
            ':notes' => $data['notes'] ?? ''
        ]);
    }

    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM user_bikes WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function getByUserId($user_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM user_bikes WHERE user_id = :user_id ORDER BY is_primary DESC, created_at DESC");
        $stmt->execute([':user_id' => $user_id]);
        return $stmt->fetchAll();
    }

    public function update($id, $data) {
        $sql = "UPDATE user_bikes SET 
                brand = :brand,
                model = :model,
                year = :year,
                engine_volume = :engine_volume,
                color = :color,
                mileage = :mileage,
                is_primary = :is_primary,
                notes = :notes,
                updated_at = NOW()
                WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':brand' => $data['brand'],
            ':model' => $data['model'],
            ':year' => $data['year'],
            ':engine_volume' => $data['engine_volume'] ?? null,
            ':color' => $data['color'] ?? '',
            ':mileage' => $data['mileage'] ?? 0,
            ':is_primary' => $data['is_primary'] ?? 0,
            ':notes' => $data['notes'] ?? ''
        ]);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM user_bikes WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function setPrimary($id, $user_id) {
        // Сначала убираем primary у всех мотоциклов пользователя
        $stmt1 = $this->pdo->prepare("UPDATE user_bikes SET is_primary = 0 WHERE user_id = :user_id");
        $stmt1->execute([':user_id' => $user_id]);
        
        // Затем ставим primary для выбранного
        $stmt2 = $this->pdo->prepare("UPDATE user_bikes SET is_primary = 1 WHERE id = :id AND user_id = :user_id");
        return $stmt2->execute([':id' => $id, ':user_id' => $user_id]);
    }
}
?>