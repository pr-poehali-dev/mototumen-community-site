-- Create organizations table
CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.organizations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    logo VARCHAR(500),
    cover_image VARCHAR(500),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    working_hours VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_organizations_user_id ON t_p21120869_mototumen_community_.organizations(user_id);
CREATE INDEX idx_organizations_type ON t_p21120869_mototumen_community_.organizations(type);

-- Insert sample organization
INSERT INTO t_p21120869_mototumen_community_.organizations (user_id, name, type, description, address, phone, email, website, working_hours, rating, verified)
VALUES (
    1,
    'Мото72 - Магазин экипировки',
    'shop',
    'Крупнейший магазин мотоэкипировки в Тюмени. Официальный дилер ведущих мировых брендов.',
    'г. Тюмень, ул. Республики, 142',
    '+7 (3452) 500-100',
    'info@moto72.ru',
    'https://moto72.ru',
    'Пн-Пт: 10:00-20:00, Сб-Вс: 10:00-18:00',
    4.8,
    TRUE
);