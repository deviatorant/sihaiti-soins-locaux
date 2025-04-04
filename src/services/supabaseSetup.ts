
import { supabase } from './supabase';

// Initialize database tables for ambulance and pharmacy services
export const setupAmbulanceAndPharmacyTables = async () => {
  try {
    console.log('Setting up ambulance and pharmacy tables...');
    
    // Create ambulance_requests table if it doesn't exist
    const { error: ambulanceError } = await supabase.rpc('create_ambulance_requests_table_if_not_exists');
    if (ambulanceError) {
      console.error('Error creating ambulance_requests table:', ambulanceError);
    } else {
      console.log('ambulance_requests table created or already exists');
    }

    // Create medication_orders table if it doesn't exist
    const { error: medicationError } = await supabase.rpc('create_medication_orders_table_if_not_exists');
    if (medicationError) {
      console.error('Error creating medication_orders table:', medicationError);
    } else {
      console.log('medication_orders table created or already exists');
    }
    
    // Create user_calendar_settings table if it doesn't exist
    const { error: calendarError } = await supabase.rpc('create_user_calendar_settings_table_if_not_exists');
    if (calendarError) {
      console.error('Error creating user_calendar_settings table:', calendarError);
    } else {
      console.log('user_calendar_settings table created or already exists');
    }
    
    console.log('Ambulance and pharmacy tables setup completed');
  } catch (error) {
    console.error('Error setting up ambulance and pharmacy tables:', error);
  }
};

// Update the main initialization to include the new services
export const initializeAllServicesWithAmbuPharm = async () => {
  // First run the original initialization
  const { initializeAllServices } = await import('./supabase');
  await initializeAllServices();
  
  // Then set up the new services
  await setupAmbulanceAndPharmacyTables();
  
  // Set up storage buckets
  await setupStorageBuckets();
  
  console.log('All services initialized including ambulance and pharmacy');
  return true;
};

// Setup storage buckets for prescriptions and medical files
const setupStorageBuckets = async () => {
  try {
    // Check if buckets exist
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      console.error('Error listing storage buckets:', getBucketsError);
      return;
    }
    
    // Create medical-files bucket if it doesn't exist
    if (!buckets?.find(bucket => bucket.name === 'medical-files')) {
      const { error: createBucketError } = await supabase.storage.createBucket('medical-files', {
        public: false,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
      });
      
      if (createBucketError) {
        console.error('Error creating medical-files bucket:', createBucketError);
      } else {
        console.log('medical-files bucket created');
      }
    }
    
    // Create prescriptions bucket if it doesn't exist
    if (!buckets?.find(bucket => bucket.name === 'prescriptions')) {
      const { error: createBucketError } = await supabase.storage.createBucket('prescriptions', {
        public: false,
        fileSizeLimit: 2 * 1024 * 1024, // 2MB limit
      });
      
      if (createBucketError) {
        console.error('Error creating prescriptions bucket:', createBucketError);
      } else {
        console.log('prescriptions bucket created');
      }
    }
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
  }
};
