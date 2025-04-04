
-- Setup for ambulance and pharmacy services

-- Create ambulance_requests table
CREATE TABLE IF NOT EXISTS ambulance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  patient_condition TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  coordinates NUMERIC(10, 6)[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for ambulance_requests
ALTER TABLE ambulance_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own ambulance requests
CREATE POLICY "Users can view own ambulance requests"
  ON ambulance_requests FOR SELECT
  USING (auth.uid() = patient_id);

-- Policy for users to insert their own ambulance requests
CREATE POLICY "Users can insert own ambulance requests"
  ON ambulance_requests FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Policy for users to update their own ambulance requests
CREATE POLICY "Users can update own ambulance requests"
  ON ambulance_requests FOR UPDATE
  USING (auth.uid() = patient_id);

-- Create medication_orders table
CREATE TABLE IF NOT EXISTS medication_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delivery_address TEXT NOT NULL,
  medications JSONB NOT NULL,
  prescription_image TEXT,
  delivery_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'insurance', 'credit_card')),
  total_amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pharmacy_notes TEXT,
  coordinates NUMERIC(10, 6)[]
);

-- Add RLS policies for medication_orders
ALTER TABLE medication_orders ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own medication orders
CREATE POLICY "Users can view own medication orders"
  ON medication_orders FOR SELECT
  USING (auth.uid() = patient_id);

-- Policy for users to insert their own medication orders
CREATE POLICY "Users can insert own medication orders"
  ON medication_orders FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Policy for users to update their own medication orders
CREATE POLICY "Users can update own medication orders"
  ON medication_orders FOR UPDATE
  USING (auth.uid() = patient_id);

-- Create user_calendar_settings table
CREATE TABLE IF NOT EXISTS user_calendar_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_connected BOOLEAN DEFAULT FALSE,
  calendar_token TEXT,
  calendar_refresh_token TEXT,
  calendar_token_expiry TIMESTAMP WITH TIME ZONE,
  calendar_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for user_calendar_settings
ALTER TABLE user_calendar_settings ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own calendar settings
CREATE POLICY "Users can view own calendar settings"
  ON user_calendar_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own calendar settings
CREATE POLICY "Users can insert own calendar settings"
  ON user_calendar_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own calendar settings
CREATE POLICY "Users can update own calendar settings"
  ON user_calendar_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RPC functions for table creation
CREATE OR REPLACE FUNCTION create_ambulance_requests_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is called from the application to ensure the table exists
  -- It doesn't need to do anything as the table is created by this migration
  RETURN;
END;
$$;

CREATE OR REPLACE FUNCTION create_medication_orders_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is called from the application to ensure the table exists
  -- It doesn't need to do anything as the table is created by this migration
  RETURN;
END;
$$;

CREATE OR REPLACE FUNCTION create_user_calendar_settings_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is called from the application to ensure the table exists
  -- It doesn't need to do anything as the table is created by this migration
  RETURN;
END;
$$;
