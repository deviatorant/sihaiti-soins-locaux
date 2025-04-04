
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Doctor, getDoctors, searchDoctors } from '@/services/database';
import { useAuth } from './useAuth';
import { useGeolocation } from './useGeolocation';
import Fuse from 'fuse.js';

type DoctorsContextType = {
  doctors: Doctor[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterBySpecialty: string;
  setFilterBySpecialty: (specialty: string) => void;
  filterByLanguage: string;
  setFilterByLanguage: (language: string) => void;
  showOnlineOnly: boolean;
  setShowOnlineOnly: (show: boolean) => void;
  showAvailableTodayOnly: boolean;
  setShowAvailableTodayOnly: (show: boolean) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  sortBy: 'distance' | 'rating' | 'price';
  setSortBy: (sort: 'distance' | 'rating' | 'price') => void;
  filteredDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
};

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

const useFuseSearch = (doctors: Doctor[], searchQuery: string): Doctor[] => {
  const fuse = new Fuse(doctors, {
    keys: ['name', 'specialty', 'address'],
    threshold: 0.3,
    ignoreLocation: true,
  });
  
  return searchQuery ? fuse.search(searchQuery).map(result => result.item) : doctors;
};

export const DoctorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { position } = useGeolocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBySpecialty, setFilterBySpecialty] = useState('all');
  const [filterByLanguage, setFilterByLanguage] = useState('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showAvailableTodayOnly, setShowAvailableTodayOnly] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10); // 10km default radius
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Helper function to calculate distance
  const calculateDistance = (
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };
  
  // Fetch doctors with React Query
  const { data: doctors = [], isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Apply location and filters to doctors
  const processedDoctors = React.useMemo(() => {
    let result = [...doctors];
    
    // Calculate distances if we have the user's position
    if (position) {
      result = result.map(doctor => ({
        ...doctor,
        distance: calculateDistance(
          position.latitude, position.longitude,
          doctor.lat, doctor.lng
        )
      }));
    }
    
    return result;
  }, [doctors, position]);
  
  // Apply all filters
  const filteredDoctors = React.useMemo(() => {
    // Start with Fuse.js search results
    let result = useFuseSearch(processedDoctors, searchQuery);
    
    // Apply filters
    if (filterBySpecialty !== 'all') {
      result = result.filter(doctor => doctor.specialty === filterBySpecialty);
    }
    
    if (filterByLanguage !== 'all') {
      result = result.filter(doctor => doctor.languages.includes(filterByLanguage));
    }
    
    if (showOnlineOnly) {
      result = result.filter(doctor => doctor.online);
    }
    
    if (showAvailableTodayOnly) {
      result = result.filter(doctor => doctor.availableToday);
    }
    
    // Filter by radius if we have position and distance
    if (position && searchRadius > 0) {
      result = result.filter(doctor => doctor.distance! <= searchRadius);
    }
    
    // Sort
    switch (sortBy) {
      case 'distance':
        result.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        result.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
    }
    
    return result;
  }, [
    processedDoctors, 
    searchQuery, 
    filterBySpecialty, 
    filterByLanguage, 
    showOnlineOnly,
    showAvailableTodayOnly,
    position,
    searchRadius,
    sortBy
  ]);
  
  return (
    <DoctorsContext.Provider
      value={{
        doctors: processedDoctors,
        isLoading,
        error: error as Error | null,
        searchQuery,
        setSearchQuery,
        filterBySpecialty,
        setFilterBySpecialty,
        filterByLanguage,
        setFilterByLanguage,
        showOnlineOnly,
        setShowOnlineOnly,
        showAvailableTodayOnly,
        setShowAvailableTodayOnly,
        searchRadius,
        setSearchRadius,
        sortBy,
        setSortBy,
        filteredDoctors,
        selectedDoctor,
        setSelectedDoctor,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};

export const useDoctors = () => {
  const context = useContext(DoctorsContext);
  if (context === undefined) {
    throw new Error('useDoctors must be used within a DoctorsProvider');
  }
  return context;
};
