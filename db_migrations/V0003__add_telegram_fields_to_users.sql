ALTER TABLE users 
ADD COLUMN telegram_id BIGINT UNIQUE,
ADD COLUMN username VARCHAR(255),
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);