
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, auth as supabaseAuth } from '@/services/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from './useTranslation';

// Types for our auth context
type AuthUser = {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar_url?: string;
  isGuest: boolean;
  patientID: string;
  token?: string;
  tokenExpiry?: number;
};

type AuthContextType = {
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

// Generate a unique patient ID
const generatePatientID = () => {
  return 'PT' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Context creation
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Initialize auth state from Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Failed to get session:', error);
        } else if (data?.session) {
          setSession(data.session);
          setSupabaseUser(data.session.user);
          
          // Get additional user data from the database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (userError) {
            console.error('Failed to get user data:', userError);
          } else if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              phone: userData.phone,
              firstName: userData.first_name,
              lastName: userData.last_name,
              isGuest: userData.is_guest || false,
              patientID: userData.patient_id,
              token: data.session.access_token,
              tokenExpiry: new Date(data.session.expires_at).getTime(),
            });
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up subscription for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setSupabaseUser(session?.user || null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user data from the database after sign in
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userError && userError.code !== 'PGRST116') {
            console.error('Failed to get user data after sign in:', userError);
          } else if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              phone: userData.phone,
              firstName: userData.first_name,
              lastName: userData.last_name,
              isGuest: userData.is_guest || false,
              patientID: userData.patient_id,
              token: session.access_token,
              tokenExpiry: new Date(session.expires_at).getTime(),
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    initializeAuth();
    
    // Clean up subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Auth methods
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseAuth.signIn(email, password);
      
      if (error) throw error;
      
      toast({
        title: t('login.loginSuccess'),
        description: t('login.redirecting'),
      });
      
      return;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: t('login.loginError'),
        description: error.message || t('login.enterCredentials'),
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string) => {
    try {
      setIsLoading(true);
      
      // Format phone number if needed
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabaseAuth.signInWithOtp(formattedPhone);
      
      if (error) throw error;
      
      toast({
        title: t('login.otpSent'),
        description: t('login.checkPhone'),
      });
      
      return;
    } catch (error: any) {
      console.error('OTP sending failed:', error);
      toast({
        title: t('login.otpError'),
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, otp: string) => {
    try {
      setIsLoading(true);
      
      // Format phone number if needed
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabaseAuth.verifyOtp(formattedPhone, otp);
      
      if (error) throw error;
      
      toast({
        title: t('login.loginSuccess'),
        description: t('login.redirecting'),
      });
      
      return;
    } catch (error: any) {
      console.error('Phone login failed:', error);
      toast({
        title: t('login.otpError'),
        description: error.message || t('login.enterValidOtp'),
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseAuth.signInWithProvider('google');
      
      if (error) throw error;
      
      // Redirect happens automatically
      return;
    } catch (error: any) {
      console.error('Google login failed:', error);
      toast({
        title: t('login.loginError'),
        description: error.message || t('login.authFailed'),
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseAuth.signInWithProvider('facebook');
      
      if (error) throw error;
      
      // Redirect happens automatically
      return;
    } catch (error: any) {
      console.error('Facebook login failed:', error);
      toast({
        title: t('login.loginError'),
        description: error.message || t('login.authFailed'),
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = async () => {
    try {
      setIsLoading(true);
      
      // Create a guest user in the database
      const patientID = generatePatientID();
      
      setUser({
        id: `guest-${Date.now()}`,
        isGuest: true,
        patientID,
        tokenExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days for guest
      });
      
      toast({
        title: t('login.guestLoginSuccess'),
        description: t('login.redirectingGuest'),
      });
    } catch (error: any) {
      console.error('Guest login failed:', error);
      toast({
        title: t('login.loginError'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      
      // Generate a unique patient ID
      const patientID = generatePatientID();
      
      // Register the user with Supabase
      const { data, error } = await supabaseAuth.signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        patient_id: patientID,
      });
      
      if (error) throw error;
      
      // If the user was created successfully, insert into users table
      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            patient_id: patientID,
            is_guest: false,
          });
          
        if (insertError) {
          console.error('Failed to insert user data:', insertError);
          // Still consider registration successful if Supabase auth worked
        }
      }
      
      toast({
        title: t('auth.registrationSuccess'),
        description: t('auth.verifyEmail'),
      });
      
      return;
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: t('auth.registrationError'),
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      if (user?.isGuest) {
        // Just clear the guest user state
        setUser(null);
      } else {
        // Sign out from Supabase
        const { error } = await supabaseAuth.signOut();
        if (error) throw error;
      }
      
      toast({
        title: t('profile.logoutSuccess'),
      });
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast({
        title: t('profile.logoutError'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
    }
  };

  const contextValue: AuthContextType = {
    user,
    supabaseUser,
    session,
    isAuthenticated: !!user || !!supabaseUser,
    isLoading,
    login,
    loginWithPhone,
    loginWithGoogle,
    loginWithFacebook,
    continueAsGuest,
    logout,
    register,
    sendOTP,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for route protection
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  guestsAllowed = false
) => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        toast({
          title: t('auth.authRequired'),
          description: t('auth.pleaseLogin'),
          variant: 'destructive',
        });
        navigate('/login');
      } else if (!isLoading && !guestsAllowed && user?.isGuest) {
        toast({
          title: t('auth.fullAccountRequired'),
          description: t('auth.pleaseCreateAccount'),
          variant: 'destructive',
        });
        navigate('/login');
      }
    }, [isLoading, isAuthenticated, user, navigate, t]);

    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    if (!guestsAllowed && user?.isGuest) {
      return null;
    }

    return <Component {...props} />;
  };

  return WithAuth;
};
