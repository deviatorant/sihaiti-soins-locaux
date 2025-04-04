
-- Setup for the SIHATI health platform database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (extending the built-in auth.users)
CREATE OR REPLACE FUNCTION create_users_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    CREATE TABLE public.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      email TEXT,
      date_of_birth DATE,
      gender TEXT,
      blood_type TEXT,
      address TEXT,
      is_guest BOOLEAN DEFAULT FALSE,
      patient_id TEXT UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create RLS (Row Level Security) policies
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    
    -- Users can only read/update their own data
    CREATE POLICY users_select_policy ON public.users 
      FOR SELECT USING (auth.uid() = id);

    CREATE POLICY users_update_policy ON public.users 
      FOR UPDATE USING (auth.uid() = id);
      
    -- Only authenticated users can insert their own data
    CREATE POLICY users_insert_policy ON public.users 
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Doctors table
CREATE OR REPLACE FUNCTION create_doctors_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'doctors') THEN
    CREATE TABLE public.doctors (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      specialty TEXT NOT NULL,
      address TEXT,
      latitude FLOAT,
      longitude FLOAT,
      distance_km FLOAT,
      languages TEXT[],
      bio TEXT,
      education TEXT[],
      experience TEXT[],
      rating FLOAT DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      consultation_fee FLOAT,
      is_available BOOLEAN DEFAULT TRUE,
      is_online BOOLEAN DEFAULT FALSE,
      available_timeslots JSONB,
      profile_image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Index for fast geospatial queries
    CREATE INDEX doctors_location_idx ON public.doctors USING GIST (
      ST_SetSRID(ST_Point(longitude, latitude), 4326)
    );
    
    -- Index for fast specialty searches
    CREATE INDEX doctors_specialty_idx ON public.doctors USING GIN (specialty gin_trgm_ops);
    
    -- Index for availability filters
    CREATE INDEX doctors_availability_idx ON public.doctors (is_available, is_online);

    -- Allow public read access to doctors
    ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
    CREATE POLICY doctors_select_policy ON public.doctors
      FOR SELECT USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Appointments table
CREATE OR REPLACE FUNCTION create_appointments_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
    CREATE TABLE public.appointments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
      service_type TEXT NOT NULL,
      appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
      status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add indexes for faster queries
    CREATE INDEX appointments_user_id_idx ON public.appointments(user_id);
    CREATE INDEX appointments_doctor_id_idx ON public.appointments(doctor_id);
    CREATE INDEX appointments_date_idx ON public.appointments(appointment_date);
    CREATE INDEX appointments_status_idx ON public.appointments(status);
    
    -- Enable RLS
    ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
    
    -- Users can view their own appointments
    CREATE POLICY appointments_select_policy ON public.appointments
      FOR SELECT USING (auth.uid() = user_id);
      
    -- Users can insert their own appointments
    CREATE POLICY appointments_insert_policy ON public.appointments
      FOR INSERT WITH CHECK (auth.uid() = user_id);
      
    -- Users can update their own appointments
    CREATE POLICY appointments_update_policy ON public.appointments
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Services table
CREATE OR REPLACE FUNCTION create_services_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services') THEN
    CREATE TABLE public.services (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      service_type TEXT NOT NULL,
      title JSONB NOT NULL, -- Multilingual titles {en: "Title", fr: "Titre", ar: "العنوان"}
      description JSONB NOT NULL, -- Multilingual descriptions
      features JSONB, -- List of features
      price FLOAT,
      duration INTEGER, -- Duration in minutes
      requirements JSONB, -- Requirements for the service
      image_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Allow public read access to services
    ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
    CREATE POLICY services_select_policy ON public.services
      FOR SELECT USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- User preferences table
CREATE OR REPLACE FUNCTION create_user_preferences_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_preferences') THEN
    CREATE TABLE public.user_preferences (
      user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
      language_preference TEXT DEFAULT 'en',
      notification_preferences JSONB DEFAULT '{"email": true, "sms": true, "push": true}'::JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
    
    -- Users can only read/update their own preferences
    CREATE POLICY user_preferences_select_policy ON public.user_preferences
      FOR SELECT USING (auth.uid() = user_id);
      
    CREATE POLICY user_preferences_update_policy ON public.user_preferences
      FOR UPDATE USING (auth.uid() = user_id);
      
    CREATE POLICY user_preferences_insert_policy ON public.user_preferences
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the update_timestamp trigger to all tables
DO $$
BEGIN
  -- Users table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'set_updated_at_users') THEN
      CREATE TRIGGER set_updated_at_users
      BEFORE UPDATE ON public.users
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    END IF;
  END IF;

  -- Doctors table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'doctors') THEN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'set_updated_at_doctors') THEN
      CREATE TRIGGER set_updated_at_doctors
      BEFORE UPDATE ON public.doctors
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    END IF;
  END IF;

  -- Appointments table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'set_updated_at_appointments') THEN
      CREATE TRIGGER set_updated_at_appointments
      BEFORE UPDATE ON public.appointments
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    END IF;
  END IF;

  -- Services table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services') THEN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'set_updated_at_services') THEN
      CREATE TRIGGER set_updated_at_services
      BEFORE UPDATE ON public.services
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    END IF;
  END IF;

  -- User preferences table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_preferences') THEN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'set_updated_at_user_preferences') THEN
      CREATE TRIGGER set_updated_at_user_preferences
      BEFORE UPDATE ON public.user_preferences
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    END IF;
  END IF;
END $$;
