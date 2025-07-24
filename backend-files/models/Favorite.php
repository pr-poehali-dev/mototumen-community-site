<?php
class Favorite {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        // Проверяем, не существует ли уже такая запись
        if ($this->exists($data['user_id'], $data['item_type'], $data['item_id'])) {
            return false; // Уже в избранном
        }

        $sql = "INSERT INTO favorites (user_id, item_type, item_id, notes) 
                VALUES (:user_id, :item_type, :item_id, :notes)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $data['user_id'],
            ':item_type' => $data['item_type'],
            ':item_id' => $data['item_id'],
            ':notes' => $data['notes'] ?? ''
        ]);
    }

    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM favorites WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function getByUserId($user_id, $item_type = null) {
        if ($item_type) {
            $stmt = $this->pdo->prepare("
                SELECT * FROM favorites 
                WHERE user_id = :user_id AND item_type = :item_type 
                ORDER BY created_at DESC
            ");
            $stmt->execute([':user_id' => $user_id, ':item_type' => $item_type]);
        } else {
            $stmt = $this->pdo->prepare("
                SELECT * FROM favorites 
                WHERE user_id = :user_id 
                ORDER BY created_at DESC
            ");
            $stmt->execute([':user_id' => $user_id]);
        }
        return $stmt->fetchAll();
    }

    public function exists($user_id, $item_type, $item_id) {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) as count FROM favorites 
            WHERE user_id = :user_id AND item_type = :item_type AND item_id = :item_id
        ");
        $stmt->execute([
            ':user_id' => $user_id,
            ':item_type' => $item_type,
            ':item_id' => $item_id
        ]);
        $result = $stmt->fetch();
        return $result['count'] > 0;
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM favorites WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function deleteByItem($user_id, $item_type, $item_id) {
        $stmt = $this->pdo->prepare("
            DELETE FROM favorites 
            WHERE user_id = :user_id AND item_type = :item_type AND item_id = :item_id
        ");
        return $stmt->execute([
            ':user_id' => $user_id,
            ':item_type' => $item_type,
            ':item_id' => $item_id
        ]);
    }

    public function updateNotes($id, $notes) {
        $stmt = $this->pdo->prepare("UPDATE favorites SET notes = :notes, updated_at = NOW() WHERE id = :id");
        return $stmt->execute([':id' => $id, ':notes' => $notes]);
    }

    public function toggle($user_id, $item_type, $item_id, $notes = '') {
        if ($this->exists($user_id, $item_type, $item_id)) {
            $this->deleteByItem($user_id, $item_type, $item_id);
            return ['action' => 'removed', 'status' => 'success'];
        } else {
            $result = $this->create([
                'user_id' => $user_id,
                'item_type' => $item_type,
                'item_id' => $item_id,
                'notes' => $notes
            ]);
            return $result ? ['action' => 'added', 'status' => 'success'] : ['action' => 'failed', 'status' => 'error'];
        }
    }

    public function getCount($user_id, $item_type = null) {
        if ($item_type) {
            $stmt = $this->pdo->prepare("SELECT COUNT(*) as count FROM favorites WHERE user_id = :user_id AND item_type = :item_type");
            $stmt->execute([':user_id' => $user_id, ':item_type' => $item_type]);
        } else {
            $stmt = $this->pdo->prepare("SELECT COUNT(*) as count FROM favorites WHERE user_id = :user_id");
            $stmt->execute([':user_id' => $user_id]);
        }
        $result = $stmt->fetch();
        return $result['count'];
    }
}
?>