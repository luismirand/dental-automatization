-- Schema initialization for Dental Clinic Automation (Agency-as-a-Service)

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
    sender_type VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
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
    status VARCHAR(30) DEFAULT 'ACCEPTED', -- 'PENDING', 'ACCEPTED', 'CANCELLED'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & rapid session lookup
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone_number);
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages(conversation_id, created_at DESC);

-- 5. Stored Procedure for Atomic Session Retrieval & Locking
-- Handles Race Conditions: Locks the conversation row for update.
CREATE OR REPLACE FUNCTION upsert_whatsapp_session(p_phone_number VARCHAR, p_full_name VARCHAR)
RETURNS TABLE (
    conversation_id UUID,
    lead_id UUID
) AS $$
DECLARE
    v_lead_id UUID;
    v_conversation_id UUID;
BEGIN
    -- 1. Upsert Lead
    INSERT INTO leads (phone_number, full_name)
    VALUES (p_phone_number, p_full_name)
    ON CONFLICT (phone_number) DO UPDATE
    SET updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO v_lead_id;

    -- 2. Find Active Conversation and lock it (FOR UPDATE)
    SELECT id INTO v_conversation_id
    FROM conversations
    WHERE conversations.lead_id = v_lead_id AND status = 'active'
    FOR UPDATE SKIP LOCKED
    LIMIT 1;

    -- 3. If no active conversation, create one
    IF v_conversation_id IS NULL THEN
        INSERT INTO conversations (lead_id)
        VALUES (v_lead_id)
        RETURNING id INTO v_conversation_id;
    END IF;

    -- 4. Update last_interaction
    UPDATE conversations
    SET last_interaction_at = CURRENT_TIMESTAMP
    WHERE id = v_conversation_id;

    RETURN QUERY SELECT v_conversation_id, v_lead_id;
END;
$$ LANGUAGE plpgsql;
