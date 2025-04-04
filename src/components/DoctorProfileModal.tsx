
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  CalendarCheck, 
  MessageCircle, 
  Phone, 
  Video, 
  ChevronRight,
  ThumbsUp,
  Stethoscope,
  GraduationCap
} from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  languages: string[];
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  availableToday: boolean;
  acceptingNewPatients: boolean;
  education: string;
  experience: string;
  avatar: string;
  insurances: string[];
  coordinates: { lat: number; lng: number };
  distance: number;
  availableSlots: Array<{
    date: string;
    slots: string[];
  }>;
  reviews?: Array<{
    id: number;
    author: string;
    rating: number;
    date: string;
    comment: string;
    attributes?: {
      punctuality?: number;
      listening?: number;
      explanation?: number;
      cleanliness?: number;
      effectiveness?: number;
    };
  }>;
  verificationLevel?: "New" | "Verified" | "Recommended" | "Expert";
  about?: string;
  specializations?: string[];
  cabinet?: {
    images: string[];
    address: string;
    openingHours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
  };
}

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DoctorProfileModal = ({ doctor, open, onOpenChange }: DoctorProfileModalProps) => {
  const { t, isRTL } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  if (!doctor) return null;
  
  // Mock data for reviews if not provided
  const reviews = doctor.reviews || [
    {
      id: 1,
      author: "Ahmed M.",
      rating: 5,
      date: "2025-03-15",
      comment: "Dr. was very professional and knowledgeable. I felt very comfortable during my visit.",
      attributes: {
        punctuality: 5,
        listening: 5,
        explanation: 4,
        cleanliness: 5,
        effectiveness: 5
      }
    },
    {
      id: 2,
      author: "Fatima L.",
      rating: 4,
      date: "2025-03-01",
      comment: "Good experience overall. Doctor was a bit rushed but provided good care.",
      attributes: {
        punctuality: 3,
        listening: 4,
        explanation: 4,
        cleanliness: 5,
        effectiveness: 4
      }
    }
  ];
  
  // Get verification badge based on level
  const getVerificationBadge = () => {
    const level = doctor.verificationLevel || "Verified";
    
    switch (level) {
      case "New":
        return <Badge variant="outline">New</Badge>;
      case "Verified":
        return <Badge className="bg-blue-500">Verified</Badge>;
      case "Recommended":
        return <Badge className="bg-green-500">Recommended</Badge>;
      case "Expert":
        return <Badge className="bg-purple-500">Expert</Badge>;
      default:
        return <Badge variant="outline">Verified</Badge>;
    }
  };
  
  // Get available slots for selected date
  const getAvailableSlotsForDate = () => {
    if (!selectedDate) return [];
    
    const dateString = selectedDate.toISOString().split('T')[0];
    const daySlots = doctor.availableSlots.find(d => d.date === dateString);
    
    return daySlots ? daySlots.slots : [];
  };
  
  // Handle appointment booking
  const handleBookAppointment = () => {
    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        description: "You need to select a time for your appointment",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor.name} on ${selectedDate?.toLocaleDateString()} at ${selectedSlot} has been scheduled.`,
      variant: "default",
    });
    
    onOpenChange(false);
  };
  
  // Calculate average ratings
  const calculateAverageRating = (attribute: keyof typeof reviews[0]['attributes']) => {
    const validReviews = reviews.filter(r => r.attributes && r.attributes[attribute] !== undefined);
    if (validReviews.length === 0) return 0;
    
    const sum = validReviews.reduce((acc, review) => {
      return acc + (review.attributes?.[attribute] || 0);
    }, 0);
    
    return sum / validReviews.length;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{doctor.name}</DialogTitle>
          <DialogDescription>{doctor.specialty}</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profile">{t('doctors.profile')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('doctors.reviews')}</TabsTrigger>
            <TabsTrigger value="appointment">{t('doctors.appointment')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Doctor info section */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="h-32 w-32 mb-3">
                    <img src={doctor.avatar} alt={doctor.name} />
                  </Avatar>
                  
                  <div className="text-center">
                    {getVerificationBadge()}
                    
                    <div className="flex items-center justify-center mt-2">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-gray-500 ml-1">({doctor.reviewCount} {t('doctors.reviews')})</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{t('doctors.location')}</p>
                      <p className="text-gray-600">{doctor.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <GraduationCap className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{t('doctors.education')}</p>
                      <p className="text-gray-600">{doctor.education}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{t('doctors.experience')}</p>
                      <p className="text-gray-600">{doctor.experience}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">{t('doctors.languages')}</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">{t('doctors.insurances')}</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.insurances.map((insurance, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {insurance}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button className="w-full bg-medical-blue hover:bg-medical-blue/90">
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    {t('doctors.bookAppointment')}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('doctors.message')}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      {t('doctors.call')}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Video className="mr-2 h-4 w-4" />
                      {t('doctors.video')}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Main content section */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('doctors.about')}</h3>
                    <p className="text-gray-700">
                      {doctor.about || `Dr. ${doctor.name.split(' ')[1]} is a ${doctor.specialty} with ${doctor.experience} of experience. They provide comprehensive care for patients and are dedicated to improving health outcomes through personalized treatment plans.`}
                    </p>
                  </div>
                  
                  {doctor.specializations && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('doctors.specializations')}</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {doctor.specializations.map((spec, index) => (
                          <li key={index}>{spec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('doctors.workingHours')}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Monday:</span>
                        <span>{doctor.cabinet?.openingHours.monday || "9:00 - 17:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Tuesday:</span>
                        <span>{doctor.cabinet?.openingHours.tuesday || "9:00 - 17:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Wednesday:</span>
                        <span>{doctor.cabinet?.openingHours.wednesday || "9:00 - 17:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Thursday:</span>
                        <span>{doctor.cabinet?.openingHours.thursday || "9:00 - 17:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Friday:</span>
                        <span>{doctor.cabinet?.openingHours.friday || "9:00 - 17:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday:</span>
                        <span>{doctor.cabinet?.openingHours.saturday || "10:00 - 14:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday:</span>
                        <span>{doctor.cabinet?.openingHours.sunday || "Closed"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {doctor.cabinet?.images && doctor.cabinet.images.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('doctors.clinicPhotos')}</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {doctor.cabinet.images.map((image, index) => (
                          <img 
                            key={index} 
                            src={image} 
                            alt={`Clinic ${index+1}`}
                            className="rounded-md h-24 w-full object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('doctors.frequentlyAsked')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{t('doctors.faq1Question')}</p>
                        <p className="text-gray-600 text-sm">{t('doctors.faq1Answer')}</p>
                      </div>
                      <div>
                        <p className="font-medium">{t('doctors.faq2Question')}</p>
                        <p className="text-gray-600 text-sm">{t('doctors.faq2Answer')}</p>
                      </div>
                      <div>
                        <p className="font-medium">{t('doctors.faq3Question')}</p>
                        <p className="text-gray-600 text-sm">{t('doctors.faq3Answer')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-5xl font-bold text-medical-blue mb-1">{doctor.rating}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(doctor.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-gray-500">{doctor.reviewCount} {t('doctors.reviews')}</p>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('doctors.punctuality')}</span>
                        <span className="text-sm font-medium">{calculateAverageRating('punctuality')}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(calculateAverageRating('punctuality')/5)*100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('doctors.listening')}</span>
                        <span className="text-sm font-medium">{calculateAverageRating('listening')}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(calculateAverageRating('listening')/5)*100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('doctors.explanation')}</span>
                        <span className="text-sm font-medium">{calculateAverageRating('explanation')}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(calculateAverageRating('explanation')/5)*100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('doctors.cleanliness')}</span>
                        <span className="text-sm font-medium">{calculateAverageRating('cleanliness')}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(calculateAverageRating('cleanliness')/5)*100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('doctors.effectiveness')}</span>
                        <span className="text-sm font-medium">{calculateAverageRating('effectiveness')}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(calculateAverageRating('effectiveness')/5)*100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{review.author}</div>
                            <div className="text-gray-500 text-sm">
                              {new Date(review.date).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                                fill="currentColor"
                              />
                            ))}
                          </div>
                          
                          <p className="text-gray-700">{review.comment}</p>
                          
                          <div className="flex justify-end mt-3">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {t('doctors.helpful')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      {t('doctors.loadMoreReviews')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appointment">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">{t('doctors.selectDate')}</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  disabled={(date) => {
                    // Disable dates in the past
                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                  }}
                />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">{t('doctors.selectTime')}</h3>
                
                <div className="flex flex-wrap gap-2">
                  {getAvailableSlotsForDate().length > 0 ? (
                    getAvailableSlotsForDate().map((slot, index) => (
                      <Button
                        key={index}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className={selectedSlot === slot ? "bg-medical-blue" : ""}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))
                  ) : (
                    <p className="text-gray-500 py-4">{t('doctors.noAvailableSlots')}</p>
                  )}
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold mb-3">{t('doctors.appointmentType')}</h3>
                  
                  <div className="space-y-2">
                    <div className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-medical-blue">
                      <div className="flex items-center">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <Stethoscope className="h-5 w-5 text-medical-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{t('doctors.inPerson')}</p>
                          <p className="text-sm text-gray-500">{t('doctors.inPersonDesc')}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-medical-blue">
                      <div className="flex items-center">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <Video className="h-5 w-5 text-medical-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{t('doctors.videoConsultation')}</p>
                          <p className="text-sm text-gray-500">{t('doctors.videoDesc')}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">{t('doctors.appointmentSummary')}</h3>
                  {selectedDate && selectedSlot && (
                    <p className="text-gray-600">
                      {selectedDate.toLocaleDateString()} at {selectedSlot}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{t('doctors.consultationFee')}</p>
                  <p className="text-xl font-bold text-medical-blue">300 MAD</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
                onClick={handleBookAppointment}
                disabled={!selectedSlot}
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                {t('doctors.confirmAppointment')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('general.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorProfileModal;
