UPDATE user_profiles 
SET telegram = (SELECT username FROM users WHERE users.id = user_profiles.user_id) 
WHERE user_id IN (SELECT id FROM users WHERE telegram_id IS NOT NULL AND username IS NOT NULL);