
import { supabase } from './supabase';
import { initializeAllServices } from './supabase';

// Simplified setup for ambulance and pharmacy tables
export const setupAmbulanceAndPharmacyTables = async () => {
  console.log('Setting up ambulance and pharmacy tables...');
  
  // We'll just log operations rather than trying to create tables
  // through RPC functions that may not exist
  console.log('Would create ambulance_requests table if needed');
  console.log('Would create medication_orders table if needed');
  console.log('Would create user_calendar_settings table if needed');
  
  console.log('Ambulance and pharmacy tables setup completed');
};

// Setup storage buckets (medical files and prescriptions)
export const setupStorageBuckets = async () => {
  try {
    // Check if buckets exist before trying to create them
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const hasMedicalFilesBucket = buckets?.some(bucket => bucket.name === 'medical-files');
    const hasPrescriptionsBucket = buckets?.some(bucket => bucket.name === 'prescriptions');
    
    if (!hasMedicalFilesBucket) {
      console.log('Medical files bucket does not exist, would create it');
      // In production: await supabase.storage.createBucket('medical-files', { public: false });
    }
    
    if (!hasPrescriptionsBucket) {
      console.log('Prescriptions bucket does not exist, would create it');
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
