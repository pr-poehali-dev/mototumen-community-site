-- Таблица для продавцов магазина
CREATE TABLE IF NOT EXISTS store_sellers (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    telegram_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'seller' CHECK (role IN ('ceo', 'seller')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_by TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по user_id
CREATE INDEX idx_store_sellers_user_id ON store_sellers(user_id);
CREATE INDEX idx_store_sellers_telegram_id ON store_sellers(telegram_id);

-- Вставляем CEO (твой аккаунт)
INSERT INTO store_sellers (user_id, telegram_id, full_name, role, is_active) 
VALUES ('573967828', '573967828', 'Anton', 'ceo', true)
ON CONFLICT (user_id) DO NOTHING;