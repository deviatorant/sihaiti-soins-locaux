import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { safeElementClick } from "@/utils/domHelpers";

// Mock data for appointments
const upcomingAppointments = [
  {
    id: 1,
    doctorName: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    date: "2025-04-05",
    time: "10:00",
    type: "Video",
    status: "Scheduled",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 2,
    doctorName: "Dr. Mohammed Alami",
    specialty: "Pediatrician",
    date: "2025-04-12",
    time: "14:30",
    type: "In-person",
    status: "Scheduled",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
  }
];

const pastAppointments = [
  {
    id: 3,
    doctorName: "Dr. Fatima Benani",
    specialty: "Cardiologist",
    date: "2025-03-20",
    time: "11:00",
    type: "Chat",
    status: "Completed",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    id: 4,
    doctorName: "Dr. Ahmed Mansouri",
    specialty: "Dermatologist",
    date: "2025-03-10",
    time: "09:30",
    type: "Video",
    status: "Completed",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  }
];

const Appointments = () => {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  useEffect(() => {
    // Simulate clicking the "Upcoming" tab on component mount
    safeElementClick('button[value="upcoming"]');
  }, []);
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('appointments.title')}
        </h1>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{t('appointments.myAppointments')}</CardTitle>
            <CardDescription>{t('appointments.manageAppointments')}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming" onClick={() => setActiveTab("upcoming")}>
                  {t('appointments.upcoming')}
                </TabsTrigger>
                <TabsTrigger value="past" onClick={() => setActiveTab("past")}>
                  {t('appointments.past')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <div className="p-4 space-y-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                              <Avatar className="mr-4">
                                <img src={appointment.avatar} alt={appointment.doctorName} />
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{appointment.doctorName}</h3>
                                <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                <div className="flex items-center mt-1">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {appointment.date}, {appointment.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">{appointment.type}</Badge>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                          <Calendar className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-lg font-medium">{t('appointments.noUpcoming')}</p>
                        <p className="text-gray-500">{t('appointments.noUpcomingDesc')}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="past">
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <div className="p-4 space-y-4">
                    {pastAppointments.length > 0 ? (
                      pastAppointments.map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                              <Avatar className="mr-4">
                                <img src={appointment.avatar} alt={appointment.doctorName} />
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{appointment.doctorName}</h3>
                                <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                <div className="flex items-center mt-1">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {appointment.date}, {appointment.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">{appointment.status}</Badge>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                          <Calendar className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-lg font-medium">{t('appointments.noPast')}</p>
                        <p className="text-gray-500">{t('appointments.noPastDesc')}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Appointments;
