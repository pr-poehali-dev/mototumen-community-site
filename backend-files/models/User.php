<?php
class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $sql = "INSERT INTO users (telegram_id, username, first_name, last_name, phone, email, bio, avatar_url, experience, location, is_active) 
                VALUES (:telegram_id, :username, :first_name, :last_name, :phone, :email, :bio, :avatar_url, :experience, :location, :is_active)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':telegram_id' => $data['telegram_id'] ?? null,
            ':username' => $data['username'],
            ':first_name' => $data['first_name'] ?? '',
            ':last_name' => $data['last_name'] ?? '',
            ':phone' => $data['phone'] ?? '',
            ':email' => $data['email'],
            ':bio' => $data['bio'] ?? '',
            ':avatar_url' => $data['avatar_url'] ?? '',
            ':experience' => $data['experience'] ?? 'новичок',
            ':location' => $data['location'] ?? '',
            ':is_active' => $data['is_active'] ?? 1
        ]);
    }

    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function getByTelegramId($telegram_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE telegram_id = :telegram_id");
        $stmt->execute([':telegram_id' => $telegram_id]);
        return $stmt->fetch();
    }

    public function update($id, $data) {
        $sql = "UPDATE users SET 
                telegram_id = :telegram_id,
                username = :username,
                first_name = :first_name,
                last_name = :last_name,
                phone = :phone,
                email = :email,
                bio = :bio,
                avatar_url = :avatar_url,
                experience = :experience,
                location = :location,
                is_active = :is_active,
                updated_at = NOW()
                WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':telegram_id' => $data['telegram_id'] ?? null,
            ':username' => $data['username'],
            ':first_name' => $data['first_name'] ?? '',
            ':last_name' => $data['last_name'] ?? '',
            ':phone' => $data['phone'] ?? '',
            ':email' => $data['email'],
            ':bio' => $data['bio'] ?? '',
            ':avatar_url' => $data['avatar_url'] ?? '',
            ':experience' => $data['experience'] ?? 'новичок',
            ':location' => $data['location'] ?? '',
            ':is_active' => $data['is_active'] ?? 1
        ]);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getAll($limit = 50, $offset = 0) {
        $stmt = $this->pdo->prepare("SELECT * FROM users LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>