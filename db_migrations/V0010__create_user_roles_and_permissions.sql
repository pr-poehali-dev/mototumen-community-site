-- Таблица ролей пользователей
CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p21120869_mototumen_community_.users(id),
    role_id VARCHAR(50) NOT NULL,
    assigned_by INTEGER REFERENCES t_p21120869_mototumen_community_.users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- Таблица дополнительных разрешений пользователей (для CEO)
CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p21120869_mototumen_community_.users(id),
    permission VARCHAR(50) NOT NULL,
    granted_by INTEGER REFERENCES t_p21120869_mototumen_community_.users(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, permission)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON t_p21120869_mototumen_community_.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON t_p21120869_mototumen_community_.user_permissions(user_id);

-- Комментарии к таблицам
COMMENT ON TABLE t_p21120869_mototumen_community_.user_roles IS 'Роли пользователей (CEO, администратор, модератор и т.д.)';
COMMENT ON TABLE t_p21120869_mototumen_community_.user_permissions IS 'Дополнительные разрешения для пользователей (только CEO может выдавать)';
