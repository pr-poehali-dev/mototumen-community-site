<?php
class UserSettings {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($data) {
        $sql = "INSERT INTO user_settings (user_id, notifications_enabled, email_notifications, sms_notifications, language, theme, privacy_level) 
                VALUES (:user_id, :notifications_enabled, :email_notifications, :sms_notifications, :language, :theme, :privacy_level)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $data['user_id'],
            ':notifications_enabled' => $data['notifications_enabled'] ?? 1,
            ':email_notifications' => $data['email_notifications'] ?? 1,
            ':sms_notifications' => $data['sms_notifications'] ?? 0,
            ':language' => $data['language'] ?? 'ru',
            ':theme' => $data['theme'] ?? 'light',
            ':privacy_level' => $data['privacy_level'] ?? 'public'
        ]);
    }

    public function getByUserId($user_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM user_settings WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $user_id]);
        $settings = $stmt->fetch();
        
        // Если настроек нет, создаем дефолтные
        if (!$settings) {
            $this->create(['user_id' => $user_id]);
            return $this->getByUserId($user_id);
        }
        
        return $settings;
    }

    public function update($user_id, $data) {
        // Сначала проверяем, есть ли настройки
        $existing = $this->getByUserId($user_id);
        if (!$existing) {
            $data['user_id'] = $user_id;
            return $this->create($data);
        }

        $sql = "UPDATE user_settings SET 
                notifications_enabled = :notifications_enabled,
                email_notifications = :email_notifications,
                sms_notifications = :sms_notifications,
                language = :language,
                theme = :theme,
                privacy_level = :privacy_level,
                updated_at = NOW()
                WHERE user_id = :user_id";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $user_id,
            ':notifications_enabled' => $data['notifications_enabled'] ?? 1,
            ':email_notifications' => $data['email_notifications'] ?? 1,
            ':sms_notifications' => $data['sms_notifications'] ?? 0,
            ':language' => $data['language'] ?? 'ru',
            ':theme' => $data['theme'] ?? 'light',
            ':privacy_level' => $data['privacy_level'] ?? 'public'
        ]);
    }

    public function updateSetting($user_id, $key, $value) {
        $validKeys = ['notifications_enabled', 'email_notifications', 'sms_notifications', 'language', 'theme', 'privacy_level'];
        
        if (!in_array($key, $validKeys)) {
            return false;
        }

        $sql = "UPDATE user_settings SET {$key} = :value, updated_at = NOW() WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':user_id' => $user_id, ':value' => $value]);
    }

    public function delete($user_id) {
        $stmt = $this->pdo->prepare("DELETE FROM user_settings WHERE user_id = :user_id");
        return $stmt->execute([':user_id' => $user_id]);
    }

    public function getTheme($user_id) {
        $stmt = $this->pdo->prepare("SELECT theme FROM user_settings WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $user_id]);
        $result = $stmt->fetch();
        return $result ? $result['theme'] : 'light';
    }

    public function getLanguage($user_id) {
        $stmt = $this->pdo->prepare("SELECT language FROM user_settings WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $user_id]);
        $result = $stmt->fetch();
        return $result ? $result['language'] : 'ru';
    }
}
?>