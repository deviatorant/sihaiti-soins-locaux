
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Calendar, Home, Droplets, Activity, Heart } from "lucide-react";
import LocationMap from "@/components/LocationMap";

const HomeCare = () => {
  const { t, isRTL } = useTranslation();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // Home care services
  const services = [
    { 
      id: "blood-test", 
      name: t('services.bloodTest'), 
      description: t('services.bloodTestDesc'),
      icon: Droplets,
      price: "$50",
      duration: "30 min"
    },
    { 
      id: "nursing", 
      name: t('services.nursing'), 
      description: t('services.nursingDesc'),
      icon: Heart,
      price: "$80/hour",
      duration: "1-2 hours"
    },
    { 
      id: "physiotherapy", 
      name: t('services.physiotherapy'), 
      description: t('services.physiotherapyDesc'),
      icon: Activity,
      price: "$90/session",
      duration: "45-60 min"
    },
    { 
      id: "homecare", 
      name: t('services.homecare'), 
      description: t('services.homecareDesc'),
      icon: Home,
      price: "$70/hour",
      duration: "As needed"
    }
  ];

  // Sample healthcare professionals
  const professionals = [
    { id: 1, name: "Sarah Johnson", role: "Registered Nurse", rating: 4.9, image: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 2, name: "Michael Chen", role: "Phlebotomist", rating: 4.8, image: "https://randomuser.me/api/portraits/men/42.jpg" },
    { id: 3, name: "Rebecca Martinez", role: "Physiotherapist", rating: 5.0, image: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: 4, name: "David Wilson", role: "Home Health Aide", rating: 4.7, image: "https://randomuser.me/api/portraits/men/76.jpg" }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      service: selectedService,
      address,
      date,
      time,
      notes
    });
    
    // Here would be the actual booking logic
    alert(t('homecare.bookingSuccess'));
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('homecare.title')}
        </h1>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="services" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="services">{t('homecare.services')}</TabsTrigger>
              <TabsTrigger value="providers">{t('homecare.providers')}</TabsTrigger>
              <TabsTrigger value="how-it-works">{t('homecare.howItWorks')}</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Service list */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('homecare.selectService')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {services.map((service) => (
                          <div 
                            key={service.id} 
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedService === service.id 
                                ? 'border-medical-green bg-green-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleServiceSelect(service.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-white p-2 rounded-full">
                                <service.icon className="h-5 w-5 text-medical-green" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{service.name}</h3>
                                <p className="text-sm text-gray-500">{service.description}</p>
                                <div className="flex justify-between mt-2 text-sm">
                                  <span>{service.price}</span>
                                  <span className="text-gray-500">{service.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Booking form */}
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('homecare.bookService')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedService ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="address" className="block text-sm font-medium">
                              {t('general.address')} *
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                              <Input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="pl-10"
                                placeholder={t('homecare.enterAddress')}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="date" className="block text-sm font-medium">
                                {t('general.date')} *
                              </label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                  id="date"
                                  type="date"
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="time" className="block text-sm font-medium">
                                {t('general.time')} *
                              </label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                  id="time"
                                  type="time"
                                  value={time}
                                  onChange={(e) => setTime(e.target.value)}
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="notes" className="block text-sm font-medium">
                              {t('general.notes')}
                            </label>
                            <Textarea
                              id="notes"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder={t('homecare.specialRequirements')}
                              rows={4}
                            />
                          </div>

                          <div className="pt-4">
                            <Button
                              type="submit"
                              className="w-full bg-medical-green hover:bg-medical-green/90"
                            >
                              {t('homecare.bookNow')}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="text-center py-12">
                          <Home className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <p className="text-gray-500">{t('homecare.selectServicePrompt')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="providers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {professionals.map((pro) => (
                  <Card key={pro.id}>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden mb-3">
                          <img src={pro.image} alt={pro.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-lg">{pro.name}</h3>
                        <p className="text-gray-500">{pro.role}</p>
                        <div className="flex items-center justify-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(pro.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{pro.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="w-full justify-center">
                          {pro.role === "Registered Nurse" ? "Nursing" : 
                            pro.role === "Phlebotomist" ? "Blood Tests" : 
                            pro.role === "Physiotherapist" ? "Physiotherapy" :
                            "Home Care"}
                        </Badge>
                        <Button className="w-full bg-medical-green hover:bg-medical-green/90">
                          {t('homecare.bookProvider')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="how-it-works">
              <Card>
                <CardHeader>
                  <CardTitle>{t('homecare.howItWorksTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-medical-blue">1</span>
                      </div>
                      <h3 className="font-bold mb-2">{t('homecare.step1Title')}</h3>
                      <p className="text-gray-600">{t('homecare.step1Desc')}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-medical-blue">2</span>
                      </div>
                      <h3 className="font-bold mb-2">{t('homecare.step2Title')}</h3>
                      <p className="text-gray-600">{t('homecare.step2Desc')}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-medical-blue">3</span>
                      </div>
                      <h3 className="font-bold mb-2">{t('homecare.step3Title')}</h3>
                      <p className="text-gray-600">{t('homecare.step3Desc')}</p>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="font-bold text-xl mb-4">{t('homecare.findNearbyProviders')}</h3>
                    <LocationMap />
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

export default HomeCare;
