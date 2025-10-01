-- Убираем админку у всех
UPDATE users SET role = 'user';

-- Даем Антону админку
UPDATE users SET role = 'admin' WHERE telegram_id = 5739678128;