-- SUPABASE SCHEMA SQL: Table locations
-- Generated Column search_all included for optimized searching

-- Enable pg_trgm for advanced text search performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    radius_meters INTEGER DEFAULT 100, -- Geofencing tolerance in meters
    photo_drive_id TEXT, -- Google Drive File ID reference
    is_active BOOLEAN DEFAULT true,
    
    -- Audit Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,

    -- KOLOM SEARCH ALL (MANDATORY)
    -- Generated column combining name and address for single-column search
    search_all TEXT GENERATED ALWAYS AS (
        lower(name || ' ' || coalesce(address, ''))
    ) STORED
);

-- Indexing for high-performance searching on 500+ records
CREATE INDEX IF NOT EXISTS idx_locations_search_all ON locations USING gin (search_all gin_trgm_ops);

-- Trigger to auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_locations_updated_at ON locations;
CREATE TRIGGER tr_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();