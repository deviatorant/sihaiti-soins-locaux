
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

const Appointments = () => {
  const { t, isRTL } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Sample specialties
  const specialties = [
    "Cardiology", "Dermatology", "General Practice", "Neurology", 
    "Orthopedics", "Pediatrics", "Psychiatry", "Ophthalmology"
  ];

  // Sample doctors
  const doctors = [
    { id: 1, name: "Dr. Smith", specialty: "Cardiology", rating: 4.8, available: true, image: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 2, name: "Dr. Johnson", specialty: "Dermatology", rating: 4.6, available: true, image: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Dr. Williams", specialty: "Neurology", rating: 4.9, available: false, image: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: 4, name: "Dr. Brown", specialty: "Orthopedics", rating: 4.7, available: true, image: "https://randomuser.me/api/portraits/men/4.jpg" },
    { id: 5, name: "Dr. Davis", specialty: "Pediatrics", rating: 4.5, available: true, image: "https://randomuser.me/api/portraits/women/5.jpg" },
    { id: 6, name: "Dr. Miller", specialty: "Psychiatry", rating: 4.8, available: true, image: "https://randomuser.me/api/portraits/men/6.jpg" },
    { id: 7, name: "Dr. Wilson", specialty: "Ophthalmology", rating: 4.9, available: false, image: "https://randomuser.me/api/portraits/women/7.jpg" },
    { id: 8, name: "Dr. Moore", specialty: "General Practice", rating: 4.7, available: true, image: "https://randomuser.me/api/portraits/men/8.jpg" },
  ];

  // Sample time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSpecialty === null || doctor.specialty === selectedSpecialty)
    );
  });

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedTime || !date) {
      alert(t('appointments.selectAllRequired'));
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    
    console.log("Booking appointment:", {
      doctor: doctor?.name,
      date: format(date, "PPP"),
      time: selectedTime
    });
    
    alert(t('appointments.bookingConfirmed'));
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('nav.appointments')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left sidebar - search and filters */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t('appointments.findDoctor')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search input */}
                <div className="relative">
                  <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={18} />
                  <Input
                    type="text"
                    placeholder={t('appointments.searchDoctors')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-sm font-medium mb-2">{t('appointments.specialties')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant={selectedSpecialty === specialty ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? null : specialty)}
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CalendarIcon size={16} />
                    {t('appointments.selectDate')}
                  </h3>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md p-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content - doctors list and appointment booking */}
          <div className="md:col-span-2">
            <Tabs defaultValue="doctors">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="doctors">{t('appointments.doctors')}</TabsTrigger>
                <TabsTrigger value="booking">{t('appointments.booking')}</TabsTrigger>
              </TabsList>

              <TabsContent value="doctors">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('appointments.availableDoctors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredDoctors.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">{t('appointments.noDoctorsFound')}</p>
                      ) : (
                        filteredDoctors.map((doctor) => (
                          <div key={doctor.id} className="border rounded-lg p-4 flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                              <img src={doctor.image} alt={doctor.name} />
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{doctor.name}</h3>
                                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                                  <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <svg 
                                        key={i} 
                                        className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                    <span className="text-xs text-gray-600 ml-1">{doctor.rating}</span>
                                  </div>
                                </div>
                                <Badge 
                                  variant={doctor.available ? "success" : "destructive"}
                                  className={doctor.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                  {doctor.available ? t('appointments.available') : t('appointments.unavailable')}
                                </Badge>
                              </div>
                              
                              <div className="mt-4 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={!doctor.available}
                                  onClick={() => setSelectedDoctor(doctor.id)}
                                  className={selectedDoctor === doctor.id ? "bg-medical-blue text-white" : ""}
                                >
                                  {t('appointments.select')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="booking">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('appointments.bookAppointment')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDoctor ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium mb-2">{t('appointments.selectedDoctor')}</h3>
                          {(() => {
                            const doctor = doctors.find(d => d.id === selectedDoctor);
                            return (
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                  <img src={doctor?.image} alt={doctor?.name} />
                                </Avatar>
                                <div>
                                  <p className="font-medium">{doctor?.name}</p>
                                  <p className="text-sm text-gray-500">{doctor?.specialty}</p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <CalendarIcon size={16} />
                            {t('appointments.appointmentDate')}
                          </h3>
                          <p className="text-gray-700">{date ? format(date, "PPP") : t('appointments.noDateSelected')}</p>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <Clock size={16} />
                            {t('appointments.selectTime')}
                          </h3>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {timeSlots.map((time) => (
                              <Button
                                key={time}
                                variant="outline"
                                size="sm"
                                className={selectedTime === time ? "bg-medical-blue text-white" : ""}
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <MapPin size={16} />
                            {t('appointments.location')}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <Input 
                              type="text" 
                              placeholder={t('general.address')} 
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-medical-blue hover:bg-medical-blue/90"
                          onClick={handleBookAppointment}
                        >
                          {t('appointments.confirmBooking')}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">{t('appointments.noDoctorSelected')}</p>
                        <Button 
                          variant="outline"
                          onClick={() => document.querySelector('[data-value="doctors"]')?.click()}
                        >
                          {t('appointments.selectDoctor')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;
