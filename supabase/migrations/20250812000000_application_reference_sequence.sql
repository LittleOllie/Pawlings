-- Sequential adoption reference codes: PAW-0001, PAW-0002, ...

CREATE SEQUENCE IF NOT EXISTS application_reference_seq START WITH 1 INCREMENT BY 1;

-- Align sequence with any existing PAW-#### codes
SELECT setval(
  'application_reference_seq',
  GREATEST(
    1,
    COALESCE((
      SELECT MAX((regexp_replace(reference_code, '^PAW-', ''))::integer)
      FROM applications
      WHERE reference_code ~ '^PAW-[0-9]+$'
    ), 0)
  ),
  true
);

CREATE OR REPLACE FUNCTION next_application_reference_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_val BIGINT;
BEGIN
  seq_val := nextval('application_reference_seq');
  RETURN 'PAW-' || lpad(seq_val::text, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION peek_application_reference_code()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_val BIGINT;
BEGIN
  SELECT last_value + CASE WHEN is_called THEN 1 ELSE 0 END
  INTO seq_val
  FROM application_reference_seq;
  RETURN 'PAW-' || lpad(seq_val::text, 4, '0');
END;
$$;
