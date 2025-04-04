
import { supabase } from './supabase';

export interface MedicationOrder {
  id?: string;
  patient_id: string;
  delivery_address: string;
  medications: {
    name: string;
    dosage: string;
    quantity: number;
    prescription_required: boolean;
  }[];
  prescription_image?: string;
  delivery_time?: string;
  status: 'pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_method: 'cash' | 'insurance' | 'credit_card';
  total_amount?: number;
  created_at?: string;
  pharmacy_notes?: string;
  coordinates?: [number, number];
}

// Get all medication orders for a user
export const getUserMedicationOrders = async (userId: string): Promise<MedicationOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('medication_orders')
      .select('*')
      .eq('patient_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching medication orders:', error);
    return [];
  }
};

// Create a new medication order
export const createMedicationOrder = async (order: Omit<MedicationOrder, 'id' | 'created_at' | 'status'>): Promise<MedicationOrder | null> => {
  try {
    const newOrder = {
      ...order,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('medication_orders')
      .insert([newOrder])
      .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating medication order:', error);
    return null;
  }
};

// Update a medication order
export const updateMedicationOrder = async (id: string, updates: Partial<MedicationOrder>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('medication_orders')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating medication order:', error);
    return false;
  }
};

// Cancel a medication order
export const cancelMedicationOrder = async (id: string): Promise<boolean> => {
  return updateMedicationOrder(id, { status: 'cancelled' });
};

// Get medication order by ID
export const getMedicationOrderById = async (id: string): Promise<MedicationOrder | null> => {
  try {
    const { data, error } = await supabase
      .from('medication_orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching medication order:', error);
    return null;
  }
};

// Upload prescription image
export const uploadPrescriptionImage = async (file: File, patientId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${patientId}_${Date.now()}.${fileExt}`;
    const filePath = `prescriptions/${fileName}`;
    
    const { error } = await supabase.storage
      .from('medical-files')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading prescription image:', error);
    return null;
  }
};
