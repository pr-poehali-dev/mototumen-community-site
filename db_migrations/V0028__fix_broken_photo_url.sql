-- Fix broken photo_url in user_vehicles
UPDATE t_p21120869_mototumen_community_.user_vehicles SET photo_url = '[]' WHERE id = 5;