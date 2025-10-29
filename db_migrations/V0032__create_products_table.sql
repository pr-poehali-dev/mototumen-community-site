-- Создание таблицы для товаров магазина
CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    in_stock BOOLEAN DEFAULT true,
    brand VARCHAR(100),
    model VARCHAR(100),
    shop_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_products_category ON t_p21120869_mototumen_community_.products(category);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON t_p21120869_mototumen_community_.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON t_p21120869_mototumen_community_.products(in_stock);

-- Вставка демо-данных
INSERT INTO t_p21120869_mototumen_community_.products (name, description, price, image_url, category, in_stock, brand, model) VALUES
('Масло моторное 10W-40', 'Синтетическое масло для 4-тактных двигателей', 2500.00, 'https://cdn.poehali.dev/files/placeholder-oil.jpg', 'Масла и смазки', true, 'Motul', '7100 4T'),
('Тормозные колодки передние', 'Высокопроизводительные керамические колодки', 4200.00, 'https://cdn.poehali.dev/files/placeholder-brake.jpg', 'Тормозная система', true, 'Brembo', 'Carbon Ceramic'),
('Цепь приводная 520', 'Усиленная цепь для спортивных мотоциклов', 3500.00, 'https://cdn.poehali.dev/files/placeholder-chain.jpg', 'Трансмиссия', true, 'DID', 'ERV3'),
('Шлем интеграл', 'Профессиональный шлем с солнцезащитным визором', 15000.00, 'https://cdn.poehali.dev/files/placeholder-helmet.jpg', 'Экипировка', true, 'AGV', 'K6'),
('Перчатки кожаные', 'Спортивные перчатки с карбоновой защитой', 6500.00, 'https://cdn.poehali.dev/files/placeholder-gloves.jpg', 'Экипировка', true, 'Dainese', 'Full Metal 6'),
('Фильтр воздушный', 'Многоразовый воздушный фильтр', 1200.00, 'https://cdn.poehali.dev/files/placeholder-filter.jpg', 'Система впуска', true, 'K&N', 'HA-1003'),
('Аккумулятор 12V 9Ah', 'Гелевый аккумулятор необслуживаемый', 2800.00, 'https://cdn.poehali.dev/files/placeholder-battery.jpg', 'Электрика', false, 'Yuasa', 'YTX9-BS'),
('Свечи зажигания', 'Иридиевые свечи (комплект 4 шт)', 1500.00, 'https://cdn.poehali.dev/files/placeholder-spark.jpg', 'Электрика', true, 'NGK', 'LKAR8AI-9');