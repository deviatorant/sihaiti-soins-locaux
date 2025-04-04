
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useGeolocation } from "@/hooks/useGeolocation";
import NavBar from "@/components/NavBar";
import LocationMap from "@/components/LocationMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { MapPin, Search, Star, Clock, Filter, Calendar, Phone, Video } from "lucide-react";
import Fuse from 'fuse.js';

// Mock data
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    languages: ["Arabic", "French", "English"],
    location: "Casablanca",
    address: "123 Medical Center, Casablanca",
    rating: 4.9,
    reviewCount: 145,
    availableToday: true,
    acceptingNewPatients: true,
    education: "Harvard Medical School",
    experience: "15 years",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    insurances: ["CNOPS", "CNSS", "RMA"],
    coordinates: { lat: 33.5992, lng: -7.6201 },
    distance: 0, // Will be calculated based on user location
    availableSlots: [
      { date: "2025-04-05", slots: ["09:00", "11:30", "14:00"] },
      { date: "2025-04-06", slots: ["10:00", "15:30"] },
    ]
  },
  {
    id: 2,
    name: "Dr. Mohammed Al-Fassi",
    specialty: "Pediatrician",
    languages: ["Arabic", "French"],
    location: "Rabat",
    address: "456 Children's Clinic, Rabat",
    rating: 4.8,
    reviewCount: 120,
    availableToday: false,
    acceptingNewPatients: true,
    education: "Université de Rabat",
    experience: "10 years",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    insurances: ["CNSS", "Saham Assurance"],
    coordinates: { lat: 34.0209, lng: -6.8416 },
    distance: 0,
    availableSlots: [
      { date: "2025-04-06", slots: ["14:00", "16:30"] },
      { date: "2025-04-07", slots: ["09:30", "11:00", "15:00"] },
    ]
  },
  {
    id: 3,
    name: "Dr. Fatima Benali",
    specialty: "Dermatologist",
    languages: ["Arabic", "French", "English"],
    location: "Marrakech",
    address: "789 Skin Health Center, Marrakech",
    rating: 4.7,
    reviewCount: 98,
    availableToday: true,
    acceptingNewPatients: true,
    education: "Université de Casablanca",
    experience: "8 years",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    insurances: ["CNOPS", "Wafa Assurance"],
    coordinates: { lat: 31.6295, lng: -7.9811 },
    distance: 0,
    availableSlots: [
      { date: "2025-04-05", slots: ["10:30", "13:00", "16:00"] },
      { date: "2025-04-08", slots: ["09:00", "14:30"] },
    ]
  },
  {
    id: 4,
    name: "Dr. Karim Idrissi",
    specialty: "General Practitioner",
    languages: ["Arabic", "French", "Amazigh"],
    location: "Agadir",
    address: "101 Family Health, Agadir",
    rating: 4.6,
    reviewCount: 85,
    availableToday: true,
    acceptingNewPatients: false,
    education: "Université Mohammed V",
    experience: "12 years",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    insurances: ["CNSS", "MGEN"],
    coordinates: { lat: 30.4278, lng: -9.5982 },
    distance: 0,
    availableSlots: [
      { date: "2025-04-05", slots: ["08:30", "11:00", "15:30"] },
      { date: "2025-04-07", slots: ["10:00", "13:30", "16:00"] },
    ]
  },
  {
    id: 5,
    name: "Dr. Leila Tazi",
    specialty: "Gynecologist",
    languages: ["Arabic", "French"],
    location: "Casablanca",
    address: "202 Women's Health Clinic, Casablanca",
    rating: 4.9,
    reviewCount: 156,
    availableToday: false,
    acceptingNewPatients: true,
    education: "McGill University",
    experience: "14 years",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    insurances: ["CNOPS", "CNSS", "Axa Assurance"],
    coordinates: { lat: 33.5731, lng: -7.5898 },
    distance: 0,
    availableSlots: [
      { date: "2025-04-06", slots: ["09:00", "11:30", "14:00"] },
      { date: "2025-04-07", slots: ["10:00", "15:30"] },
    ]
  }
];

// Available specialties
const specialties = [
  "All Specialties",
  "Cardiologist",
  "Dermatologist",
  "General Practitioner",
  "Gynecologist",
  "Neurologist",
  "Ophthalmologist",
  "Pediatrician",
  "Psychiatrist",
  "Urologist"
];

