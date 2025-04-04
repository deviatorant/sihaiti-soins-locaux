
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import LocationMap from "@/components/LocationMap";
import Fuse from "fuse.js";
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  MessageCircle,
  Globe,
  CreditCard,
  CheckCircle2
} from "lucide-react";

// Sample doctor data (in a real app, this would come from a database)
const DOCTORS_DATA = [
  {
    id: "dr-1",
    name: "Dr. Sarah Benali",
    specialty: "Cardiology",
    subSpecialty: "Interventional Cardiology",
    languages: ["Arabic", "French", "English"],
    address: "123 Medical Center, Casablanca",
    availability: ["Monday", "Wednesday", "Friday"],
    immediate: true,
    insurance: ["CNOPS", "CNSS", "Private"],
    rating: 4.8,
    reviewCount: 56,
    latitude: 33.5731,
    longitude: -7.5898,
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    price: 400,
    waitTime: "2-3 days"
  },
  {
    id: "dr-2",
    name: "Dr. Mohammed El Amrani",
    specialty: "Pediatrics",
    subSpecialty: "Neonatology",
    languages: ["Arabic", "French"],
    address: "456 Children's Clinic, Rabat",
    availability: ["Monday", "Tuesday", "Thursday"],
    immediate: false,
    insurance: ["CNOPS", "Private"],
    rating: 4.9,
    reviewCount: 94,
    latitude: 34.0209,
    longitude: -6.8416,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    price: 350,
    waitTime: "1 week"
  },
  {
    id: "dr-3",
    name: "Dr. Laila Tazi",
    specialty: "Dermatology",
    subSpecialty: "Cosmetic Dermatology",
    languages: ["Arabic", "French", "English", "Spanish"],
    address: "789 Skin Health Center, Marrakech",
    availability: ["Tuesday", "Thursday", "Saturday"],
    immediate: true,
    insurance: ["CNOPS", "CNSS", "Private"],
    rating: 4.7,
    reviewCount: 73,
    latitude: 31.6295,
    longitude: -7.9811,
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    price: 450,
    waitTime: "Same day"
  },
  {
    id: "dr-4",
    name: "Dr. Karim Berrada",
    specialty: "Orthopedics",
    subSpecialty: "Sports Medicine",
    languages: ["Arabic", "French", "English"],
    address: "101 Bone & Joint Clinic, Tangier",
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
    immediate: false,
    insurance: ["CNSS", "Private"],
    rating: 4.6,
    reviewCount: 48,
    latitude: 35.7595,
    longitude: -5.8340,
    image: "https://randomuser.me/api/portraits/men/72.jpg",
    price: 500,
    waitTime: "3-4 days"
  },
  {
    id: "dr-5",
    name: "Dr. Fatima Zahra El Mansouri",
    specialty: "Obstetrics & Gynecology",
    subSpecialty: "Maternal-Fetal Medicine",
    languages: ["Arabic", "French", "English"],
    address: "202 Women's Health Center, Agadir",
    availability: ["Monday", "Tuesday", "Thursday", "Friday"],
    immediate: true,
    insurance: ["CNOPS", "CNSS", "Private"],
    rating: 4.9,
    reviewCount: 129,
    latitude: 30.4278,
    longitude: -9.5981,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    price: 400,
    waitTime: "2 days"
  }
];

// List of medical specialties
const SPECIALTIES = [
  { id: "cardiology", name: "Cardiology" },
  { id: "dermatology", name: "Dermatology" },
  { id: "neurology", name: "Neurology" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "obstetrics", name: "Obstetrics & Gynecology" },
  { id: "ophthalmology", name: "Ophthalmology" },
  { id: "psychiatry", name: "Psychiatry" },
  { id: "urology", name: "Urology" },
  { id: "general", name: "General Medicine" },
];

// Languages commonly spoken in Morocco
const LANGUAGES = [
  { id: "arabic", name: "Arabic" },
  { id: "french", name: "French" },
  { id: "english", name: "English" },
  { id: "spanish", name: "Spanish" },
  { id: "amazigh", name: "Amazigh" },
];

// Insurance providers
const INSURANCE = [
  { id: "cnops", name: "CNOPS" },
  { id: "cnss", name: "CNSS" },
  { id: "private", name: "Private Insurance" },
];

