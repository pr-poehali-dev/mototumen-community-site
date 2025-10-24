CREATE TABLE IF NOT EXISTS security_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  ip_address VARCHAR(45),
  user_id INTEGER,
  endpoint VARCHAR(255),
  method VARCHAR(10),
  details JSONB,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);

COMMENT ON TABLE security_logs IS 'Логи безопасности и попыток взлома';
COMMENT ON COLUMN security_logs.event_type IS 'Тип события: rate_limit, auth_failed, invalid_token, suspicious_activity, xss_attempt, sql_injection';
COMMENT ON COLUMN security_logs.severity IS 'Уровень угрозы: low, medium, high, critical';
