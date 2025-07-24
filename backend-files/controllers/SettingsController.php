<?php
require_once __DIR__.'/../models/UserSettings.php';

class SettingsController {
    private $settingsModel;

    public function __construct($pdo) {
        $this->settingsModel = new UserSettings($pdo);
    }

    public function getSettings($userId) {
        try {
            $settings = $this->settingsModel->getByUserId($userId);
            return $settings;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при получении настроек'];
        }
    }

    public function updateSettings($userId, $request) {
        try {
            $result = $this->settingsModel->update($userId, $request);
            if ($result) {
                return ['status' => 'success', 'message' => 'Настройки обновлены'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при обновлении настроек'];
        }
    }

    public function updateSetting($userId, $key, $value) {
        try {
            $result = $this->settingsModel->updateSetting($userId, $key, $value);
            if ($result) {
                return ['status' => 'success', 'message' => 'Настройка обновлена'];
            } else {
                http_response_code(400);
                return ['error' => 'Некорректный ключ настройки'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при обновлении настройки'];
        }
    }

    public function toggleNotifications($userId) {
        try {
            $settings = $this->settingsModel->getByUserId($userId);
            $newValue = $settings['notifications_enabled'] ? 0 : 1;
            
            $result = $this->settingsModel->updateSetting($userId, 'notifications_enabled', $newValue);
            if ($result) {
                $status = $newValue ? 'включены' : 'отключены';
                return ['status' => 'success', 'message' => "Уведомления $status"];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при переключении уведомлений'];
        }
    }

    public function setTheme($userId, $theme) {
        $validThemes = ['light', 'dark', 'auto'];
        if (!in_array($theme, $validThemes)) {
            http_response_code(400);
            return ['error' => 'Некорректная тема. Доступны: light, dark, auto'];
        }

        try {
            $result = $this->settingsModel->updateSetting($userId, 'theme', $theme);
            if ($result) {
                return ['status' => 'success', 'message' => 'Тема обновлена'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при смене темы'];
        }
    }

    public function setLanguage($userId, $language) {
        $validLanguages = ['ru', 'en', 'uk'];
        if (!in_array($language, $validLanguages)) {
            http_response_code(400);
            return ['error' => 'Некорректный язык. Доступны: ru, en, uk'];
        }

        try {
            $result = $this->settingsModel->updateSetting($userId, 'language', $language);
            if ($result) {
                return ['status' => 'success', 'message' => 'Язык обновлен'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при смене языка'];
        }
    }

    public function setPrivacyLevel($userId, $privacyLevel) {
        $validLevels = ['public', 'friends', 'private'];
        if (!in_array($privacyLevel, $validLevels)) {
            http_response_code(400);
            return ['error' => 'Некорректный уровень приватности. Доступны: public, friends, private'];
        }

        try {
            $result = $this->settingsModel->updateSetting($userId, 'privacy_level', $privacyLevel);
            if ($result) {
                return ['status' => 'success', 'message' => 'Уровень приватности обновлен'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при изменении приватности'];
        }
    }

    public function resetSettings($userId) {
        try {
            // Удаляем текущие настройки
            $this->settingsModel->delete($userId);
            
            // Создаем дефолтные
            $result = $this->settingsModel->create(['user_id' => $userId]);
            if ($result) {
                return ['status' => 'success', 'message' => 'Настройки сброшены к значениям по умолчанию'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при сбросе настроек'];
        }
    }

    public function getTheme($userId) {
        try {
            $theme = $this->settingsModel->getTheme($userId);
            return ['theme' => $theme];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при получении темы'];
        }
    }

    public function getLanguage($userId) {
        try {
            $language = $this->settingsModel->getLanguage($userId);
            return ['language' => $language];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Ошибка при получении языка'];
        }
    }
}
?>