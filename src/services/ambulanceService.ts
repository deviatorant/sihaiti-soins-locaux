
import { supabase } from './supabase';

export interface AmbulanceRequest {
  id?: string;
  patient_id: string;
  pickup_location: string;
  destination: string;
  pickup_time: string;
  patient_condition: string;
  additional_notes?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  coordinates?: [number, number];
  created_at?: string;
}

// Get all ambulance requests for a user
export const getUserAmbulanceRequests = async (userId: string): Promise<AmbulanceRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('ambulance_requests')
      .select('*')
      .eq('patient_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching ambulance requests:', error);
    return [];
  }
};

// Create a new ambulance request
export const createAmbulanceRequest = async (request: Omit<AmbulanceRequest, 'id' | 'created_at' | 'status'>): Promise<AmbulanceRequest | null> => {
  try {
    const newRequest = {
      ...request,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('ambulance_requests')
      .insert([newRequest])
      .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating ambulance request:', error);
    return null;
  }
};

// Update an ambulance request
export const updateAmbulanceRequest = async (id: string, updates: Partial<AmbulanceRequest>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ambulance_requests')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating ambulance request:', error);
    return false;
  }
};

// Cancel an ambulance request
export const cancelAmbulanceRequest = async (id: string): Promise<boolean> => {
  return updateAmbulanceRequest(id, { status: 'cancelled' });
};

// Get ambulance request by ID
export const getAmbulanceRequestById = async (id: string): Promise<AmbulanceRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('ambulance_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching ambulance request:', error);
    return null;
  }
};
