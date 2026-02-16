-- ============================================
-- Pawtrait Pals: Complete Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. SESSIONS TABLE (for session storage)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 3. SUBSCRIPTION PLANS TABLE
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL,
  dogs_limit INTEGER,
  monthly_portrait_credits INTEGER DEFAULT 45,
  overage_price_cents INTEGER DEFAULT 400,
  trial_days INTEGER DEFAULT 0,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  billing_street TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_zip TEXT,
  billing_country TEXT,
  location_street TEXT,
  location_city TEXT,
  location_state TEXT,
  location_zip TEXT,
  location_country TEXT,
  notes TEXT,
  species_handled TEXT,
  onboarding_completed BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  owner_id VARCHAR,
  plan_id INTEGER REFERENCES subscription_plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP,
  has_used_free_trial BOOLEAN DEFAULT false NOT NULL,
  portraits_used_this_month INTEGER DEFAULT 0 NOT NULL,
  additional_pet_slots INTEGER DEFAULT 0 NOT NULL,
  pending_plan_id INTEGER,
  billing_cycle_start TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. DOGS TABLE
CREATE TABLE IF NOT EXISTS dogs (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT DEFAULT 'dog' NOT NULL,
  breed TEXT,
  age TEXT,
  description TEXT,
  original_photo_url TEXT,
  adoption_url TEXT,
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. PORTRAIT STYLES TABLE
CREATE TABLE IF NOT EXISTS portrait_styles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  preview_image_url TEXT,
  category TEXT NOT NULL
);

-- 7. PORTRAITS TABLE
CREATE TABLE IF NOT EXISTS portraits (
  id SERIAL PRIMARY KEY,
  dog_id INTEGER NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  style_id INTEGER NOT NULL REFERENCES portrait_styles(id),
  generated_image_url TEXT,
  previous_image_url TEXT,
  is_selected BOOLEAN DEFAULT false NOT NULL,
  edit_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- SEED: SUBSCRIPTION PLANS
-- ============================================
INSERT INTO subscription_plans (id, name, description, price_monthly, stripe_product_id, stripe_price_id, is_active, overage_price_cents, dogs_limit, trial_days, monthly_portrait_credits) VALUES
(5, 'Free Trial', 'Try Pawtrait Pals free for 30 days with up to 3 pets', 0, NULL, NULL, true, 0, 3, 30, 9),
(6, 'Starter', 'Perfect for small rescues with up to 15 pets.', 3900, 'prod_Tus6HKT4CmXCNe', 'price_1Sz4cNBL11m7KnKuj1rTreVC', true, 400, 15, 0, 45),
(7, 'Professional', 'Ideal for growing rescue organizations with up to 45 pets.', 7900, 'prod_Tus624pCN1AJXU', 'price_1Sz4cOBL11m7KnKuNTnrgKDk', true, 400, 45, 0, 135),
(8, 'Executive', 'Best value for large rescue networks with up to 200 pets.', 34900, 'prod_Tus6M8rz5V3CrO', 'price_1Sz4tFBL11m7KnKu3E12DPOG', true, 300, 200, 0, 600)
ON CONFLICT (id) DO NOTHING;

SELECT setval('subscription_plans_id_seq', (SELECT MAX(id) FROM subscription_plans));

-- ============================================
-- SEED: USERS
-- ============================================
INSERT INTO users (id, email, first_name, last_name, created_at, updated_at) VALUES
('44963683', 'higherliving.ca@gmail.com', NULL, NULL, '2026-02-10 20:01:16.381', '2026-02-10 20:01:16.381'),
('53940683', 'stefanie@pawtraitpals.com', 'Stefanie', 'Z', '2026-02-04 10:35:18.752', '2026-02-15 21:55:50.79'),
('54753165', 'jamihanneman@gmail.com', NULL, NULL, '2026-02-13 21:27:09.451', '2026-02-13 21:27:09.451'),
('rescue-org-test-123', 'happypaws@example.com', 'Happy', 'Paws Rescue', '2026-02-04 16:59:46.83', '2026-02-04 16:59:46.83'),
('new-rescue-LFYySN', 'newrescueHNR0e5@test.com', 'New', 'Rescue', '2026-02-04 12:10:35.15', '2026-02-04 12:10:35.15')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED: ORGANIZATIONS
-- ============================================
INSERT INTO organizations (id, name, slug, description, website_url, contact_email, owner_id, species_handled, plan_id, subscription_status, portraits_used_this_month, has_used_free_trial, onboarding_completed, additional_pet_slots, trial_ends_at, billing_cycle_start, created_at) VALUES
(1, 'Happy Tails Rescue', 'happy-tails-rescue', 'A loving rescue organization dedicated to finding forever homes for dogs in need.', 'https://happytailsrescue.org', 'Sue@happytailsrescue.com', NULL, 'dogs', 5, 'trial', 3, true, false, 0, '2026-03-06 08:29:31.261', '2026-02-04 08:29:31.261', '2026-02-04 08:29:31.261'),
(10, 'Toms Rescue Friends', 'toms-rescue-friends', 'A test rescue organization', NULL, 'tom@tomsrescuefriends.org', 'new-rescue-LFYySN', 'dogs', 5, 'trial', 3, true, false, 0, '2026-03-06 12:10:55.262', '2026-02-04 12:10:55.263', '2026-02-04 12:10:55.263'),
(11, 'Happy Paws Rescue', 'happy-paws-rescue', 'Rescue organization helping dogs find loving homes', NULL, 'Sammy@happypawsrescue.org', 'rescue-org-test-123', 'dogs', 7, 'active', 7, true, false, 0, '2026-03-06 17:00:01.629', '2026-02-04 17:00:01.63', '2026-02-04 17:00:01.63'),
(13, 'Jean''s Rescue', 'jean-s-rescue', 'cats and dogs', 'https://jeansrescue.org', 'jean@jeansrescue.org', NULL, 'both', 6, 'active', 6, true, true, 0, '2026-03-12 20:08:55.149', '2026-02-07 22:00:05.271', '2026-02-07 22:00:05.271'),
(19, 'Stacy''s Rescue', 'stacy-s-rescue', NULL, 'Stacyspals.com', 'stacy@stacysrescue.org', NULL, 'both', 5, 'trial', 6, true, false, 0, '2026-03-14 19:03:28.844', '2026-02-12 19:03:23.812', '2026-02-12 19:03:23.812'),
(20, 'CindyLou Rescue', 'cindylou-rescue', NULL, 'https://cindylourescue.org', 'cindy@cindylourescue.org', NULL, 'dogs', 6, 'active', 0, false, false, 0, NULL, '2026-02-13 05:51:37.81', '2026-02-13 05:51:37.81'),
(21, 'Jami''s Rescue 12', 'jami-s-rescue-12', 'Lalalalalalala', 'Http:/www.rescue12.com', 'info@recue12.com', '54753165', 'dogs', 5, 'trial', 4, true, true, 0, '2026-03-15 21:30:14.204', '2026-02-13 21:29:26.997', '2026-02-13 21:29:26.997')
ON CONFLICT (id) DO NOTHING;

SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations));

