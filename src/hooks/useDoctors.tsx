import React, { createContext, useContext, useState, useMemo } from 'react';
import { getDoctors, Doctor } from '@/services/database';
import { useGeolocation } from '@/hooks/useGeolocation';

type SortOption = 'distance' | 'rating' | 'price';

type DoctorsContextType = {
  doctors: Doctor[];
  filteredDoctors: Doctor[];
  isLoading: boolean;
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
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
};

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

export const DoctorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBySpecialty, setFilterBySpecialty] = useState('all');
  const [filterByLanguage, setFilterByLanguage] = useState('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showAvailableTodayOnly, setShowAvailableTodayOnly] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  const { position, calculateDistance } = useGeolocation();
  
  const getDistance = (doctor: Doctor) => {
    if (!position || !doctor.lat || !doctor.lng) return Infinity;
    return calculateDistance(
      position.latitude,
      position.longitude,
      doctor.lat,
      doctor.lng
    );
  };
  
  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  const filteredDoctors = useMemo(() => {
    const doctorsWithDistance = doctors.map(doctor => ({
      ...doctor,
      distance: position ? getDistance(doctor) : undefined
    }));
    
    let filtered = doctorsWithDistance;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.address.toLowerCase().includes(query)
      );
    }
    
    if (filterBySpecialty !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.specialty === filterBySpecialty
      );
    }
    
    if (filterByLanguage !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.languages.includes(filterByLanguage)
      );
    }
    
    if (showOnlineOnly) {
      filtered = filtered.filter(doctor => doctor.online);
    }
    
    if (showAvailableTodayOnly) {
      filtered = filtered.filter(doctor => doctor.availableToday);
    }
    
    if (position) {
      filtered = filtered.filter(doctor => 
        doctor.distance !== undefined && doctor.distance <= searchRadius
      );
    }
    
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => {
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filtered.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
    }
    
    return filtered;
  }, [
    doctors,
    position,
    searchQuery,
    filterBySpecialty,
    filterByLanguage,
    showOnlineOnly,
    showAvailableTodayOnly,
    searchRadius,
    sortBy
  ]);
  
  const value = {
    doctors,
    filteredDoctors,
    isLoading,
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
    selectedDoctor,
    setSelectedDoctor
  };
  
  return (
    <DoctorsContext.Provider value={value}>
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
