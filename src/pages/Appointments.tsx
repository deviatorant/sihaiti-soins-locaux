import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Check, 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  Phone, 
  Video,
  X,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const Appointments = () => {
  const { t, isRTL } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentType, setAppointmentType] = useState("in-person");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  
  // Mock data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: "Dr. Martin",
      specialty: "Cardiologist",
      date: new Date(2025, 3, 10, 14, 30),
      type: "in-person",
      address: "123 Medical Center, Casablanca",
      status: "confirmed"
    },
    {
      id: 2,
      doctorName: "Dr. Chen",
      specialty: "Dermatologist",
      date: new Date(2025, 3, 15, 10, 0),
      type: "video",
      status: "confirmed"
    }
  ];
  
  const pastAppointments = [
    {
      id: 3,
      doctorName: "Dr. Garcia",
      specialty: "General Practitioner",
      date: new Date(2025, 2, 20, 9, 0),
      type: "in-person",
      address: "456 Health Clinic, Rabat",
      status: "completed"
    },
    {
      id: 4,
      doctorName: "Dr. Smith",
      specialty: "Neurologist",
      date: new Date(2025, 2, 5, 16, 30),
      type: "video",
      status: "cancelled"
    }
  ];
  
  // Mock doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. Mohammed Alaoui",
      specialty: "Cardiologist",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      location: "Casablanca",
      availableToday: true,
      languages: ["Arabic", "French", "English"]
    },
    {
      id: 2,
      name: "Dr. Fatima Benali",
      specialty: "Dermatologist",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      location: "Rabat",
      availableToday: false,
      languages: ["Arabic", "French"]
    },
    {
      id: 3,
      name: "Dr. Karim Idrissi",
      specialty: "General Practitioner",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      location: "Marrakech",
      availableToday: true,
      languages: ["Arabic", "French", "Amazigh"]
    },
    {
      id: 4,
      name: "Dr. Leila Tazi",
      specialty: "Pediatrician",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      location: "Casablanca",
      availableToday: true,
      languages: ["Arabic", "French"]
    }
  ];
  
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === "all" || doctor.specialty.toLowerCase() === specialtyFilter.toLowerCase();
    
    return matchesSearch && matchesSpecialty;
  });
  
  const handleBookAppointment = (doctorId: number) => {
    console.log(`Booking appointment with doctor ID: ${doctorId}`);
    toast({
      title: "Appointment Request Sent",
      description: "We'll notify you when the doctor confirms your appointment.",
      variant: "default",
    });
  };
  
  const handleCancelAppointment = (appointmentId: number) => {
    console.log(`Cancelling appointment ID: ${appointmentId}`);
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
      variant: "destructive",
    });
  };
  
  const renderAppointmentCard = (appointment: any) => {
    const isUpcoming = new Date(appointment.date) > new Date();
    
    return (
      <Card key={appointment.id} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12 border">
                <img
                  src={`https://randomuser.me/api/portraits/${appointment.doctorName.includes("Dr. ") ? "men" : "women"}/${appointment.id + 10}.jpg`}
                  alt={appointment.doctorName}
                />
              </Avatar>
              <div>
                <h3 className="font-medium">{appointment.doctorName}</h3>
                <p className="text-sm text-gray-500">{appointment.specialty}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {format(new Date(appointment.date), "PPP")}
                  </span>
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {format(new Date(appointment.date), "p")}
                  </span>
                </div>
                {appointment.address && (
                  <div className="flex items-center mt-1 space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{appointment.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Badge variant={appointment.status === "cancelled" ? "destructive" : "outline"}>
                {appointment.status === "confirmed" ? t('appointments.confirmed') :
                 appointment.status === "completed" ? t('appointments.completed') :
                 t('appointments.cancelled')}
              </Badge>
              <div className="mt-2">
                {appointment.type === "in-person" ? (
                  <Badge variant="outline" className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {t('appointments.inPerson')}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center">
                    <Video className="h-3 w-3 mr-1" />
                    {t('appointments.video')}
                  </Badge>
                )}
              </div>
              {isUpcoming && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleCancelAppointment(appointment.id)}
                >
                  {t('appointments.cancel')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderTimeSlots = () => {
    const timeSlots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      timeSlots.push(
        <Button
          key={`${hour}:00`}
          variant="outline"
          className="m-1"
          onClick={() => {
            const timeSlotInput = document.getElementById("time-slot-input");
            if (timeSlotInput instanceof HTMLInputElement) {
              timeSlotInput.value = `${hour}:00`;
            }
          }}
        >
          {hour}:00
        </Button>
      );
      if (hour !== endHour) {
        timeSlots.push(
          <Button
            key={`${hour}:30`}
            variant="outline"
            className="m-1"
            onClick={() => {
              const timeSlotInput = document.getElementById("time-slot-input");
              if (timeSlotInput instanceof HTMLInputElement) {
                timeSlotInput.value = `${hour}:30`;
              }
            }}
          >
            {hour}:30
          </Button>
        );
      }
    }
    
    return <div className="flex flex-wrap">{timeSlots}</div>;
  };
  
  const renderDoctorCard = (doctor: any) => {
    return (
      <Card key={doctor.id} className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16 border">
                <img src={doctor.avatar} alt={doctor.name} />
              </Avatar>
              <div>
                <h3 className="font-medium">{doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{doctor.location}</span>
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  <div className="flex space-x-1">
                    {doctor.languages.map((lang: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {doctor.availableToday && (
                <Badge className="bg-green-500 hover:bg-green-600 mb-2">
                  {t('appointments.availableToday')}
                </Badge>
              )}
              <Button
                onClick={() => handleBookAppointment(doctor.id)}
                className="bg-medical-blue hover:bg-medical-blue/90"
                size="sm"
              >
                {t('appointments.book')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const handleTabChange = (value: string) => {
    if (value === "book") {
      // No need to do anything special here
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('appointments.title')}
        </h1>
        
        <Tabs defaultValue="book" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="book">{t('appointments.book')}</TabsTrigger>
            <TabsTrigger value="upcoming">{t('appointments.upcoming')}</TabsTrigger>
            <TabsTrigger value="past">{t('appointments.past')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="book">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="search">{t('appointments.searchDoctor')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder={t('appointments.searchPlaceholder')}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('appointments.specialty')}</Label>
                  <Select
                    value={specialtyFilter}
                    onValueChange={setSpecialtyFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('appointments.allSpecialties')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('appointments.allSpecialties')}</SelectItem>
                      <SelectItem value="Cardiologist">{t('appointments.specialties.cardiologist')}</SelectItem>
                      <SelectItem value="Dermatologist">{t('appointments.specialties.dermatologist')}</SelectItem>
                      <SelectItem value="General Practitioner">{t('appointments.specialties.gp')}</SelectItem>
                      <SelectItem value="Pediatrician">{t('appointments.specialties.pediatrician')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t('appointments.type')}</Label>
                  <Select
                    value={appointmentType}
                    onValueChange={setAppointmentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('appointments.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">{t('appointments.inPerson')}</SelectItem>
                      <SelectItem value="video">{t('appointments.video')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">{t('appointments.availableDoctors')}</h3>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map(renderDoctorCard)
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('appointments.noDoctorsFound')}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow mt-6">
                <h3 className="text-lg font-semibold mb-4">{t('appointments.scheduleNew')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">{t('appointments.selectDate')}</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border bg-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">{t('appointments.selectTime')}</Label>
                    <Input
                      id="time-slot-input"
                      type="text"
                      placeholder={t('appointments.selectTimeSlot')}
                      readOnly
                      className="mb-4"
                    />
                    {renderTimeSlots()}
                    
                    <div className="mt-6">
                      <Label htmlFor="notes" className="mb-2 block">{t('general.notes')}</Label>
                      <Textarea
                        id="notes"
                        placeholder={t('appointments.notesPlaceholder')}
                        className="resize-none"
                      />
                    </div>
                    
                    <Button className="w-full mt-6 bg-medical-blue hover:bg-medical-blue/90">
                      {t('appointments.confirmBooking')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t('appointments.upcoming')}</h2>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(renderAppointmentCard)
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('appointments.noUpcoming')}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector('button[value="book"]')?.click()}
                  >
                    {t('appointments.bookNew')}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t('appointments.past')}</h2>
              {pastAppointments.length > 0 ? (
                pastAppointments.map(renderAppointmentCard)
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('appointments.noPast')}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Appointments;
