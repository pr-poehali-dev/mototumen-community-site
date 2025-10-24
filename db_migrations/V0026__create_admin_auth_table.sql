CREATE TABLE IF NOT EXISTS admin_auth (
  id SERIAL PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_auth_id ON admin_auth(id);

COMMENT ON TABLE admin_auth IS 'Хранение хэша пароля администратора';
COMMENT ON COLUMN admin_auth.password_hash IS 'BCrypt хэш пароля администратора';
