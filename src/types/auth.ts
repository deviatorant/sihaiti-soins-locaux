
import { User, Session } from '@supabase/supabase-js';

// Auth user type
export type AuthUser = {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  isGuest: boolean;
  patientID: string;
  token?: string;
  tokenExpiry?: number;
};

// Auth context type for provider
export type AuthContextType = {
  user: AuthUser | null;
  supabaseUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
};
