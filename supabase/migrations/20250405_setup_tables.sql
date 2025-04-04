
-- Create or update the tables for the healthcare app

-- Doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  education TEXT[] DEFAULT '{}',
  experience INTEGER,
  languages TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  avatar TEXT,
  rating DECIMAL(3, 1) DEFAULT 0,
  consultation_fee DECIMAL(10, 2),
  available_today BOOLEAN DEFAULT true,
  online BOOLEAN DEFAULT false,
  lat DECIMAL(10, 6),
  lng DECIMAL(10, 6),
  address TEXT,
  review_count INTEGER DEFAULT 0,
  accepting_new_patients BOOLEAN DEFAULT true,
  insurances TEXT[] DEFAULT '{}',
  coordinates DECIMAL(10, 6)[] DEFAULT '{}'
);

-- Users (patients) table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  patient_id TEXT UNIQUE,
  is_guest BOOLEAN DEFAULT false,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  language_preference TEXT DEFAULT 'en',
  theme_preference TEXT DEFAULT 'light',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": true, "push": true}'
);

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  icon TEXT,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'MAD',
  is_active BOOLEAN DEFAULT true
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 30, -- Duration in minutes
  status TEXT DEFAULT 'scheduled', -- scheduled, confirmed, completed, cancelled, no-show
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Consultations table (for teleconsultations)
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- video, audio, chat
  status TEXT DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  recording_url TEXT,
  chat_log JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  record_date DATE NOT NULL,
  description TEXT,
  attachments TEXT[],
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Procedures for dynamic creation of tables
CREATE OR REPLACE FUNCTION create_users_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This is already handled by the SQL above, but keep the function for backward compatibility
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_doctors_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This is already handled by the SQL above, but keep the function for backward compatibility
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_appointments_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This is already handled by the SQL above, but keep the function for backward compatibility
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_services_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This is already handled by the SQL above, but keep the function for backward compatibility
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_user_preferences_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This is already handled by the SQL above, but keep the function for backward compatibility
END;
$$ LANGUAGE plpgsql;

-- Create some RLS policies for secure data access
-- Enable Row Level Security on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Doctors policies (public read)
CREATE POLICY "Anyone can view doctors" ON public.doctors
  FOR SELECT USING (true);

-- Appointments policies
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);
  
CREATE POLICY "Users can create their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
  
CREATE POLICY "Users can update their own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = patient_id);

-- Consultations policies
CREATE POLICY "Users can view their own consultations" ON public.consultations
  FOR SELECT USING (auth.uid() = patient_id);

-- Medical records policies
CREATE POLICY "Users can view their own medical records" ON public.medical_records
  FOR SELECT USING (auth.uid() = patient_id);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE
  ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE
  ON public.appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE
  ON public.consultations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE
  ON public.medical_records FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
