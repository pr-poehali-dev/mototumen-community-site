-- Таблица истории действий пользователей
CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.user_activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p21120869_mototumen_community_.users(id),
    action VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по пользователю и дате
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON t_p21120869_mototumen_community_.user_activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON t_p21120869_mototumen_community_.user_activity_log(created_at DESC);

-- Комментарий к таблице
COMMENT ON TABLE t_p21120869_mototumen_community_.user_activity_log IS 'Журнал действий пользователей на сайте';
COMMENT ON COLUMN t_p21120869_mototumen_community_.user_activity_log.action IS 'Тип действия (авторизация, создание поста, редактирование и т.д.)';
COMMENT ON COLUMN t_p21120869_mototumen_community_.user_activity_log.location IS 'Место действия (страница, раздел сайта)';
