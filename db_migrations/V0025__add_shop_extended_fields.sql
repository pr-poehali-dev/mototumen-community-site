-- Добавляем поля для карточек магазинов
ALTER TABLE shops 
  ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS working_hours TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS phones TEXT[],
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Обновляем существующие записи
UPDATE shops SET is_open = true WHERE is_open IS NULL;
UPDATE shops SET phones = ARRAY[phone] WHERE phone IS NOT NULL AND phones IS NULL;