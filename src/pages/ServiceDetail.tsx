
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Activity, Check, Heart, Pill, Watch, Clock, Users, Award, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Service types
const serviceTypes = {
  "homecare": {
    title: "Home Care",
    description: "Professional healthcare services delivered in the comfort of your home.",
    icon: Heart,
    features: [
      "Skilled nursing care",
      "Physical therapy",
      "Medication management",
      "Personal care assistance",
      "Care coordination"
    ],
    image: "/placeholder.svg",
    providers: 28,
    rating: 4.8,
    reviews: 356,
    price: "From 300 MAD"
  },
  "physiotherapy": {
    title: "Physiotherapy",
    description: "Expert physical therapy to help you recover, strengthen, and prevent injury.",
    icon: Activity,
    features: [
      "Musculoskeletal assessment",
      "Rehabilitation exercises",
      "Pain management techniques",
      "Sports injury treatment",
      "Post-surgery recovery"
    ],
    image: "/placeholder.svg",
    providers: 32,
    rating: 4.7,
    reviews: 289,
    price: "From 250 MAD"
  },
  "blood-test": {
    title: "Blood Test",
    description: "Professional blood sample collection and laboratory testing at home.",
    icon: Activity,
    features: [
      "No appointment needed",
      "Same-day service available",
      "Results within 24-48 hours",
      "Digital results delivery",
      "Complete blood panel options"
    ],
    image: "/placeholder.svg",
    providers: 45,
    rating: 4.9,
    reviews: 412,
    price: "From 150 MAD"
  },
  "nursing": {
    title: "Nursing Care",
    description: "Professional nursing services provided by qualified healthcare professionals.",
    icon: Heart,
    features: [
      "Medication administration",
      "Wound care",
      "Vital signs monitoring",
      "Patient education",
      "Health status evaluation"
    ],
    image: "/placeholder.svg",
    providers: 36,
    rating: 4.8,
    reviews: 324,
    price: "From 280 MAD"
  },
  "emergency": {
    title: "Emergency Care",
    description: "Immediate medical assistance for urgent situations.",
    icon: Clock,
    features: [
      "24/7 availability",
      "Quick response times",
      "Qualified emergency personnel",
      "Life-saving interventions",
      "Direct hospital transfer"
    ],
    image: "/placeholder.svg",
    providers: 18,
    rating: 4.9,
    reviews: 203,
    price: "From 500 MAD"
  },
  "ambulance": {
    title: "Ambulance Service",
    description: "Professional medical transport with equipped ambulances and trained staff.",
    icon: Watch,
    features: [
      "24/7 availability",
      "Equipped ambulances",
      "Trained paramedics",
      "Emergency & non-emergency transport",
      "Inter-hospital transfers"
    ],
    image: "/placeholder.svg",
    providers: 12,
    rating: 4.7,
    reviews: 178,
    price: "From 600 MAD"
  },
  "teleconsultation": {
    title: "Teleconsultation",
    description: "Connect with healthcare professionals through secure video or audio calls.",
    icon: Watch,
    features: [
      "Available 24/7",
      "No travel needed",
      "Secure and private",
      "Prescription services",
      "Follow-up care"
    ],
    image: "/placeholder.svg",
    providers: 54,
    rating: 4.6,
    reviews: 426,
    price: "From 100 MAD"
  }
};

// Sample pros
const professionals = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Physician",
    rating: 4.9,
    reviews: 127,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    location: "Casablanca",
    available: true
  },
  {
    id: 2,
    name: "Dr. Mohammed Alami",
    specialty: "Cardiologist",
    rating: 4.8,
    reviews: 94,
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    location: "Rabat",
    available: true
  },
  {
    id: 3,
    name: "Dr. Fatima Benani",
    specialty: "Pediatrician",
    rating: 4.7,
    reviews: 83,
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    location: "Marrakech",
    available: false
  }
];

