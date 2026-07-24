# Database Schema Specification (PostgreSQL)

## Database Model

The database holds persistent leads information, session state for WhatsApp conversations, chat message history, and appointment metadata.

```sql
-- Schema overview for Dental Clinic Automation

-- 1. Table: leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: conversations (Session State)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    channel VARCHAR(20) DEFAULT 'whatsapp',
    status VARCHAR(30) DEFAULT 'active', -- 'active', 'handover_to_human', 'closed'
    current_intent VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb,
    last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: chat_messages (Context History)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system', 'agent'
    message_text TEXT NOT NULL,
    tokens_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    cal_booking_id VARCHAR(100) UNIQUE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) DEFAULT 'ACCEPTED', -- 'PENDING', 'ACCEPTED', 'CANCELLED', 'RESCHEDULED'
    notes TEXT,
    -- Classification fields (added in migration 001)
    appointment_type VARCHAR(60),  -- 'valoracion_inicial' | 'limpieza' | 'ortodoncia' | 'implante' | 'diseno_sonrisa' | 'urgencia' | 'otro'
    patient_name VARCHAR(120),     -- who attends (may differ from lead)
    patient_email VARCHAR(120),
    patient_phone VARCHAR(30),
    reason_for_visit TEXT,
    is_first_visit BOOLEAN DEFAULT TRUE,
    channel VARCHAR(20) DEFAULT 'cal',  -- 'cal' | 'bot_whatsapp' | 'bot_webchat' | 'bot_telegram'
    cal_event_type_id INTEGER,
    reschedule_count SMALLINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & rapid session lookup
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone_number);
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages(conversation_id, created_at DESC);
```

## Anti-Race Condition & Session Lock Strategy
To avoid WhatsApp multi-message race conditions (where multiple messages sent within milliseconds trigger parallel workflows), n8n workflow must acquire a row-level lock or session lock using `SELECT ... FOR UPDATE` or an atomic timestamp check on `conversations` before processing LLM responses.
