-- Перенос пользователей с ролью admin в новую систему как administrator
INSERT INTO t_p21120869_mototumen_community_.user_roles (user_id, role_id, assigned_by)
SELECT id, 'administrator', 3
FROM t_p21120869_mototumen_community_.users
WHERE id IN (4, 5)
ON CONFLICT DO NOTHING;
