CREATE TABLE IF NOT EXISTS t_p21120869_mototumen_community_.password_reset_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_user ON t_p21120869_mototumen_community_.password_reset_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_status ON t_p21120869_mototumen_community_.password_reset_requests(status);