// Available languages
const languages = ["Arabic", "French", "English", "Amazigh", "Spanish"];

// Available insurances
const insurances = ["CNOPS", "CNSS", "RMA", "Saham Assurance", "Wafa Assurance", "Axa Assurance", "MGEN"];

const Doctors = () => {
  const { t, isRTL } = useTranslation();
  const { position, getPosition, error: geoError } = useGeolocation();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState(30); // in kilometers
  const [showAvailableToday, setShowAvailableToday] = useState(false);
  const [showAcceptingNew, setShowAcceptingNew] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
  // State for doctors data
  const [doctors, setDoctors] = useState(doctorsData);
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  
  // Set up fuse.js for fuzzy search
  const fuseOptions = {
    keys: ['name', 'specialty', 'location', 'languages', 'insurances'],
    threshold: 0.3
  };
  const fuse = new Fuse(doctors, fuseOptions);
  
  // Calculate distances when position changes
  useEffect(() => {
    if (position) {
      // Calculate distance for each doctor
      const doctorsWithDistance = doctors.map(doctor => {
        const distance = calculateDistance(
          position.latitude,
          position.longitude,
          doctor.coordinates.lat,
          doctor.coordinates.lng
        );
        return { ...doctor, distance };
      });
      
      // Sort by distance
      doctorsWithDistance.sort((a, b) => a.distance - b.distance);
      
      setDoctors(doctorsWithDistance);
    }
  }, [position]);
  
  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(1));
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  // Request user location
  const handleGetLocation = () => {
    getPosition()
      .then(() => {
        toast({
          title: "Location found",
          description: "We've found your location and updated doctor distances.",
          variant: "default",
        });
      })
      .catch((err) => {
        toast({
          title: "Location error",
          description: err.message,
          variant: "destructive",
        });
      });
  };
  
  // Filter doctors based on all criteria
  useEffect(() => {
    let results = [...doctors];
    
    // Apply search query if any
    if (searchQuery) {
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults.map(result => result.item);
    }
    
    // Apply specialty filter
    if (specialty !== "All Specialties") {
      results = results.filter(doctor => doctor.specialty === specialty);
    }
    
    // Apply language filter
    if (selectedLanguages.length > 0) {
      results = results.filter(doctor => 
        selectedLanguages.every(lang => doctor.languages.includes(lang))
      );
    }
    
    // Apply insurance filter
    if (selectedInsurances.length > 0) {
      results = results.filter(doctor => 
        selectedInsurances.some(ins => doctor.insurances.includes(ins))
      );
    }
    
    // Apply distance filter if location is available
    if (position) {
      results = results.filter(doctor => doctor.distance <= maxDistance);
    }
    
    // Apply availability filters
    if (showAvailableToday) {
      results = results.filter(doctor => doctor.availableToday);
    }
    
    if (showAcceptingNew) {
      results = results.filter(doctor => doctor.acceptingNewPatients);
    }
    
    setFilteredDoctors(results);
  }, [searchQuery, specialty, selectedLanguages, selectedInsurances, maxDistance, showAvailableToday, showAcceptingNew, doctors, position]);
  
  // Toggle language selection
  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(lang => lang !== language)
        : [...prev, language]
    );
  };
  
  // Toggle insurance selection
  const toggleInsurance = (insurance: string) => {
    setSelectedInsurances(prev => 
      prev.includes(insurance)
        ? prev.filter(ins => ins !== insurance)
        : [...prev, insurance]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSpecialty("All Specialties");
    setSelectedLanguages([]);
    setSelectedInsurances([]);
    setMaxDistance(30);
    setShowAvailableToday(false);
    setShowAcceptingNew(false);
  };
  
  // Book an appointment with a doctor
  const handleBookAppointment = (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (doctor) {
      toast({
        title: "Appointment Requested",
        description: `We're scheduling your appointment with ${doctor.name}.`,
        variant: "default",
      });
    }
  };
  
  // Call a doctor
  const handleCallDoctor = (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (doctor) {
      // In a real app, this would initiate a call
      console.log(`Calling ${doctor.name}...`);
      toast({
        title: "Initiating Call",
        description: `Connecting to ${doctor.name}...`,
        variant: "default",
      });
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('doctors.findDoctor')}
        </h1>
        
        {/* Search and filter section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('doctors.searchPlaceholder')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex-shrink-0">
                <Button 
                  onClick={handleGetLocation}
                  className="w-full md:w-auto"
                  variant="outline"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {t('doctors.useLocation')}
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">{t('doctors.basicFilters')}</TabsTrigger>
                <TabsTrigger value="advanced">{t('doctors.advancedFilters')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>{t('doctors.specialty')}</Label>
                    <Select 
                      value={specialty} 
                      onValueChange={setSpecialty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('doctors.selectSpecialty')} />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>{t('doctors.maxDistance')}</Label>
                    <div className="flex items-center mt-2">
                      <Slider
                        value={[maxDistance]}
                        min={1}
                        max={100}
                        step={1}
                        onValueChange={(vals) => setMaxDistance(vals[0])}
                        disabled={!position}
                        className="flex-1 mr-4"
                      />
                      <span className="w-16 text-right">{maxDistance} km</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center space-x-2 mb-2">
                      <Switch
                        id="available-today"
                        checked={showAvailableToday}
                        onCheckedChange={setShowAvailableToday}
                      />
                      <Label htmlFor="available-today">{t('doctors.availableToday')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="accepting-new"
                        checked={showAcceptingNew}
                        onCheckedChange={setShowAcceptingNew}
                      />
                      <Label htmlFor="accepting-new">{t('doctors.acceptingNewPatients')}</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="mb-2 block">{t('doctors.languages')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((language) => (
                        <Badge
                          key={language}
                          variant={selectedLanguages.includes(language) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleLanguage(language)}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">{t('doctors.insurances')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {insurances.map((insurance) => (
                        <Badge
                          key={insurance}
                          variant={selectedInsurances.includes(insurance) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleInsurance(insurance)}
                        >
                          {insurance}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={resetFilters}
              >
                {t('doctors.resetFilters')}
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  {t('doctors.listView')}
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  {t('doctors.mapView')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Results section */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {filteredDoctors.length} {t('doctors.resultsFound')}
          </h2>
          
          {position && (
            <div className="text-sm text-gray-500">
              <MapPin className="inline-block h-4 w-4 mr-1" />
              {t('doctors.sortedByDistance')}
            </div>
          )}
        </div>
        
        {/* View modes */}
        {viewMode === "list" ? (
          <div className="space-y-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="md:w-1/4 flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-2">
                          <img src={doctor.avatar} alt={doctor.name} />
                        </Avatar>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({doctor.reviewCount})</span>
                        </div>
                        {doctor.availableToday && (
                          <Badge className="mt-2 bg-green-500">
                            {t('doctors.availableToday')}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="md:w-2/4">
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.specialty}</p>
                        
                        <div className="mt-2 flex items-start gap-1">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm">{doctor.address}</p>
                            {position && (
                              <p className="text-sm text-gray-500">
                                {doctor.distance} km {t('doctors.fromYou')}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-1">
                          {doctor.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm">
                            <span className="font-medium">{t('doctors.education')}:</span> {doctor.education}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">{t('doctors.experience')}:</span> {doctor.experience}
                          </p>
                        </div>
                      </div>
                      
                      <div className="md:w-1/4 flex flex-col gap-2">
                        <Button 
                          className="w-full bg-medical-blue hover:bg-medical-blue/90"
                          onClick={() => handleBookAppointment(doctor.id)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {t('doctors.bookAppointment')}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleCallDoctor(doctor.id)}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          {t('doctors.callDoctor')}
                        </Button>
                        
                        <Button variant="outline" className="w-full">
                          <Video className="mr-2 h-4 w-4" />
                          {t('doctors.videoConsult')}
                        </Button>
                        
                        {doctor.availableToday && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-green-600">{t('doctors.todaySlots')}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {doctor.availableSlots[0].slots.map((slot) => (
                                <Badge
                                  key={slot}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-green-50"
                                >
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{t('doctors.noResults')}</h3>
                <p className="text-gray-500 mt-1">{t('doctors.tryDifferentFilters')}</p>
                <Button onClick={resetFilters} className="mt-4">
                  {t('doctors.resetFilters')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <LocationMap />
            <div className="mt-2 text-center text-sm text-gray-500">
              {t('doctors.mapViewDescription')}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctors;
