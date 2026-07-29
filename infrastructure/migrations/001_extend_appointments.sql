-- ============================================================
-- Migration: 001_extend_appointments.sql
-- Extends the appointments table with classification fields
-- captured from Cal.com booking questions and bot pre-qualification
-- ============================================================

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS appointment_type    VARCHAR(60),
    -- Values: 'valoracion_inicial', 'limpieza', 'ortodoncia',
    --         'implante', 'diseno_sonrisa', 'urgencia', 'otro'

  ADD COLUMN IF NOT EXISTS patient_name        VARCHAR(120),
    -- Name of who will attend (may differ from the person who books)

  ADD COLUMN IF NOT EXISTS patient_email       VARCHAR(120),

  ADD COLUMN IF NOT EXISTS patient_phone       VARCHAR(30),

  ADD COLUMN IF NOT EXISTS reason_for_visit    TEXT,
    -- Free-text from the booking question "Motivo de consulta"

  ADD COLUMN IF NOT EXISTS is_first_visit      BOOLEAN DEFAULT TRUE,

  ADD COLUMN IF NOT EXISTS channel             VARCHAR(20) DEFAULT 'cal',
    -- Source channel: 'cal', 'bot_whatsapp', 'bot_webchat', 'bot_telegram'

  ADD COLUMN IF NOT EXISTS cal_event_type_id   INTEGER,
    -- Cal.com eventTypeId for future API filtering

  ADD COLUMN IF NOT EXISTS reschedule_count    SMALLINT DEFAULT 0;
    -- Incremented each time the booking is rescheduled

-- Index for appointment type queries (e.g., "show all urgencias today")
CREATE INDEX IF NOT EXISTS idx_appointments_type
  ON appointments(appointment_type);

-- Index for channel analytics
CREATE INDEX IF NOT EXISTS idx_appointments_channel
  ON appointments(channel);

-- ============================================================
-- After running this migration, register the Cal.com production webhook:
--   URL: https://<your-n8n-host>/webhook/calcom-booking
--   Events: BOOKING_CREATED, BOOKING_CANCELLED, BOOKING_RESCHEDULED
-- ============================================================
