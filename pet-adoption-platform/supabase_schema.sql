-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Tables

-- users_profile (User Profile)
CREATE TABLE IF NOT EXISTS users_profile (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'publisher', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- pets (Pet Information)
CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  publisher_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'other')),
  breed VARCHAR(100),
  age_years INTEGER,
  age_months INTEGER,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),
  size VARCHAR(20) CHECK (size IN ('small', 'medium', 'large')),
  color VARCHAR(50),
  description TEXT,
  health_status TEXT,
  vaccination_status VARCHAR(50),
  sterilized BOOLEAN DEFAULT FALSE,
  location_city VARCHAR(50),
  location_province VARCHAR(50),
  adoption_requirements TEXT,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'pending', 'adopted', 'removed')),
  main_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- pet_images (Pet Photos)
CREATE TABLE IF NOT EXISTS pet_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- adoption_applications (Adoption Applications)
CREATE TABLE IF NOT EXISTS adoption_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users NOT NULL,
  publisher_id UUID REFERENCES auth.users NOT NULL,
  applicant_name VARCHAR(100) NOT NULL,
  applicant_phone VARCHAR(20) NOT NULL,
  applicant_address TEXT NOT NULL,
  applicant_city VARCHAR(50),
  applicant_province VARCHAR(50),
  living_situation TEXT,
  has_experience BOOLEAN,
  experience_details TEXT,
  has_other_pets BOOLEAN,
  other_pets_details TEXT,
  reason TEXT NOT NULL,
  additional_info TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- favorites (User Favorites)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- messages (In-app Messages)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES adoption_applications,
  subject VARCHAR(200),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Indexes
CREATE INDEX IF NOT EXISTS idx_pets_publisher ON pets(publisher_id);
CREATE INDEX IF NOT EXISTS idx_pets_status ON pets(status);
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_location ON pets(location_province, location_city);
CREATE INDEX IF NOT EXISTS idx_applications_pet ON adoption_applications(pet_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON adoption_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_publisher ON adoption_applications(publisher_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON adoption_applications(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(recipient_id, read);

-- 3. Setup Row Level Security (RLS)

-- users_profile
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users_profile FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON users_profile FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users_profile FOR UPDATE USING (auth.uid() = id);

-- pets
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available pets" ON pets FOR SELECT USING (status IN ('available', 'pending', 'adopted'));
CREATE POLICY "Publishers can view own pets" ON pets FOR SELECT USING (auth.uid() = publisher_id);
CREATE POLICY "Authenticated users can insert pets" ON pets FOR INSERT WITH CHECK (auth.uid() = publisher_id);
CREATE POLICY "Publishers can update own pets" ON pets FOR UPDATE USING (auth.uid() = publisher_id);
CREATE POLICY "Publishers can delete own pets" ON pets FOR DELETE USING (auth.uid() = publisher_id);

-- pet_images
ALTER TABLE pet_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pet images" ON pet_images FOR SELECT USING (true);
CREATE POLICY "Pet publishers can manage images" ON pet_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = pet_images.pet_id
    AND pets.publisher_id = auth.uid()
  )
);

-- adoption_applications
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own applications" ON adoption_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Publishers can view received applications" ON adoption_applications FOR SELECT USING (auth.uid() = publisher_id);
CREATE POLICY "Authenticated users can insert applications" ON adoption_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Applicants can update own pending applications" ON adoption_applications FOR UPDATE USING (auth.uid() = applicant_id AND status = 'pending');
CREATE POLICY "Publishers can review applications" ON adoption_applications FOR UPDATE USING (auth.uid() = publisher_id);

-- favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() IN (sender_id, recipient_id));
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can update messages" ON messages FOR UPDATE USING (auth.uid() = recipient_id);

-- 4. Create Storage Bucket (pet-photos)
-- Note: This requires the storage schema to be available
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pet-photos',
  'pet-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Anyone can view pet photos"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'pet-photos' );

CREATE POLICY "Authenticated users can upload pet photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pet-photos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own pet photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'pet-photos' AND
    auth.uid() = owner
  );

CREATE POLICY "Users can delete own pet photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pet-photos' AND
    auth.uid() = owner
  );
