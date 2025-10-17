-- Добавляем индексы для быстрого поиска ролей и разрешений пользователя
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON t_p21120869_mototumen_community_.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON t_p21120869_mototumen_community_.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON t_p21120869_mototumen_community_.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission ON t_p21120869_mototumen_community_.user_permissions(permission);

-- Добавляем уникальное ограничение для предотвращения дублирования ролей
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_unique ON t_p21120869_mototumen_community_.user_roles(user_id, role_id);

-- Добавляем уникальное ограничение для предотвращения дублирования разрешений
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_permissions_unique ON t_p21120869_mototumen_community_.user_permissions(user_id, permission);

-- Добавляем индекс для истории активности
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON t_p21120869_mototumen_community_.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON t_p21120869_mototumen_community_.user_activity_log(created_at DESC);

-- Добавляем составной индекс для быстрого поиска активности конкретного пользователя по дате
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_date ON t_p21120869_mototumen_community_.user_activity_log(user_id, created_at DESC);
