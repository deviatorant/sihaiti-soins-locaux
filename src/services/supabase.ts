
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key from environment variables
const supabaseUrl = 'https://tfacovfcrjjlzkycmied.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYWNvdmZjcmpqbHpreWNtaWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MzA4NzEsImV4cCI6MjA1OTMwNjg3MX0.Atx6yAl6foZ3wi8QR-VNEisytZ8M6EjDIeT0nSEVnnU';

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

// Create necessary tables for the application
export const setupDatabase = async () => {
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

  console.log('Database setup completed');
};
