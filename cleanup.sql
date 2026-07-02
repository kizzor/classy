-- =====================================================
-- CLASSY APP: Development Data Cleanup for Production Testing
-- Target: Supabase PostgreSQL (public schema)
-- =====================================================
-- Column names use snake_case per PostgreSQL conventions
-- Maps to TypeScript types: Listing, ChatMessage

-- =====================================================
-- 1. TRUNCATE ALL USER-CREATED TABLES
-- =====================================================
-- CASCADE ensures foreign key dependencies are handled

TRUNCATE TABLE listings CASCADE;
TRUNCATE TABLE chat_messages CASCADE;

-- =====================================================
-- 2. RESET IDENTITY SEQUENCES
-- =====================================================
-- Ensures next INSERT starts from id = 1

ALTER TABLE listings RESTART IDENTITY;
ALTER TABLE chat_messages RESTART IDENTITY;

-- =====================================================
-- 3. VERIFY DATABASE STATE
-- =====================================================
-- Run these to confirm tables are empty

SELECT 'listings' as table_name, COUNT(*) as row_count FROM listings
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages;

-- =====================================================
-- 4. INSERT TEMPLATE: Add a Real Test Product
-- =====================================================
-- Columns match the Listing interface (snake_case for PostgreSQL)
-- title, description, price, location, date, image_url, category, seller_id, seller_name

INSERT INTO listings (
    title,
    description,
    price,
    location,
    date,
    image_url,
    category,
    seller_id,
    seller_name
) VALUES (
    'Your Product Title Here',
    'Detailed description of your product. Include condition, features, and any relevant details.',
    9999,                              -- Price in INR
    'Your City, State',                -- Location
    NOW()::text,                       -- Auto-set to current time
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
    'Electronics',                     -- Categories: Electronics | Furniture | Sports & Outdoors | Fashion
    'seller_yourname',                 -- Your seller ID
    'Your Name'                        -- Your display name
);

-- =====================================================
-- 5. INSERT TEMPLATE: Add a Chat Message
-- =====================================================
-- Columns match the ChatMessage interface

INSERT INTO chat_messages (
    sender_id,
    sender_name,
    recipient_id,
    product_id,
    product_title,
    text,
    timestamp
) VALUES (
    'seller_sender',
    'Sender Name',
    'seller_recipient',
    '1',                               -- Product ID (match an existing listing)
    'Product Title',
    'Hello! Is this still available?',
    NOW()::text
);

-- =====================================================
-- 6. VERIFY INSERTS WORKED
-- =====================================================

SELECT id, title, price, category, seller_name 
FROM listings 
ORDER BY id DESC 
LIMIT 5;

SELECT id, sender_name, text, timestamp 
FROM chat_messages 
ORDER BY id DESC 
LIMIT 5;
