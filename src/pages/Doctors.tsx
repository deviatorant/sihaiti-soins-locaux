import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useDoctors } from "@/hooks/useDoctors";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Phone, 
  Video, 
  Filter, 
  Bookmark,
  User,
  LocateFixed
} from "lucide-react";
import DoctorProfileModal from "@/components/DoctorProfileModal";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";

const Doctors = () => {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
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
  } = useDoctors();
  const { position, getPosition, positionError } = useGeolocation();
  
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    getPosition();
  }, []);
  
  useEffect(() => {
    if (selectedDoctor) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [selectedDoctor]);
  
  const handleDoctorClick = (doctor: any) => {
    setSelectedDoctor(doctor);
  };
  
  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };
  
  const handleBookAppointment = (doctorId: string) => {
    if (!user) {
      toast({
        title: t('login.loginRequired'),
        description: t('login.loginToBook'),
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate(`/appointments?doctor=${doctorId}`);
  };
  
  const handleCallDoctor = (doctorId: string) => {
    if (!user) {
      toast({
        title: t('login.loginRequired'),
        description: t('login.loginToCall'),
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    toast({
      title: t('doctors.callingDoctor'),
      description: t('doctors.connectingCall'),
      variant: "default",
    });
  };
  
  const handleVideoConsult = (doctorId: string) => {
    if (!user) {
      toast({
        title: t('login.loginRequired'),
        description: t('login.loginToVideoConsult'),
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate(`/teleconsultation?doctor=${doctorId}`);
  };
  
  const renderDoctorCard = (doctor: any) => (
    <Card 
      key={doctor.id} 
      className="mb-4 overflow-hidden hover:shadow-md transition-shadow"
      onClick={() => handleDoctorClick(doctor)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:w-1/4 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <img src={doctor.avatar} alt={doctor.name} />
            </Avatar>
            
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-semibold">{doctor.rating}</span>
              <span className="text-gray-500 text-sm ml-1">({doctor.reviews})</span>
            </div>
            
            {doctor.verified && (
              <Badge variant="outline" className="mt-2 border-blue-500 text-blue-500">
                {t('doctors.verified')}
              </Badge>
            )}
            
            {doctor.availableToday && (
              <Badge className="mt-2 bg-green-500 hover:bg-green-600">
                {t('doctors.availableToday')}
              </Badge>
            )}
          </div>
          
          <div className="p-4 md:w-2/4 border-t md:border-t-0 md:border-l border-r-0 md:border-r border-gray-200">
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <p className="text-gray-500">{doctor.specialty}</p>
            
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-600">{doctor.location}</span>
            </div>
            
            {doctor.distance !== undefined && (
              <p className="text-sm text-gray-500 mt-1">
                {doctor.distance.toFixed(1)} km {t('doctors.fromYou')}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1 mt-3">
              {doctor.languages.map((lang: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="bg-gray-100">
                  {lang}
                </Badge>
              ))}
            </div>
            
            <div className="mt-3">
              <p className="text-sm font-medium">{t('doctors.education')}</p>
              <p className="text-sm text-gray-600">{doctor.education}</p>
            </div>
            
            <div className="mt-2">
              <p className="text-sm font-medium">{t('doctors.experience')}</p>
              <p className="text-sm text-gray-600">{doctor.experience}</p>
            </div>
          </div>
          
          <div className="p-4 md:w-1/4 bg-gray-50 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium">{t('doctors.consultationFee')}</p>
              <p className="text-lg font-bold text-medical-blue">{doctor.consultationFee} MAD</p>
            </div>
            
            <div className="space-y-2 mt-4">
              <Button
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookAppointment(doctor.id);
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {t('doctors.bookAppointment')}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCallDoctor(doctor.id);
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                {t('doctors.callDoctor')}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVideoConsult(doctor.id);
                }}
              >
                <Video className="mr-2 h-4 w-4" />
                {t('doctors.videoConsult')}
              </Button>
            </div>
            
            {doctor.availableToday && doctor.availableSlots && doctor.availableSlots.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">{t('doctors.todaySlots')}</p>
                <div className="flex flex-wrap gap-1">
                  {doctor.availableSlots.slice(0, 3).map((slot: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="bg-white">
                      {slot}
                    </Badge>
                  ))}
                  {doctor.availableSlots.length > 3 && (
                    <Badge variant="outline" className="bg-white">
                      +{doctor.availableSlots.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('doctors.title')}</h1>
            <p className="text-gray-500">
              {filteredDoctors.length} {t('doctors.resultsFound')}
            </p>
          </div>
          
          <div className="flex mt-4 md:mt-0">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              className="mr-2"
              onClick={() => setViewMode("list")}
            >
              {t('doctors.listView')}
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
            >
              {t('doctors.mapView')}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className={`${isFiltersOpen ? 'block' : 'hidden md:block'} md:w-1/4 bg-white p-4 rounded-lg shadow-sm`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">{t('doctors.filters')}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={() => setIsFiltersOpen(false)}
              >
                {t('common.close')}
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('doctors.specialty')}
                </label>
                <Select value={filterBySpecialty} onValueChange={setFilterBySpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('doctors.allSpecialties')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('doctors.allSpecialties')}</SelectItem>
                    <SelectItem value="General Practitioner">{t('doctors.generalPractitioner')}</SelectItem>
                    <SelectItem value="Pediatrician">{t('doctors.pediatrician')}</SelectItem>
                    <SelectItem value="Cardiologist">{t('doctors.cardiologist')}</SelectItem>
                    <SelectItem value="Dermatologist">{t('doctors.dermatologist')}</SelectItem>
                    <SelectItem value="Gynecologist">{t('doctors.gynecologist')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('doctors.language')}
                </label>
                <Select value={filterByLanguage} onValueChange={setFilterByLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('doctors.allLanguages')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('doctors.allLanguages')}</SelectItem>
                    <SelectItem value="Arabic">{t('doctors.arabic')}</SelectItem>
                    <SelectItem value="French">{t('doctors.french')}</SelectItem>
                    <SelectItem value="English">{t('doctors.english')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('doctors.distance')}
                </label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">0 km</span>
                  <span className="text-sm text-gray-500">{searchRadius} km</span>
                </div>
                <Slider
                  value={[searchRadius]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(values) => setSearchRadius(values[0])}
                  className="mb-2"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={getPosition}
                >
                  <LocateFixed className="mr-1 h-3 w-3" />
                  {t('doctors.useMyLocation')}
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="online-only" className="text-sm font-medium">
                    {t('doctors.onlineOnly')}
                  </label>
                  <Switch
                    id="online-only"
                    checked={showOnlineOnly}
                    onCheckedChange={setShowOnlineOnly}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="available-today" className="text-sm font-medium">
                    {t('doctors.availableTodayOnly')}
                  </label>
                  <Switch
                    id="available-today"
                    checked={showAvailableTodayOnly}
                    onCheckedChange={setShowAvailableTodayOnly}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('doctors.sortBy')}
                </label>
                <Select value={sortBy} onValueChange={value => setSortBy(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('doctors.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">{t('doctors.distance')}</SelectItem>
                    <SelectItem value="rating">{t('doctors.rating')}</SelectItem>
                    <SelectItem value="price">{t('doctors.price')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('doctors.searchPlaceholder')}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {filterBySpecialty !== 'all' && (
                  <Badge variant="secondary" className="bg-gray-100">
                    {filterBySpecialty}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setFilterBySpecialty('all')}
                    >
                      &times;
                    </Button>
                  </Badge>
                )}
                
                {filterByLanguage !== 'all' && (
                  <Badge variant="secondary" className="bg-gray-100">
                    {filterByLanguage}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setFilterByLanguage('all')}
                    >
                      &times;
                    </Button>
                  </Badge>
                )}
                
                {showOnlineOnly && (
                  <Badge variant="secondary" className="bg-gray-100">
                    {t('doctors.onlineOnly')}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setShowOnlineOnly(false)}
                    >
                      &times;
                    </Button>
                  </Badge>
                )}
                
                {showAvailableTodayOnly && (
                  <Badge variant="secondary" className="bg-gray-100">
                    {t('doctors.availableTodayOnly')}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setShowAvailableTodayOnly(false)}
                    >
                      &times;
                    </Button>
                  </Badge>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 md:hidden"
                onClick={() => setIsFiltersOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {t('doctors.showFilters')}
              </Button>
            </div>
            
            <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "list" | "map")}>
              <TabsContent value="list" className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex animate-pulse">
                          <div className="w-1/4 flex justify-center">
                            <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
                          </div>
                          <div className="w-3/4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredDoctors.length > 0 ? (
                  filteredDoctors.map(renderDoctorCard)
                ) : (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">{t('doctors.noResults')}</h3>
                    <p className="text-gray-500">{t('doctors.tryDifferentFilters')}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="map">
                <Card>
                  <CardContent className="p-4">
                    <div className="rounded overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: "500px" }}>
                      <p className="text-gray-500">
                        {t('doctors.mapViewComingSoon')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {selectedDoctor && (
        <DoctorProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          doctor={selectedDoctor}
          onBookAppointment={() => handleBookAppointment(selectedDoctor.id)}
          onCallDoctor={() => handleCallDoctor(selectedDoctor.id)}
          onVideoConsult={() => handleVideoConsult(selectedDoctor.id)}
        />
      )}
    </div>
  );
};

export default Doctors;
