
-- Create ambulance_requests table
CREATE TABLE IF NOT EXISTS public.ambulance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES auth.users(id),
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
  patient_id UUID REFERENCES auth.users(id),
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
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  calendar_provider TEXT,
  calendar_connected BOOLEAN DEFAULT FALSE,
  calendar_id TEXT,
  sync_enabled BOOLEAN DEFAULT FALSE,
  last_synced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.ambulance_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own ambulance requests" ON public.ambulance_requests
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Users can create ambulance requests" ON public.ambulance_requests
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users can update their own ambulance requests" ON public.ambulance_requests
  FOR UPDATE USING (auth.uid() = patient_id);

ALTER TABLE public.medication_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own medication orders" ON public.medication_orders
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Users can create medication orders" ON public.medication_orders
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users can update their own medication orders" ON public.medication_orders
  FOR UPDATE USING (auth.uid() = patient_id);

ALTER TABLE public.user_calendar_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own calendar settings" ON public.user_calendar_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create calendar settings" ON public.user_calendar_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own calendar settings" ON public.user_calendar_settings
  FOR UPDATE USING (auth.uid() = user_id);
