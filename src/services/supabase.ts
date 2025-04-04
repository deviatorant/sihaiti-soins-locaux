
import { createClient } from '@supabase/supabase-js';
import { Doctor } from './database';

// Supabase URL and anon key from environment variables
const supabaseUrl = 'https://tfacovfcrjjlzkycmied.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYWNvdmZjcmpqbHpreWNtaWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MzA4NzEsImV4cCI6MjA1OTMwNjg3MX0.Atx6yAl6foZ3wi8QR-VNEisytZ8M6EjDIeT0nSEVnnU';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if a user is authenticated
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Auth functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: any) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Sign in with OTP (One-Time Password)
  signInWithOtp: async (phone: string) => {
    return supabase.auth.signInWithOtp({
      phone,
    });
  },

  // Verify OTP
  verifyOtp: async (phone: string, token: string) => {
    return supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
  },

  // Sign in with OAuth provider (Google, Facebook, etc.)
  signInWithProvider: async (provider: 'google' | 'facebook') => {
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  // Sign out
  signOut: async () => {
    return supabase.auth.signOut();
  },

  // Get current user
  getUser: async () => {
    return supabase.auth.getUser();
  },

  // Reset password
  resetPassword: async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },
};

// Database services
export const database = {
  // Users
  getUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateUser: async (userId: string, userData: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Doctors
  getDoctors: async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  getDoctorById: async (doctorId: string) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Appointments
  getAppointments: async (userId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctors(*),
        service:services(*)
      `)
      .eq('patient_id', userId)
      .order('appointment_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  createAppointment: async (appointmentData: any) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  updateAppointment: async (appointmentId: string, appointmentData: any) => {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', appointmentId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Consultations (Teleconsultation)
  getConsultations: async (userId: string) => {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        doctor:doctors(*)
      `)
      .eq('patient_id', userId)
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  createConsultation: async (consultationData: any) => {
    const { data, error } = await supabase
      .from('consultations')
      .insert([consultationData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  updateConsultation: async (consultationId: string, consultationData: any) => {
    const { data, error } = await supabase
      .from('consultations')
      .update(consultationData)
      .eq('id', consultationId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Medical Records
  getMedicalRecords: async (userId: string) => {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        doctor:doctors(*)
      `)
      .eq('patient_id', userId)
      .order('record_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  createMedicalRecord: async (recordData: any) => {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([recordData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Services
  getServices: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  },
};

// Storage services
export const storage = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    return data;
  },
  
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },
  
  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    return true;
  }
};

// Create necessary tables for the application
export const setupDatabase = async () => {
  try {
    // Check if the application has been initialized
    const { data: appInitData, error: appInitError } = await supabase
      .from('app_initialization')
      .select('initialized')
      .single();
    
    if (!appInitError && appInitData?.initialized) {
      console.log('Database already initialized');
      return;
    }
    
    console.log('Initializing database...');
    
    // Create users table if it doesn't exist
    const { error: usersError } = await supabase.rpc('create_users_table_if_not_exists');
    if (usersError) console.error('Error creating users table:', usersError);

    // Create doctors table if it doesn't exist
    const { error: doctorsError } = await supabase.rpc('create_doctors_table_if_not_exists');
    if (doctorsError) console.error('Error creating doctors table:', doctorsError);

    // Create appointments table if it doesn't exist
    const { error: appointmentsError } = await supabase.rpc('create_appointments_table_if_not_exists');
    if (appointmentsError) console.error('Error creating appointments table:', appointmentsError);

    // Create services table if it doesn't exist
    const { error: servicesError } = await supabase.rpc('create_services_table_if_not_exists');
    if (servicesError) console.error('Error creating services table:', servicesError);

    // Create user_preferences table if it doesn't exist
    const { error: preferencesError } = await supabase.rpc('create_user_preferences_table_if_not_exists');
    if (preferencesError) console.error('Error creating user_preferences table:', preferencesError);

    // Create app_initialization table to track if the database has been initialized
    const { error: createInitTableError } = await supabase
      .from('app_initialization')
      .insert([{ initialized: true }]);
    
    if (createInitTableError && createInitTableError.code !== '23505') { // Ignore if row already exists
      console.error('Error creating app_initialization record:', createInitTableError);
    }

    console.log('Database setup completed');
  } catch (error) {
    console.error('Database setup error:', error);
  }
};

// Initialize Twilio service (for teleconsultation)
export const initializeTwilioService = async () => {
  try {
    // In a real implementation, we would fetch Twilio credentials from Supabase Edge Functions
    // This is a placeholder for demonstration
    console.log('Twilio service initialized');
    return true;
  } catch (error) {
    console.error('Error initializing Twilio service:', error);
    return false;
  }
};

// Initialize Mapbox service
export const initializeMapboxService = async () => {
  try {
    // In a real implementation, we would fetch Mapbox credentials from Supabase Edge Functions
    // This is a placeholder for demonstration
    console.log('Mapbox service initialized');
    return true;
  } catch (error) {
    console.error('Error initializing Mapbox service:', error);
    return false;
  }
};

// Initialize OAuth2 services
export const initializeOAuthServices = async () => {
  try {
    // Check if OAuth is configured in Supabase Auth settings
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking OAuth configuration:', error);
      return false;
    }
    
    console.log('OAuth services initialized');
    return true;
  } catch (error) {
    console.error('Error initializing OAuth services:', error);
    return false;
  }
};

// Initialize calendar service
export const initializeCalendarService = async () => {
  try {
    // In a real implementation, we would set up calendar integration
    // This is a placeholder for demonstration
    console.log('Calendar service initialized');
    return true;
  } catch (error) {
    console.error('Error initializing calendar service:', error);
    return false;
  }
};

// Initialize all services
export const initializeAllServices = async () => {
  await setupDatabase();
  await initializeOAuthServices();
  await initializeTwilioService();
  await initializeMapboxService();
  await initializeCalendarService();
  
  console.log('All services initialized');
  return true;
};
