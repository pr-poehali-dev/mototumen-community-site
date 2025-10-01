ALTER TABLE users 
ADD COLUMN role VARCHAR(50) DEFAULT 'user';

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

UPDATE users SET role = 'admin' WHERE id = 1;