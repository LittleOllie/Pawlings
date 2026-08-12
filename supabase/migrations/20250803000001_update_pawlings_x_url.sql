-- Set official Pawlings X account (https://x.com/Pawlings_)
UPDATE site_settings
SET x_url = 'https://x.com/Pawlings_'
WHERE x_url = 'https://x.com/example' OR x_url = '';

ALTER TABLE site_settings
  ALTER COLUMN x_url SET DEFAULT 'https://x.com/Pawlings_';
