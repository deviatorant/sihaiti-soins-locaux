
// Generate a unique patient ID
export const generatePatientID = (): string => {
  return 'PT' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Format phone number to include country code
export const formatPhoneNumber = (phone: string): string => {
  return phone.startsWith('+') ? phone : `+${phone}`;
};
