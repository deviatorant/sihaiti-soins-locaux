
-- Script SQL pour la création des tables de pharmacie
-- À exécuter dans votre projet Supabase

-- Création de la table medication_orders (commandes de médicaments)
CREATE TABLE IF NOT EXISTS public.medication_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_time TIMESTAMP WITH TIME ZONE,
  delivery_notes TEXT,
  total_amount NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  prescription_url TEXT,
  pharmacy_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table pharmacies
CREATE TABLE IF NOT EXISTS public.pharmacies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  hours JSONB,
  location GEOGRAPHY(POINT),
  is_24h BOOLEAN DEFAULT FALSE,
  accepts_insurance BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3,2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table medications (catalogue de médicaments)
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  generic_name TEXT,
  description TEXT,
  category TEXT,
  dosage TEXT,
  prescription_required BOOLEAN DEFAULT FALSE,
  price NUMERIC(10,2) NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  manufacturer TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table prescriptions
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES auth.users(id),
  doctor_id UUID,
  diagnosis TEXT,
  notes TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter des politiques RLS pour la sécurité
ALTER TABLE public.medication_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own medication orders" 
  ON public.medication_orders FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can create medication orders" 
  ON public.medication_orders FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own medication orders" 
  ON public.medication_orders FOR UPDATE 
  USING (auth.uid() = patient_id);

-- Exposer les tables via l'API
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pharmacies are viewable by everyone" 
  ON public.pharmacies FOR SELECT 
  USING (true);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Medications are viewable by everyone" 
  ON public.medications FOR SELECT 
  USING (true);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own prescriptions" 
  ON public.prescriptions FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can create their own prescriptions" 
  ON public.prescriptions FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

-- Créer un index pour la recherche géographique de pharmacies
CREATE INDEX IF NOT EXISTS pharmacies_location_idx ON public.pharmacies USING GIST (location);

-- Créer un index pour la recherche de médicaments par nom
CREATE INDEX IF NOT EXISTS medications_name_idx ON public.medications USING GIN (to_tsvector('french', name));
CREATE INDEX IF NOT EXISTS medications_category_idx ON public.medications USING BTREE (category);
