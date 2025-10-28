CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

INSERT INTO t_p21120869_mototumen_community_.achievements (name, description, category, icon) VALUES
('Первый друг', 'Добавьте первого друга', 'social', 'Users'),
('Популярный', 'Наберите 10 друзей', 'social', 'UsersRound'),
('Звезда сообщества', 'Наберите 50 друзей', 'social', 'Star'),
('Первая техника', 'Добавьте первую технику в гараж', 'garage', 'Car'),
('Коллекционер', 'Добавьте 5 единиц техники', 'garage', 'Warehouse'),
('Автопарк', 'Добавьте 10 единиц техники', 'garage', 'Truck'),
('Исследователь', 'Посетите все разделы платформы', 'activity', 'Compass'),
('Активист', 'Зайдите на платформу 30 дней подряд', 'activity', 'Calendar'),
('Ветеран', 'Будьте с нами 1 год', 'time', 'Award'),
('Старожил', 'Будьте с нами 3 года', 'time', 'Crown');

INSERT INTO t_p21120869_mototumen_community_.badges (name, description, category, image_url) VALUES
('Организатор', 'За организацию мероприятий', 'event', ''),
('Помощник', 'За помощь сообществу', 'community', ''),
('Эксперт', 'За вклад в развитие', 'expert', ''),
('Модератор', 'Модератор платформы', 'role', ''),
('Проверенный', 'Проверенный участник', 'verified', '');