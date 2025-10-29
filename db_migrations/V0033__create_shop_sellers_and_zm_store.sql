-- Создаем таблицу продавцов магазинов
CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.shop_sellers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p21120869_mototumen_community_.users(id),
    shop_id INTEGER NOT NULL REFERENCES t_p21120869_mototumen_community_.shops(id),
    assigned_by INTEGER NOT NULL REFERENCES t_p21120869_mototumen_community_.users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, shop_id)
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_shop_sellers_user ON t_p21120869_mototumen_community_.shop_sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_sellers_shop ON t_p21120869_mototumen_community_.shop_sellers(shop_id);

-- Создаем магазин ZM Store
INSERT INTO t_p21120869_mototumen_community_.shops (name, description, category, rating, is_open)
VALUES (
    'ZM Store',
    'Магазин мотозапчастей и аксессуаров',
    'Запчасти',
    5.0,
    true
) ON CONFLICT DO NOTHING;