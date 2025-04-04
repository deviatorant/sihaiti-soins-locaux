
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useTranslation } from './useTranslation';
import { toast } from '@/components/ui/use-toast';

// Types
type AuthUser = {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar_url?: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  sendOTP: (phone: string) => Promise<boolean>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Check authentication status on initial load
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            name: session.user.user_metadata?.name,
            // Additional user data can be fetched from user profiles table
          });
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error getting user session:', error);
        toast({
          title: t('common.error'),
          description: t('login.authFailed'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            name: session.user.user_metadata?.name,
          });
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [t]);

  // Sign in with email and password
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: t('login.loginSuccess'),
        description: t('login.redirecting'),
      });

      // Redirect to home or the page they were trying to access
      const redirectPath = location.state?.from?.pathname || '/';
      navigate(redirectPath);
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      toast({
        title: t('login.loginError'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Sign in alias for consistency
  const signIn = login;

  // Sign in with OTP via SMS
  const sendOTP = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      toast({
        title: t('login.otpSent'),
        description: t('login.checkPhone'),
      });

      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error.message);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Verify OTP
  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: t('login.loginSuccess'),
        description: t('login.redirecting'),
      });

      // Redirect to home or the page they were trying to access
      const redirectPath = location.state?.from?.pathname || '/';
      navigate(redirectPath);
      return true;
    } catch (error: any) {
      console.error('Error verifying OTP:', error.message);
      toast({
        title: t('login.otpError'),
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Login with phone - alias for verifyOTP
  const loginWithPhone = verifyOTP;

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
      toast({
        title: t('login.loginError'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Sign in with Facebook
  const loginWithFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Facebook:', error.message);
      toast({
        title: t('login.loginError'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      // After sign up, create user profile in the database
      await supabase.from('profiles').insert({
        id: (await supabase.auth.getUser()).data.user?.id,
        name,
        email,
      });

      toast({
        title: 'Account created successfully',
        description: 'Please check your email for a confirmation link',
      });

      // Redirect to login
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Signed out successfully',
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Continue as guest
  const continueAsGuest = () => {
    setUser(null);
    setIsLoggedIn(false);
    
    toast({
      title: t('login.guestLoginSuccess'),
      description: t('login.redirectingGuest'),
    });
    
    navigate('/');
  };

  // Auth context value
  const value = {
    user,
    loading,
    signIn,
    signInWithOTP: sendOTP,
    verifyOTP,
    signUp,
    signOut,
    continueAsGuest,
    isLoggedIn,
    login,
    loginWithPhone,
    loginWithGoogle,
    loginWithFacebook,
    sendOTP,
  };

  return (
    <AuthContext.Provider value={value}>
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

// Higher-order component for protecting routes
export const withAuth = (Component: React.ComponentType<any>) => {
  const WithAuth = (props: any) => {
    const { isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!loading && !isLoggedIn) {
        navigate('/login', { state: { from: location } });
      }
    }, [isLoggedIn, loading, navigate, location]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return isLoggedIn ? <Component {...props} /> : null;
  };

  return WithAuth;
};