// Calculate distance between two points in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

const Doctors = () => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const { position, getPosition, error: geoError } = useGeolocation();
  const { toast } = useToast();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<string[]>([]);
  const [searchRadius, setSearchRadius] = useState<number[]>([10]);
  const [immediateOnly, setImmediateOnly] = useState(false);
  const [distanceSortEnabled, setDistanceSortEnabled] = useState(false);
  
  // Get user location
  const handleGetLocation = async () => {
    try {
      await getPosition();
      toast({
        title: t('doctors.locationFound'),
        description: t('doctors.searchingNearby'),
        variant: "success",
      });
      setDistanceSortEnabled(true);
    } catch (error) {
      toast({
        title: t('doctors.locationError'),
        description: String(error) || t('doctors.enableLocation'),
        variant: "destructive",
      });
    }
  };
  
  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => 
    new Fuse(DOCTORS_DATA, {
      keys: [
        'name', 
        'specialty',
        'subSpecialty',
        'languages',
        'address'
      ],
      threshold: 0.3,
      includeScore: true
    }), 
    []
  );
  
  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    let results = [...DOCTORS_DATA];
    
    // Apply text search if query exists
    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults.map(result => result.item);
    }
    
    // Apply specialty filter
    if (selectedSpecialty) {
      results = results.filter(doctor => 
        doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }
    
    // Apply language filter
    if (selectedLanguages.length > 0) {
      results = results.filter(doctor => 
        selectedLanguages.every(lang => 
          doctor.languages.some(docLang => 
            docLang.toLowerCase().includes(lang.toLowerCase())
          )
        )
      );
    }
    
    // Apply insurance filter
    if (selectedInsurance.length > 0) {
      results = results.filter(doctor => 
        selectedInsurance.every(ins => 
          doctor.insurance.some(docIns => 
            docIns.toLowerCase().includes(ins.toLowerCase())
          )
        )
      );
    }
    
    // Apply immediate availability filter
    if (immediateOnly) {
      results = results.filter(doctor => doctor.immediate);
    }
    
    // Apply distance filter and sorting if location is available
    if (position) {
      // Add distance to each doctor
      results = results.map(doctor => ({
        ...doctor,
        distance: calculateDistance(
          position.latitude, 
          position.longitude, 
          doctor.latitude, 
          doctor.longitude
        )
      }));
      
      // Filter by radius
      if (searchRadius[0] > 0) {
        results = results.filter(doctor => 
          (doctor as any).distance <= searchRadius[0]
        );
      }
      
      // Sort by distance if enabled
      if (distanceSortEnabled) {
        results.sort((a, b) => (a as any).distance - (b as any).distance);
      }
    }
    
    return results;
  }, [
    searchQuery, 
    selectedSpecialty, 
    selectedLanguages, 
    selectedInsurance, 
    immediateOnly, 
    position, 
    searchRadius, 
    distanceSortEnabled,
    fuse
  ]);

  // Handle language selection toggle
  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };
  
  // Handle insurance selection toggle
  const toggleInsurance = (insurance: string) => {
    setSelectedInsurance(prev => 
      prev.includes(insurance)
        ? prev.filter(i => i !== insurance)
        : [...prev, insurance]
    );
  };
  
  // Navigate to doctor profile
  const handleViewDoctor = (doctorId: string) => {
    navigate(`/doctors/${doctorId}`);
  };
  
  // Book appointment with doctor
  const handleBookAppointment = (doctorId: string) => {
    navigate(`/appointments/book/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('doctors.findDoctor')}
        </h1>
        
        {/* Search Bar */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
          <Input
            type="text"
            placeholder={t('doctors.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                {t('general.filters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">{t('doctors.location')}</h3>
                <Button
                  variant="outline"
                  onClick={handleGetLocation}
                  className="w-full justify-between"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {position 
                    ? t('doctors.updateLocation')
                    : t('doctors.useMyLocation')
                  }
                </Button>
                
                {position && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('doctors.searchRadius')}</span>
                      <span>{searchRadius[0]} km</span>
                    </div>
                    <Slider
                      min={1}
                      max={50}
                      step={1}
                      value={searchRadius}
                      onValueChange={setSearchRadius}
                    />
                  </div>
                )}
              </div>
              
              {/* Specialty Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">{t('doctors.specialty')}</h3>
                <Select
                  value={selectedSpecialty}
                  onValueChange={setSelectedSpecialty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('doctors.selectSpecialty')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('general.all')}</SelectItem>
                    {SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Language Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">{t('doctors.languages')}</h3>
                <div className="space-y-2">
                  {LANGUAGES.map((language) => (
                    <div key={language.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`language-${language.id}`}
                        checked={selectedLanguages.includes(language.id)}
                        onCheckedChange={() => toggleLanguage(language.id)}
                      />
                      <Label htmlFor={`language-${language.id}`}>{language.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Insurance Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">{t('doctors.insurance')}</h3>
                <div className="space-y-2">
                  {INSURANCE.map((insurance) => (
                    <div key={insurance.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`insurance-${insurance.id}`}
                        checked={selectedInsurance.includes(insurance.id)}
                        onCheckedChange={() => toggleInsurance(insurance.id)}
                      />
                      <Label htmlFor={`insurance-${insurance.id}`}>{insurance.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Availability Filter */}
              <div className="space-y-3">
                <h3 className="font-medium">{t('doctors.availability')}</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="immediate"
                    checked={immediateOnly}
                    onCheckedChange={(checked) => setImmediateOnly(!!checked)}
                  />
                  <Label htmlFor="immediate">{t('doctors.immediateAvailability')}</Label>
                </div>
              </div>
              
              {/* Reset Filters */}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("");
                  setSelectedLanguages([]);
                  setSelectedInsurance([]);
                  setSearchRadius([10]);
                  setImmediateOnly(false);
                  setDistanceSortEnabled(false);
                }}
              >
                {t('general.resetFilters')}
              </Button>
            </CardContent>
          </Card>
          
          {/* Results */}
          <div className="md:col-span-3 space-y-4">
            <Tabs defaultValue="list">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {filteredDoctors.length > 0 
                    ? t('doctors.foundDoctorsCount', { count: filteredDoctors.length })
                    : t('doctors.noDoctorsFound')
                  }
                </h2>
                <TabsList>
                  <TabsTrigger value="list">{t('general.list')}</TabsTrigger>
                  <TabsTrigger value="map">{t('general.map')}</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="list" className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Doctor Image */}
                        <div className="md:w-1/4 p-4 flex justify-center items-start">
                          <div className="relative">
                            <img 
                              src={doctor.image} 
                              alt={doctor.name}
                              className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md" 
                            />
                            {doctor.immediate && (
                              <Badge className="absolute bottom-0 right-0 bg-green-500">
                                {t('doctors.availableNow')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Doctor Info */}
                        <div className="md:w-2/4 p-4">
                          <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                          <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                          
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{doctor.rating}</span>
                            <span className="text-gray-500 text-sm ml-1">
                              ({doctor.reviewCount} {t('general.reviews')})
                            </span>
                            
                            {(doctor as any).distance && (
                              <span className="ml-3 text-sm flex items-center text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {(doctor as any).distance} km
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-start">
                              <Globe className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{doctor.languages.join(", ")}</span>
                            </div>
                            <div className="flex items-start">
                              <CreditCard className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{doctor.insurance.join(", ")}</span>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{doctor.address}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="md:w-1/4 bg-gray-50 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-500">{t('doctors.consultation')}</span>
                              <span className="font-bold text-medical-blue">{doctor.price} MAD</span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm text-gray-500">{t('doctors.waitTime')}</span>
                              <span className="text-sm">{doctor.waitTime}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleViewDoctor(doctor.id)}
                              variant="outline"
                              className="w-full"
                            >
                              <User className="h-4 w-4 mr-2" />
                              {t('doctors.viewProfile')}
                            </Button>
                            <Button
                              onClick={() => handleBookAppointment(doctor.id)}
                              className="w-full bg-medical-blue hover:bg-medical-blue/90"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              {t('doctors.bookAppointment')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredDoctors.length === 0 && (
                  <div className="text-center py-20">
                    <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      {t('doctors.noDoctorsFound')}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {t('doctors.tryAdjustingFilters')}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="map">
                <Card className="overflow-hidden">
                  <div className="h-[500px]">
                    <LocationMap />
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Doctors;
