
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Clock, Pill, User, Phone, Mail, 
  MapPin, FileText, ShieldCheck, Settings, LogOut
} from "lucide-react";

const Profile = () => {
  const { t, isRTL } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8901",
    address: "123 Main Street, New York, NY 10001",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    bloodType: "A+",
    allergies: "None",
    medicalConditions: "None",
    medications: "None"
  });

  // Sample appointments
  const appointments = [
    { id: 1, doctor: "Dr. Sarah Martinez", type: "Cardiology", date: "2023-06-15", time: "10:00", status: "completed" },
    { id: 2, doctor: "Dr. Michael Chen", type: "Dermatology", date: "2023-09-22", time: "14:30", status: "completed" },
    { id: 3, doctor: "Dr. Emma Thompson", type: "General Practitioner", date: "2023-11-05", time: "11:15", status: "cancelled" },
    { id: 4, doctor: "Dr. David Wilson", type: "Ophthalmology", date: "2024-05-10", time: "09:30", status: "upcoming" },
    { id: 5, doctor: "Dr. Lisa Wang", type: "Neurology", date: "2024-05-18", time: "15:45", status: "upcoming" },
  ];

  // Sample prescriptions
  const prescriptions = [
    { id: 1, doctor: "Dr. Sarah Martinez", date: "2023-06-15", medications: ["Lisinopril 10mg", "Atorvastatin 20mg"], status: "active" },
    { id: 2, doctor: "Dr. Michael Chen", date: "2023-09-22", medications: ["Tretinoin Cream 0.025%"], status: "completed" },
    { id: 3, doctor: "Dr. Emma Thompson", date: "2023-11-05", medications: ["Amoxicillin 500mg", "Ibuprofen 400mg"], status: "completed" },
  ];

  // Sample orders
  const orders = [
    { id: "ORD-2023-001", date: "2023-12-10", items: ["Multivitamin Complex", "Blood Pressure Monitor"], total: 114.98, status: "delivered" },
    { id: "ORD-2024-002", date: "2024-02-18", items: ["First Aid Kit", "Omega-3 Fish Oil"], total: 64.99, status: "delivered" },
    { id: "ORD-2024-003", date: "2024-04-25", items: ["Digital Scale", "Essential Oil Diffuser"], total: 89.98, status: "processing" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", userData);
    setEditMode(false);
    // Here you would typically submit the data to a server
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row items-start gap-6">
            {/* User Card */}
            <Card className="w-full md:w-64 flex-shrink-0">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Profile" 
                      className="rounded-full"
                    />
                  </Avatar>
                  <h2 className="text-xl font-bold">{userData.firstName} {userData.lastName}</h2>
                  <p className="text-gray-500 mb-4">{userData.email}</p>
                </div>

                <div className="space-y-1 mb-6">
                  <div className="flex items-center text-sm py-1">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    <span>{userData.phone}</span>
                  </div>
                  <div className="flex items-center text-sm py-1">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span>{userData.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center text-sm py-1">
                    <User size={16} className="mr-2 text-gray-500" />
                    <span>{userData.gender}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-start"
                  >
                    <Settings size={16} className="mr-2" />
                    {t('profile.settings')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-start text-red-500 hover:text-red-600"
                  >
                    <LogOut size={16} className="mr-2" />
                    {t('auth.logout')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">{t('profile.personalInfo')}</TabsTrigger>
                  <TabsTrigger value="appointments">{t('profile.appointments')}</TabsTrigger>
                  <TabsTrigger value="prescriptions">{t('profile.prescriptions')}</TabsTrigger>
                  <TabsTrigger value="orders">{t('profile.orders')}</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{t('profile.personalInfo')}</CardTitle>
                      <Button 
                        variant={editMode ? "default" : "outline"}
                        onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      >
                        {editMode ? t('profile.save') : t('profile.edit')}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('profile.firstName')}</label>
                          {editMode ? (
                            <Input 
                              name="firstName"
                              value={userData.firstName}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('profile.lastName')}</label>
                          {editMode ? (
                            <Input 
                              name="lastName"
                              value={userData.lastName}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.lastName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('profile.email')}</label>
                          {editMode ? (
                            <Input 
                              name="email"
                              value={userData.email}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.email}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('profile.phone')}</label>
                          {editMode ? (
                            <Input 
                              name="phone"
                              value={userData.phone}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.phone}</p>
                          )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">{t('profile.address')}</label>
                          {editMode ? (
                            <Input 
                              name="address"
                              value={userData.address}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.address}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('profile.dateOfBirth')}</label>
                          {editMode ? (
                            <Input 
                              name="dateOfBirth"
                              type="date"
                              value={userData.dateOfBirth}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.dateOfBirth}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('profile.gender')}</label>
                          {editMode ? (
                            <Input 
                              name="gender"
                              value={userData.gender}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.gender}</p>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-medium mb-4">{t('profile.medicalInfo')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('profile.bloodType')}</label>
                          {editMode ? (
                            <Input 
                              name="bloodType"
                              value={userData.bloodType}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.bloodType}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('profile.allergies')}</label>
                          {editMode ? (
                            <Input 
                              name="allergies"
                              value={userData.allergies}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.allergies}</p>
                          )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">{t('profile.medicalConditions')}</label>
                          {editMode ? (
                            <Textarea 
                              name="medicalConditions"
                              value={userData.medicalConditions}
                              onChange={handleInputChange}
                              rows={3}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.medicalConditions}</p>
                          )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">{t('profile.medications')}</label>
                          {editMode ? (
                            <Textarea 
                              name="medications"
                              value={userData.medications}
                              onChange={handleInputChange}
                              rows={3}
                            />
                          ) : (
                            <p className="text-gray-700 p-2 border rounded-md bg-gray-50">{userData.medications}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Appointments Tab */}
                <TabsContent value="appointments" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('profile.appointments')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {appointments.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">{t('profile.noAppointments')}</p>
                        ) : (
                          appointments.map((appointment) => (
                            <div key={appointment.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-medium text-lg">{appointment.doctor}</h3>
                                  <p className="text-gray-500">{appointment.type}</p>
                                </div>
                                <Badge className={getStatusColor(appointment.status)}>
                                  {appointment.status === "completed" ? t('profile.completed') :
                                   appointment.status === "cancelled" ? t('profile.cancelled') :
                                   t('profile.upcoming')}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center">
                                  <Calendar size={16} className="mr-2 text-gray-500" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock size={16} className="mr-2 text-gray-500" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t flex justify-end">
                                {appointment.status === "upcoming" && (
                                  <div className="space-x-2">
                                    <Button variant="outline" size="sm">
                                      {t('profile.reschedule')}
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                                      {t('profile.cancel')}
                                    </Button>
                                  </div>
                                )}
                                {appointment.status === "completed" && (
                                  <Button variant="outline" size="sm">
                                    {t('profile.viewDetails')}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Prescriptions Tab */}
                <TabsContent value="prescriptions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('profile.prescriptions')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {prescriptions.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">{t('profile.noPrescriptions')}</p>
                        ) : (
                          prescriptions.map((prescription) => (
                            <div key={prescription.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-medium text-lg">{prescription.doctor}</h3>
                                  <p className="text-gray-500">{prescription.date}</p>
                                </div>
                                <Badge className={getStatusColor(prescription.status)}>
                                  {prescription.status === "active" ? t('profile.active') : t('profile.completed')}
                                </Badge>
                              </div>
                              <div className="mt-3">
                                <h4 className="font-medium mb-2 flex items-center">
                                  <Pill size={16} className="mr-2 text-gray-500" />
                                  {t('profile.medications')}
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                  {prescription.medications.map((med, idx) => (
                                    <li key={idx}>{med}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="mt-3 pt-3 border-t flex justify-end">
                                <div className="space-x-2">
                                  <Button variant="outline" size="sm">
                                    {t('profile.download')}
                                  </Button>
                                  {prescription.status === "active" && (
                                    <Button size="sm" className="bg-medical-blue hover:bg-medical-blue/90">
                                      {t('profile.refill')}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('profile.orders')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">{t('profile.noOrders')}</p>
                        ) : (
                          orders.map((order) => (
                            <div key={order.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-medium text-lg">{order.id}</h3>
                                  <p className="text-gray-500">{order.date}</p>
                                </div>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status === "delivered" ? t('profile.delivered') : t('profile.processing')}
                                </Badge>
                              </div>
                              <div className="mt-3">
                                <h4 className="font-medium mb-2">{t('profile.items')}</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                  {order.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                                <p className="mt-2 font-medium">
                                  {t('profile.total')}: ${order.total.toFixed(2)}
                                </p>
                              </div>
                              <div className="mt-3 pt-3 border-t flex justify-end">
                                <div className="space-x-2">
                                  <Button variant="outline" size="sm">
                                    {t('profile.trackOrder')}
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    {t('profile.viewDetails')}
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
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
