
import { supabase } from './supabase';

// Define the Doctor interface
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  education: string[];
  experience: number;
  languages: string[];
  certifications: string[];
  avatar: string;
  rating: number;
  consultationFee: number;
  availableToday: boolean;
  online: boolean;
  lat: number;
  lng: number;
  distance?: number;
  address: string;
  reviewCount: number;
  acceptingNewPatients: boolean;
  insurances: string[];
  coordinates: [number, number];
  availableSlots?: string[];
  location?: string; // Added location field to match usage in Doctors.tsx
}

// Fetch all doctors
export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*');
    
    if (error) throw error;
    
    // If no data yet in database, return mock data
    if (!data || data.length === 0) {
      return mockDoctors;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    // Fallback to mock data
    return mockDoctors;
  }
};

// Search doctors by name, specialty or location
export const searchDoctors = async (query: string): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .or(`name.ilike.%${query}%,specialty.ilike.%${query}%,address.ilike.%${query}%`);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error searching doctors:', error);
    return [];
  }
};

// Get doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
};

// Mock data for initial development
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    bio: 'Board-certified cardiologist with over 15 years of experience in treating heart conditions.',
    education: ['Harvard Medical School', 'Johns Hopkins Residency'],
    experience: 15,
    languages: ['English', 'French', 'Arabic'],
    certifications: ['American Board of Cardiology', 'Advanced Cardiac Life Support'],
    avatar: '/doctor1.jpg',
    rating: 4.8,
    consultationFee: 120,
    availableToday: true,
    online: true,
    lat: 33.5731,
    lng: -7.5898,
    address: 'Casablanca Medical Center, 123 Health St, Casablanca',
    reviewCount: 128,
    acceptingNewPatients: true,
    insurances: ['CNOPS', 'CNSS', 'RMA'],
    coordinates: [33.5731, -7.5898],
    availableSlots: ['9:00', '10:30', '14:00', '16:30']
  },
  {
    id: '2',
    name: 'Dr. Mohammed Al-Fasi',
    specialty: 'Pediatrics',
    bio: 'Caring pediatrician dedicated to children\'s health and development.',
    education: ['Rabat Medical University', 'Children\'s Hospital Fellowship'],
    experience: 10,
    languages: ['Arabic', 'French'],
    certifications: ['Board of Pediatrics', 'Pediatric Advanced Life Support'],
    avatar: '/doctor2.jpg',
    rating: 4.9,
    consultationFee: 90,
    availableToday: true,
    online: true,
    lat: 33.5950,
    lng: -7.6192,
    address: 'Kids Care Clinic, 45 Child Ave, Casablanca',
    reviewCount: 95,
    acceptingNewPatients: true,
    insurances: ['CNOPS', 'CNSS', 'AXA'],
    coordinates: [33.5950, -7.6192],
    availableSlots: ['8:30', '11:00', '13:30', '15:00', '17:30']
  },
  {
    id: '3',
    name: 'Dr. Fatima Zahra',
    specialty: 'Dermatology',
    bio: 'Specialized in treating skin conditions with the latest techniques.',
    education: ['Casablanca Medical School', 'Paris Dermatology Institute'],
    experience: 8,
    languages: ['Arabic', 'French', 'English'],
    certifications: ['Board of Dermatology', 'Cosmetic Dermatology'],
    avatar: '/doctor3.jpg',
    rating: 4.7,
    consultationFee: 150,
    availableToday: false,
    online: true,
    lat: 34.0209,
    lng: -6.8416,
    address: 'Skin Health Center, 78 Beauty Rd, Rabat',
    reviewCount: 76,
    acceptingNewPatients: false,
    insurances: ['CNSS', 'MAMDA', 'Allianz'],
    coordinates: [34.0209, -6.8416],
    availableSlots: []
  },
  {
    id: '4',
    name: 'Dr. Youssef Benzarti',
    specialty: 'Orthopedics',
    bio: 'Expert in joint replacements and sports injuries.',
    education: ['Fes Medical University', 'Orthopedic Surgery Fellowship'],
    experience: 12,
    languages: ['Arabic', 'French'],
    certifications: ['Board of Orthopedic Surgery', 'Sports Medicine'],
    avatar: '/doctor4.jpg',
    rating: 4.6,
    consultationFee: 130,
    availableToday: true,
    online: false,
    lat: 31.6295,
    lng: -7.9811,
    address: 'Motion Clinic, 32 Sports Blvd, Marrakech',
    reviewCount: 102,
    acceptingNewPatients: true,
    insurances: ['CNOPS', 'RMA', 'MAMDA'],
    coordinates: [31.6295, -7.9811],
    availableSlots: ['10:00', '12:30', '15:30']
  },
  {
    id: '5',
    name: 'Dr. Amina Tazi',
    specialty: 'Psychiatry',
    bio: 'Compassionate psychiatrist specializing in anxiety and depression treatment.',
    education: ['Tangier Medical College', 'Mental Health Institute'],
    experience: 9,
    languages: ['Arabic', 'French', 'Spanish'],
    certifications: ['Board of Psychiatry', 'Cognitive Behavioral Therapy'],
    avatar: '/doctor5.jpg',
    rating: 4.9,
    consultationFee: 110,
    availableToday: false,
    online: true,
    lat: 35.7595,
    lng: -5.8340,
    address: 'Mind Wellness Center, 14 Peace St, Tangier',
    reviewCount: 68,
    acceptingNewPatients: true,
    insurances: ['CNSS', 'Allianz', 'Wafa Assurance'],
    coordinates: [35.7595, -5.8340],
    availableSlots: []
  }
];

// Update a doctor's availability
export const updateDoctorAvailability = async (doctorId: string, availableToday: boolean, online: boolean) => {
  try {
    const { error } = await supabase
      .from('doctors')
      .update({ availableToday, online })
      .eq('id', doctorId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    return false;
  }
};

// Add a new doctor
export const addDoctor = async (doctor: Omit<Doctor, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctor])
      .select();
    
    if (error) throw error;
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error adding doctor:', error);
    return null;
  }
};
