-- Устанавливаем Anton как CEO
UPDATE t_p21120869_mototumen_community_.users 
SET role = 'ceo' 
WHERE first_name = 'Anton' AND id = 3;

-- Добавляем роль CEO в таблицу user_roles для Anton
INSERT INTO t_p21120869_mototumen_community_.user_roles (user_id, role_id, assigned_by)
VALUES (3, 'ceo', 3)
ON CONFLICT (user_id, role_id) DO NOTHING;
