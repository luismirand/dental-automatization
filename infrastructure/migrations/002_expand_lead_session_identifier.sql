-- WebChat uses the existing lead lookup key for opaque browser session IDs.
-- UUID-like identifiers exceed the original 20-character phone-number limit.
ALTER TABLE leads
    ALTER COLUMN phone_number TYPE VARCHAR(128);
