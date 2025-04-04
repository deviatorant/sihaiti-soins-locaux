
import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

// Types for our auth context
type AuthUser = {
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

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
};

// Secret key for localStorage encryption
const STORAGE_SECRET_KEY = 'SIHATI_AUTH_SECRET';

// Context creation
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a unique patient ID
const generatePatientID = () => {
  return 'PT' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const encryptedUserData = localStorage.getItem('sihati_user');
        
        if (encryptedUserData) {
          const decryptedBytes = CryptoJS.AES.decrypt(encryptedUserData, STORAGE_SECRET_KEY);
          const userData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
          
          // Check if token is expired
          if (userData.tokenExpiry && userData.tokenExpiry > Date.now()) {
            setUser(userData);
          } else {
            // Token expired, clear localStorage
            localStorage.removeItem('sihati_user');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('sihati_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save user data to localStorage
  const saveUserToStorage = (userData: AuthUser) => {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(userData),
      STORAGE_SECRET_KEY
    ).toString();
    
    localStorage.setItem('sihati_user', encryptedData);
  };

  // Auth methods
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Here we would normally call a Supabase auth method
      // For now, we'll mock a successful login
      const userData: AuthUser = {
        id: '123456',
        email,
        firstName: 'Test',
        lastName: 'User',
        isGuest: false,
        patientID: generatePatientID(),
        token: 'mock-token',
        tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      
      setUser(userData);
      saveUserToStorage(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      // Here we would normally verify OTP with Supabase
      // For now, we'll mock a successful login
      const userData: AuthUser = {
        id: '123456',
        phone,
        isGuest: false,
        patientID: generatePatientID(),
        token: 'mock-token',
        tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      
      setUser(userData);
      saveUserToStorage(userData);
    } catch (error) {
      console.error('Phone login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Here we would call Supabase OAuth method
      // For now, we'll mock a successful login
      const userData: AuthUser = {
        id: '123456',
        email: 'user@google.com',
        firstName: 'Google',
        lastName: 'User',
        isGuest: false,
        patientID: generatePatientID(),
        token: 'mock-token',
        tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      
      setUser(userData);
      saveUserToStorage(userData);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);
    try {
      // Here we would call Supabase OAuth method
      // For now, we'll mock a successful login
      const userData: AuthUser = {
        id: '123456',
        email: 'user@facebook.com',
        firstName: 'Facebook',
        lastName: 'User',
        isGuest: false,
        patientID: generatePatientID(),
        token: 'mock-token',
        tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      
      setUser(userData);
      saveUserToStorage(userData);
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = () => {
    const guestUser: AuthUser = {
      id: `guest-${Date.now()}`,
      isGuest: true,
      patientID: generatePatientID(),
      tokenExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days for guest
    };
    
    setUser(guestUser);
    saveUserToStorage(guestUser);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      // Here we would normally call Supabase sign up method
      // For now, we'll mock a successful registration
      const userData: AuthUser = {
        id: '123456',
        email,
        firstName,
        lastName,
        isGuest: false,
        patientID: generatePatientID(),
        token: 'mock-token',
        tokenExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      
      setUser(userData);
      saveUserToStorage(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sihati_user');
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithPhone,
    loginWithGoogle,
    loginWithFacebook,
    continueAsGuest,
    logout,
    register,
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

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login');
      } else if (!isLoading && !guestsAllowed && user?.isGuest) {
        navigate('/login');
      }
    }, [isLoading, isAuthenticated, user, navigate]);

    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
