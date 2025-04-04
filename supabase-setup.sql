
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  patient_id TEXT UNIQUE,
  is_guest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  education TEXT[] DEFAULT '{}',
  experience INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  avatar TEXT,
  rating NUMERIC(3,1) DEFAULT 0,
  consultation_fee NUMERIC(10,2) DEFAULT 0,
  available_today BOOLEAN DEFAULT FALSE,
  online BOOLEAN DEFAULT FALSE,
  lat NUMERIC(10,6),
  lng NUMERIC(10,6),
  address TEXT,
  review_count INTEGER DEFAULT 0,
  accepting_new_patients BOOLEAN DEFAULT TRUE,
  insurances TEXT[] DEFAULT '{}',
  coordinates NUMERIC(10,6)[] DEFAULT '{}',
  available_slots TEXT[] DEFAULT '{}',
  location TEXT
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.users(id),
  doctor_id UUID REFERENCES public.doctors(id),
  service_id UUID,
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  category TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id),
  language_preference TEXT DEFAULT 'en',
  notification_enabled BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_initialization table
CREATE TABLE IF NOT EXISTS public.app_initialization (
  initialized BOOLEAN PRIMARY KEY DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ambulance_requests table
CREATE TABLE IF NOT EXISTS public.ambulance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.users(id),
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  patient_condition TEXT,
  additional_notes TEXT,
  status TEXT DEFAULT 'pending',
  coordinates NUMERIC(10,6)[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medication_orders table
CREATE TABLE IF NOT EXISTS public.medication_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.users(id),
  items JSONB NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_time TIMESTAMP WITH TIME ZONE,
  total_amount NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  prescription_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_calendar_settings table
CREATE TABLE IF NOT EXISTS public.user_calendar_settings (
  user_id UUID PRIMARY KEY REFERENCES public.users(id),
  calendar_provider TEXT,
  calendar_connected BOOLEAN DEFAULT FALSE,
  calendar_id TEXT,
  sync_enabled BOOLEAN DEFAULT FALSE,
  last_synced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_calendar_settings ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Anyone can view doctors" ON public.doctors
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Anyone can view services" ON public.services
  FOR SELECT USING (true);

-- Create storage buckets
-- Note: Run these in the Supabase dashboard or using the API
-- CREATE BUCKET medical-files;
-- CREATE BUCKET prescriptions;
