
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Phone, Calendar, Clock } from "lucide-react";

const Doctors = () => {
  const { t, isRTL } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Sample specializations
  const specializations = [
    "Cardiology", "Dermatology", "Gastroenterology", "Neurology", 
    "Orthopedics", "Pediatrics", "Psychiatry", "Urology"
  ];

  // Sample doctor data
  const doctors = [
    {
      id: 1,
      name: "Dr. Emma Thompson",
      specialization: "Cardiology",
      location: "Medical Center, 123 Health St",
      rating: 4.9,
      experience: "15 years",
      consultationFee: "$120",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      reviews: 120,
      availability: ["Mon", "Wed", "Fri"],
      languages: ["English", "French"]
    },
    {
      id: 2,
      name: "Dr. David Chen",
      specialization: "Dermatology",
      location: "Skin & Beauty Clinic, 456 Care Ave",
      rating: 4.7,
      experience: "10 years",
      consultationFee: "$100",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      reviews: 98,
      availability: ["Tue", "Thu", "Sat"],
      languages: ["English", "Chinese"]
    },
    {
      id: 3,
      name: "Dr. Sarah Martinez",
      specialization: "Pediatrics",
      location: "Children's Health Clinic, 789 Kid St",
      rating: 5.0,
      experience: "12 years",
      consultationFee: "$110",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      reviews: 150,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      languages: ["English", "Spanish"]
    },
    {
      id: 4,
      name: "Dr. Michael Johnson",
      specialization: "Orthopedics",
      location: "Bone & Joint Center, 321 Muscle Rd",
      rating: 4.6,
      experience: "20 years",
      consultationFee: "$150",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      reviews: 210,
      availability: ["Mon", "Wed", "Fri"],
      languages: ["English"]
    },
    {
      id: 5,
      name: "Dr. Lisa Wang",
      specialization: "Neurology",
      location: "Brain Health Institute, 555 Nerve Ave",
      rating: 4.8,
      experience: "18 years",
      consultationFee: "$160",
      image: "https://randomuser.me/api/portraits/women/40.jpg",
      reviews: 185,
      availability: ["Mon", "Thu", "Fri"],
      languages: ["English", "Mandarin"]
    },
    {
      id: 6,
      name: "Dr. Robert Smith",
      specialization: "Gastroenterology",
      location: "Digestive Health Center, 777 Gut Blvd",
      rating: 4.5,
      experience: "14 years",
      consultationFee: "$130",
      image: "https://randomuser.me/api/portraits/men/53.jpg",
      reviews: 112,
      availability: ["Tue", "Wed", "Thu"],
      languages: ["English", "German"]
    }
  ];

  // Filter doctors based on search and selected filter
  const filteredDoctors = doctors.filter(doctor => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilter === null || doctor.specialization === selectedFilter)
    );
  });

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('nav.doctors')}
        </h1>

        {/* Search and filter section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="relative mb-4">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
            <Input
              type="text"
              placeholder={t('doctors.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {specializations.map((specialization) => (
              <Badge
                key={specialization}
                variant={selectedFilter === specialization ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleFilterChange(specialization)}
              >
                {specialization}
              </Badge>
            ))}
          </div>
        </div>

        {/* Doctors list */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="list" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="list">{t('doctors.listView')}</TabsTrigger>
              <TabsTrigger value="map">{t('doctors.mapView')}</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              <div className="space-y-6">
                {filteredDoctors.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">{t('doctors.noDoctorsFound')}</p>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="md:flex">
                          <div className="md:w-1/4 h-48 md:h-auto bg-gray-200 relative">
                            <img 
                              src={doctor.image} 
                              alt={doctor.name} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center text-xs font-medium text-yellow-600">
                              <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                              {doctor.rating}
                            </div>
                          </div>
                          
                          <div className="p-4 md:p-6 md:w-3/4">
                            <div className="md:flex justify-between items-start">
                              <div>
                                <h2 className="text-xl font-bold mb-1">{doctor.name}</h2>
                                <p className="text-gray-600 mb-2">{doctor.specialization}</p>
                                <div className="flex items-center text-gray-500 mb-1 text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {doctor.location}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline" className="bg-gray-100">
                                    {doctor.experience} exp
                                  </Badge>
                                  <Badge variant="outline" className="bg-gray-100">
                                    {doctor.reviews} reviews
                                  </Badge>
                                  {doctor.languages.map(lang => (
                                    <Badge key={lang} variant="outline" className="bg-gray-100">
                                      {lang}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-4 md:mt-0 md:text-right">
                                <p className="text-sm text-gray-500 mb-1">{t('doctors.consultationFee')}</p>
                                <p className="text-lg font-bold text-medical-blue mb-3">{doctor.consultationFee}</p>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {doctor.availability.map(day => (
                                    <Badge key={day} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                      {day}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              <Button 
                                size="sm" 
                                className="bg-medical-blue hover:bg-medical-blue/90 flex items-center gap-1"
                              >
                                <Calendar className="h-4 w-4" />
                                {t('doctors.bookAppointment')}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center gap-1"
                              >
                                <Phone className="h-4 w-4" />
                                {t('doctors.callNow')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardContent className="p-6">
                  <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">{t('doctors.mapViewPlaceholder')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Doctors;