const ServiceDetail = () => {
  const { t, isRTL } = useTranslation();
  const { serviceType } = useParams<{ serviceType: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  
  useEffect(() => {
    // Get service details based on the URL parameter
    if (serviceType && serviceType in serviceTypes) {
      setService(serviceTypes[serviceType as keyof typeof serviceTypes]);
    } else {
      // Redirect to services page if service type is invalid
      navigate("/services");
      toast({
        title: "Service not found",
        description: "The requested service does not exist.",
        variant: "destructive",
      });
    }
  }, [serviceType, navigate]);
  
  const handleBookService = () => {
    toast({
      title: "Service Booked!",
      description: "We'll contact you shortly to confirm your appointment.",
      variant: "default",
    });
  };
  
  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Loading service details...</h1>
        </div>
      </div>
    );
  }
  
  const ServiceIcon = service.icon;
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Service Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-50 p-6 rounded-full">
                <ServiceIcon className="h-12 w-12 text-medical-blue" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{t(`services.${serviceType}`) || service.title}</h1>
                <p className="text-gray-600 mt-2">{t(`services.${serviceType}Desc`) || service.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{service.providers} {t('serviceDetail.providers')}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>{service.rating} ({service.reviews} {t('serviceDetail.reviews')})</span>
                  </div>
                  
                  <Badge variant="outline" className="text-lg font-medium">
                    {service.price}
                  </Badge>
                </div>
              </div>
              
              <Button
                className="bg-medical-blue hover:bg-medical-blue/90 w-full md:w-auto mt-4 md:mt-0"
                size="lg"
                onClick={handleBookService}
              >
                {t('serviceDetail.bookNow')}
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{t('serviceDetail.aboutService')}</CardTitle>
                  <CardDescription>{t('serviceDetail.whatToExpect')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>
                      {t(`serviceDetail.${serviceType}Long`) || 
                        "Our professional healthcare service brings expert care directly to you. We understand that health needs can arise at any time, which is why we're committed to providing convenient, high-quality care that fits your schedule and needs."}
                    </p>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-3">{t('serviceDetail.features')}</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>{t(`serviceDetail.${serviceType}Feature${index+1}`) || feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-3">{t('serviceDetail.howItWorks')}</h3>
                    <ol className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-medical-blue text-white font-bold mr-3 mt-0.5">1</div>
                        <div>
                          <p className="font-medium">{t('serviceDetail.step1Title')}</p>
                          <p className="text-gray-600">{t('serviceDetail.step1Desc')}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-medical-blue text-white font-bold mr-3 mt-0.5">2</div>
                        <div>
                          <p className="font-medium">{t('serviceDetail.step2Title')}</p>
                          <p className="text-gray-600">{t('serviceDetail.step2Desc')}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-medical-blue text-white font-bold mr-3 mt-0.5">3</div>
                        <div>
                          <p className="font-medium">{t('serviceDetail.step3Title')}</p>
                          <p className="text-gray-600">{t('serviceDetail.step3Desc')}</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('serviceDetail.frequentlyAsked')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{t('serviceDetail.faq1Title')}</h4>
                      <p className="text-gray-600 mt-1">{t('serviceDetail.faq1Answer')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('serviceDetail.faq2Title')}</h4>
                      <p className="text-gray-600 mt-1">{t('serviceDetail.faq2Answer')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('serviceDetail.faq3Title')}</h4>
                      <p className="text-gray-600 mt-1">{t('serviceDetail.faq3Answer')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column */}
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{t('serviceDetail.availableProfessionals')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {professionals.map((pro) => (
                      <div 
                        key={pro.id} 
                        className="p-3 border rounded-lg flex items-start space-x-3 hover:border-medical-blue cursor-pointer transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <img 
                            src={pro.image} 
                            alt={pro.name}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{pro.name}</p>
                          <p className="text-sm text-gray-500">{pro.specialty}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm ml-1">{pro.rating} ({pro.reviews})</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {pro.location}
                          </div>
                        </div>
                        <Badge 
                          variant={pro.available ? "default" : "outline"}
                          className={pro.available ? "bg-green-500" : ""}
                        >
                          {pro.available ? t('serviceDetail.available') : t('serviceDetail.unavailable')}
                        </Badge>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => navigate("/doctors")}
                    >
                      {t('serviceDetail.viewAllProfessionals')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('serviceDetail.bookService')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-medical-blue hover:bg-medical-blue/90"
                      onClick={handleBookService}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {t('serviceDetail.scheduleAppointment')}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Award className="mr-2 h-4 w-4" />
                      {t('serviceDetail.learnMore')}
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">{t('serviceDetail.contactUs')}</h4>
                    <p className="text-sm text-gray-500">
                      {t('serviceDetail.contactInfo')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;