-- ============================================
-- SEED: DOGS (without images - imported later)
-- ============================================
INSERT INTO dogs (id, name, breed, age, description, organization_id, species, adoption_url, created_at) VALUES
(1, 'Buddy', 'Bichon Frise Mix', '6 years', 'Buddy is a friendly and gentle soul who loves everyone he meets. He enjoys long walks, belly rubs, and playing fetch. He''s great with kids and other dogs!', 1, 'dog', 'https://happytailsrescue.org/dogs/buddy', '2026-02-04 08:29:31.322'),
(3, 'Lightening Bolt', 'Greyhound', '8 years', 'Lightening Bolt is a loyal and intelligent companion. He''s well-trained, knows several commands, and is protective of his family. He does best as the only pet.', 1, 'dog', 'https://happytailsrescue.org/dogs/max', '2026-02-04 08:29:31.328'),
(5, 'Rottie-Boy', 'Rottweiler', '2 years', 'Rottie-Boy is a calm and cuddly senior who just wants a cozy spot on the couch and someone to love. He''s perfect for a quieter home.', 1, 'dog', 'https://happytailsrescue.org/dogs/charlie', '2026-02-04 08:29:31.334'),
(8, 'Sonny', 'Labrador Retriever', '2 years', 'Friendly test dog for automated test.', 10, 'dog', 'https://example.org/dogs/testdog', '2026-02-04 12:12:33.451'),
(9, 'Bella the Brave', 'Shih Tzu Mix', '3 years', 'Sweet and loyal', 11, 'dog', 'https://example.com/adopt/bella', '2026-02-04 17:01:07.993'),
(10, 'Max the Magnificent', 'Poodle-Mix', '4 years', 'Friendly and playful', 11, 'dog', 'https://example.com/adopt/max', '2026-02-04 17:01:07.993'),
(11, 'Sydney the great', 'Irish Setter', '3', '', 11, 'dog', NULL, '2026-02-07 21:53:38.198'),
(14, 'Irene', 'Persian', '3', 'Irene loves cuddling on laps and long naps', 13, 'cat', 'https://jeansrescue.com/irene', '2026-02-09 00:19:07.921'),
(15, 'Baby', 'American Shorthair', '14', 'He is a very sweet boy who loves to cuddle and play with his toys. Affectionate with people, but does not play well with others.', 13, 'cat', 'https://jeansrescue.com/baby', '2026-02-09 01:30:59.337'),
(16, 'Buddy', 'Bichon Frise Mix', '8', 'Boundless energy - still loves to play catch. This senior just needs the right family to come home to...', 13, 'dog', 'https://jeansrescue.com/buddy', '2026-02-10 03:22:09.127'),
(18, 'Albus Dumbledog', 'American Eskimo Dog', '8', 'Mischievous, Loves his treats, loves his alone time, Great with families, although no small kids or other pets', 19, 'dog', NULL, '2026-02-12 19:20:30.933'),
(19, 'Oscar the Wise Kitty', 'American Curl', '4', 'Oscar is pensive, quiet as a church mouse and loves his person''s lap. What a great friend to bring home', 19, 'cat', NULL, '2026-02-13 04:39:45.095'),
(20, 'T', 'Mixed Breed', NULL, '', 21, 'dog', NULL, '2026-02-13 21:34:48.612'),
(21, 'Chocko the Lab-Pitt Puppy', 'Labrador Retriever Mix', '7 weeks', 'Chocko was one of a litter of 7 puppies that has been at the shelter for 2 weeks...', 11, 'dog', NULL, '2026-02-15 22:03:14.629')
ON CONFLICT (id) DO NOTHING;

SELECT setval('dogs_id_seq', (SELECT MAX(id) FROM dogs));

-- ============================================
-- NOTE: Portrait styles are auto-seeded by the application on startup.
-- Portraits will be seeded after the app runs and creates the styles.
-- Images are imported separately after deployment.
-- ============================================

-- Done! Your database schema and core data are ready.
