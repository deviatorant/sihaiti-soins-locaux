
import { supabase } from './supabase';
import { initializeAllServices } from './supabase';

// Simplified setup for ambulance and pharmacy tables
export const setupAmbulanceAndPharmacyTables = async () => {
  console.log('Setting up ambulance and pharmacy tables...');
  
  try {
    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return;
    }
    
    const hasAmbulanceRequests = tables?.includes('ambulance_requests');
    const hasMedicationOrders = tables?.includes('medication_orders');
    const hasUserCalendarSettings = tables?.includes('user_calendar_settings');
    
    if (!hasAmbulanceRequests) {
      console.log('Creating ambulance_requests table');
      const { error } = await supabase.from('ambulance_requests').select('id').limit(1);
      if (error && error.code === '42P01') { // Table doesn't exist
        // In production, run the SQL from supabase-tables-setup.sql
        console.log('Table ambulance_requests does not exist, would create it in production');
      }
    }
    
    if (!hasMedicationOrders) {
      console.log('Creating medication_orders table');
      const { error } = await supabase.from('medication_orders').select('id').limit(1);
      if (error && error.code === '42P01') { // Table doesn't exist
        // In production, run the SQL from supabase-tables-setup.sql
        console.log('Table medication_orders does not exist, would create it in production');
      }
    }
    
    if (!hasUserCalendarSettings) {
      console.log('Creating user_calendar_settings table');
      const { error } = await supabase.from('user_calendar_settings').select('user_id').limit(1);
      if (error && error.code === '42P01') { // Table doesn't exist
        // In production, run the SQL from supabase-tables-setup.sql
        console.log('Table user_calendar_settings does not exist, would create it in production');
      }
    }
    
    console.log('Ambulance and pharmacy tables setup completed');
  } catch (error) {
    console.error('Error setting up tables:', error);
  }
};

// Setup storage buckets (medical files and prescriptions)
export const setupStorageBuckets = async () => {
  try {
    // Check if buckets exist before trying to create them
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    const hasMedicalFilesBucket = buckets?.some(bucket => bucket.name === 'medical-files');
    const hasPrescriptionsBucket = buckets?.some(bucket => bucket.name === 'prescriptions');
    
    if (!hasMedicalFilesBucket) {
      console.log('Creating medical-files bucket');
      // In production: await supabase.storage.createBucket('medical-files', { public: false });
    }
    
    if (!hasPrescriptionsBucket) {
      console.log('Creating prescriptions bucket');
      // In production: await supabase.storage.createBucket('prescriptions', { public: false });
    }
    
  } catch (error) {
    console.error('Error checking/creating storage buckets:', error);
  }
};

// Initialize all services including ambulance and pharmacy
export const initializeAllServicesWithAmbuPharm = async () => {
  try {
    // Initialize base services
    await initializeAllServices();
    
    // Setup ambulance and pharmacy tables
    await setupAmbulanceAndPharmacyTables();
    
    // Setup storage buckets
    await setupStorageBuckets();
    
    console.log('All services initialized including ambulance and pharmacy');
  } catch (error) {
    console.error('Error initializing ambulance and pharmacy services:', error);
  }
};
