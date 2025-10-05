ALTER TABLE user_vehicles ALTER COLUMN photo_url TYPE TEXT;
UPDATE user_vehicles SET photo_url = CASE WHEN photo_url IS NOT NULL AND photo_url != '' THEN '["' || photo_url || '"]' ELSE '[]' END;