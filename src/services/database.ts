
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (we'll use environment variables in a real application)
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  languages: string[];
  rating: number;
  reviews: number;
  online: boolean;
  avatar: string;
  verified: boolean;
  location: string;
  lat: number;
  lng: number;
  distance?: number;
  education: string;
  experience: string;
  consultationFee: number;
  bio: string;
  availableToday: boolean;
  availableSlots?: string[];
}

export interface Consultation {
  id: number;
  doctorId: number;
  patientId: string;
  date: string;
  time: string;
  type: 'Video' | 'Audio' | 'Chat' | 'In-person';
  duration: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  summary: string;
  documents: string[];
}

// Database setup script
export const setupDatabase = async () => {
  // Create doctors table
  await supabase.rpc('create_doctors_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        languages TEXT[] NOT NULL,
        rating FLOAT NOT NULL,
        reviews INTEGER NOT NULL,
        online BOOLEAN NOT NULL DEFAULT false,
        avatar TEXT,
        verified BOOLEAN NOT NULL DEFAULT false,
        location TEXT NOT NULL,
        lat FLOAT NOT NULL,
        lng FLOAT NOT NULL,
        education TEXT,
        experience TEXT,
        consultation_fee INTEGER NOT NULL,
        bio TEXT,
        available_today BOOLEAN NOT NULL DEFAULT false,
        available_slots TEXT[]
      );
      
      CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors (specialty);
      CREATE INDEX IF NOT EXISTS idx_doctors_online ON doctors (online);
      CREATE INDEX IF NOT EXISTS idx_doctors_verified ON doctors (verified);
    `
  });

  // Create consultations table
  await supabase.rpc('create_consultations_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id),
        patient_id TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        type TEXT NOT NULL,
        duration TEXT NOT NULL,
        status TEXT NOT NULL,
        summary TEXT,
        documents TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations (patient_id);
      CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON consultations (doctor_id);
      CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations (date);
      CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations (status);
    `
  });

  // Insert sample doctors data
  await supabase.from('doctors').upsert([
    {
      id: 1,
      name: "Dr. Leila Tazi",
      specialty: "Gynecologist",
      languages: ["Arabic", "French"],
      rating: 4.9,
      reviews: 156,
      online: true,
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      verified: true,
      location: "202 Women's Health Clinic, Casablanca",
      lat: 33.5731,
      lng: -7.5898,
      education: "McGill University",
      experience: "14 years",
      consultation_fee: 350,
      bio: "Specialist in women's health and reproductive medicine with expertise in minimally invasive surgery.",
      available_today: true,
      available_slots: ["10:00", "11:30", "14:00", "16:30"]
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      languages: ["Arabic", "French", "English"],
      rating: 4.9,
      reviews: 145,
      online: true,
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      verified: true,
      location: "123 Medical Center, Casablanca",
      lat: 33.5950,
      lng: -7.6192,
      education: "Harvard Medical School",
      experience: "12 years",
      consultation_fee: 400,
      bio: "Board-certified cardiologist specializing in preventive cardiology and women's heart health.",
      available_today: true,
      available_slots: ["09:00", "11:00", "14:30"]
    },
    {
      id: 3,
      name: "Dr. Mohammed Alami",
      specialty: "Pediatrician",
      languages: ["Arabic", "French"],
      rating: 4.8,
      reviews: 98,
      online: true,
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      verified: true,
      location: "45 Children's Clinic, Rabat",
      lat: 34.0209,
      lng: -6.8416,
      education: "University of Rabat",
      experience: "10 years",
      consultation_fee: 300,
      bio: "Compassionate pediatrician with a focus on newborn care and childhood development.",
      available_today: false,
      available_slots: []
    }
  ], { onConflict: 'id' });
  
  // Return success message
  return { success: true, message: "Database setup completed successfully" };
};

// Doctor services
export const getDoctors = async (): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*');
  
  if (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
  
  return data as Doctor[];
};

export const getDoctorById = async (id: number): Promise<Doctor | null> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
  
  return data as Doctor;
};

export const searchDoctors = async (
  query: string,
  filters: {
    specialty?: string;
    languages?: string[];
    online?: boolean;
    availableToday?: boolean;
    location?: { lat: number; lng: number; radius: number };
  }
): Promise<Doctor[]> => {
  let queryBuilder = supabase
    .from('doctors')
    .select('*');
  
  // Apply filters
  if (filters.specialty) {
    queryBuilder = queryBuilder.eq('specialty', filters.specialty);
  }
  
  if (filters.languages && filters.languages.length > 0) {
    queryBuilder = queryBuilder.overlaps('languages', filters.languages);
  }
  
  if (filters.online !== undefined) {
    queryBuilder = queryBuilder.eq('online', filters.online);
  }
  
  if (filters.availableToday !== undefined) {
    queryBuilder = queryBuilder.eq('available_today', filters.availableToday);
  }
  
  // Get results
  const { data, error } = await queryBuilder;
  
  if (error) {
    console.error('Error searching doctors:', error);
    return [];
  }
  
  // Client-side filtering for text search and location
  let filteredData = data as Doctor[];
  
  // Text search if query provided
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredData = filteredData.filter(
      doctor => 
        doctor.name.toLowerCase().includes(lowerQuery) ||
        doctor.specialty.toLowerCase().includes(lowerQuery) ||
        doctor.location.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Location filtering if provided
  if (filters.location) {
    const { lat, lng, radius } = filters.location;
    
    // Calculate distance using the Haversine formula
    filteredData = filteredData.map(doctor => {
      const distance = calculateDistance(
        lat, lng,
        doctor.lat, doctor.lng
      );
      return { ...doctor, distance };
    }).filter(doctor => doctor.distance! <= radius);
  }
  
  return filteredData;
};

// Helper function to calculate distance using Haversine formula
const calculateDistance = (
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Consultation services
export const getConsultationsByPatient = async (patientId: string): Promise<Consultation[]> => {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching consultations:', error);
    return [];
  }
  
  return data as Consultation[];
};

export const createConsultation = async (consultation: Omit<Consultation, 'id'>): Promise<Consultation | null> => {
  const { data, error } = await supabase
    .from('consultations')
    .insert([consultation])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating consultation:', error);
    return null;
  }
  
  return data as Consultation;
};

export const updateConsultationStatus = async (
  id: number,
  status: 'Scheduled' | 'Completed' | 'Cancelled'
): Promise<boolean> => {
  const { error } = await supabase
    .from('consultations')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating consultation status:', error);
    return false;
  }
  
  return true;
};
