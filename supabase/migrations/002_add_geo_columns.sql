-- Add latitude/longitude columns for geolocation support
ALTER TABLE listings ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Add created_at timestamp for reliable sorting (date TEXT is "Just now" etc.)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for sorting by creation time
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
