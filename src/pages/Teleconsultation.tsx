
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Video,
  Phone,
  MessageSquare,
  Clock,
  Calendar,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Send,
  Upload,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
  Star,
} from "lucide-react";

// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    languages: ["Arabic", "French", "English"],
    rating: 4.9,
    reviews: 127,
    online: true,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    hourlyRate: 250
  },
  {
    id: 2,
    name: "Dr. Mohammed Alami",
    specialty: "Pediatrician",
    languages: ["Arabic", "French"],
    rating: 4.8,
    reviews: 98,
    online: true,
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    hourlyRate: 300
  },
  {
    id: 3,
    name: "Dr. Fatima Benani",
    specialty: "Cardiologist",
    languages: ["Arabic", "French", "English"],
    rating: 4.7,
    reviews: 75,
    online: false,
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    hourlyRate: 350
  }
];

// Mock data for past consultations
const pastConsultations = [
  {
    id: 1,
    doctorName: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    date: "2025-03-15",
    time: "14:30",
    type: "Video",
    duration: "25 min",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    summary: "Common cold, prescribed rest and paracetamol",
    documents: ["Prescription_20250315.pdf"]
  },
  {
    id: 2,
    doctorName: "Dr. Mohammed Alami",
    specialty: "Pediatrician",
    date: "2025-02-28",
    time: "10:00",
    type: "Chat",
    duration: "15 min",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    summary: "Dietary advice for child with allergies",
    documents: ["Diet_Plan_20250228.pdf", "Allergy_Test_Results.pdf"]
  }
];

const Teleconsultation = () => {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const [activeConsultation, setActiveConsultation] = useState<boolean>(false);
  const [currentDoctor, setCurrentDoctor] = useState<any>(null);
  const [consultationType, setConsultationType] = useState<"video" | "audio" | "chat">("video");
  const [messages, setMessages] = useState<Array<{sender: string, text: string, time: string}>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [language, setLanguage] = useState("all");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
  // Start a consultation with a doctor
  const startConsultation = (doctor: any, type: "video" | "audio" | "chat") => {
    setCurrentDoctor(doctor);
    setConsultationType(type);
    setActiveConsultation(true);
    
    // Initial system message
    const systemMessage = {
      sender: "system",
      text: `You are now connected with ${doctor.name}. ${type === "chat" ? "You can start chatting now." : "The doctor will join shortly."}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([systemMessage]);
    
    toast({
      title: type === "chat" ? "Chat Started" : type === "video" ? "Video Call Initiated" : "Audio Call Initiated",
      description: `Connected with ${doctor.name}`,
      variant: "default",
    });
  };
  
  // End the active consultation
  const endConsultation = () => {
    toast({
      title: "Consultation Ended",
      description: `Your consultation with ${currentDoctor.name} has ended`,
      variant: "default",
    });
    
    setActiveConsultation(false);
    setCurrentDoctor(null);
    setMessages([]);
  };
  
  // Send a message in chat mode
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      sender: "user",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate doctor response after 1-3 seconds
    setTimeout(() => {
      const doctorMessage = {
        sender: "doctor",
        text: "Thank you for your message. Can you provide more details about your symptoms?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, doctorMessage]);
    }, 1000 + Math.random() * 2000);
  };
  
  // Filter doctors based on criteria
  const filteredDoctors = doctors.filter(doctor => {
    if (showOnlineOnly && !doctor.online) return false;
    if (specialty !== "all" && doctor.specialty !== specialty) return false;
    if (language !== "all" && !doctor.languages.includes(language)) return false;
    return true;
  });
  
  // Render the chat interface
  const renderChatInterface = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-t-lg">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <img src={currentDoctor.avatar} alt={currentDoctor.name} />
          </Avatar>
          <div>
            <h3 className="font-medium">{currentDoctor.name}</h3>
            <p className="text-sm text-gray-500">{currentDoctor.specialty}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={endConsultation}>
          {t('teleconsultation.endChat')}
        </Button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "doctor" && (
              <Avatar className="h-8 w-8 mr-2">
                <img src={currentDoctor.avatar} alt={currentDoctor.name} />
              </Avatar>
            )}
            
            {msg.sender === "system" && (
              <div className="bg-gray-200 text-gray-600 text-sm py-2 px-3 rounded-lg max-w-[80%]">
                {msg.text}
              </div>
            )}
            
            {msg.sender !== "system" && (
              <div 
                className={`${
                  msg.sender === "user" 
                    ? "bg-medical-blue text-white" 
                    : "bg-white text-gray-800 border"
                } py-2 px-4 rounded-lg max-w-[80%]`}
              >
                <p>{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 inline-block">{msg.time}</span>
              </div>
            )}
            
            {msg.sender === "user" && (
              <Avatar className="h-8 w-8 ml-2">
                <User />
              </Avatar>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-white border-t flex items-center">
        <Button variant="outline" size="icon" className="mr-2">
          <Upload className="h-4 w-4" />
        </Button>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('teleconsultation.typeMessage')}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button size="icon" className="ml-2 bg-medical-blue" onClick={sendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  // Render the video/audio call interface
  const renderCallInterface = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-gray-800 relative rounded-t-lg flex items-center justify-center">
        {consultationType === "video" ? (
          <>
            <div className="text-white text-center">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{t('teleconsultation.waitingDoctor')}</p>
              <p className="opacity-70 mt-2">{t('teleconsultation.prepareYourself')}</p>
            </div>
            
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-600 rounded shadow-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-8 w-8 text-white opacity-60" />
              </div>
            </div>
          </>
        ) : (
          <div className="text-white text-center">
            <Phone className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">{t('teleconsultation.audioCallWith')} {currentDoctor.name}</p>
            <p className="opacity-70 mt-2">{t('teleconsultation.connecting')}</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-900 flex items-center justify-center space-x-4 rounded-b-lg">
        <Button variant="outline" size="icon" className="rounded-full bg-red-600 hover:bg-red-700 border-none" onClick={endConsultation}>
          <Phone className="h-6 w-6 text-white" />
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600 border-none">
          {consultationType === "video" ? <VideoOff className="h-6 w-6 text-white" /> : <MicOff className="h-6 w-6 text-white" />}
        </Button>
        
        {consultationType === "video" && (
          <Button variant="outline" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600 border-none">
            <Camera className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('teleconsultation.title')}
        </h1>
        
        {activeConsultation ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: "600px" }}>
            {consultationType === "chat" ? renderChatInterface() : renderCallInterface()}
          </div>
        ) : (
          <Tabs defaultValue="doctors" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="doctors">{t('teleconsultation.findDoctor')}</TabsTrigger>
              <TabsTrigger value="history">{t('teleconsultation.consultationHistory')}</TabsTrigger>
              <TabsTrigger value="request">{t('teleconsultation.requestConsultation')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="doctors">
              <Card>
                <CardHeader>
                  <CardTitle>{t('teleconsultation.availableDoctors')}</CardTitle>
                  <CardDescription>{t('teleconsultation.selectDoctor')}</CardDescription>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium">{t('teleconsultation.specialty')}</label>
                      <Select value={specialty} onValueChange={setSpecialty}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('teleconsultation.allSpecialties')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('teleconsultation.allSpecialties')}</SelectItem>
                          <SelectItem value="General Practitioner">{t('teleconsultation.generalPractitioner')}</SelectItem>
                          <SelectItem value="Pediatrician">{t('teleconsultation.pediatrician')}</SelectItem>
                          <SelectItem value="Cardiologist">{t('teleconsultation.cardiologist')}</SelectItem>
                          <SelectItem value="Dermatologist">{t('teleconsultation.dermatologist')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">{t('teleconsultation.language')}</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('teleconsultation.allLanguages')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('teleconsultation.allLanguages')}</SelectItem>
                          <SelectItem value="Arabic">{t('teleconsultation.arabic')}</SelectItem>
                          <SelectItem value="French">{t('teleconsultation.french')}</SelectItem>
                          <SelectItem value="English">{t('teleconsultation.english')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-auto">
                      <Switch
                        id="online-only"
                        checked={showOnlineOnly}
                        onCheckedChange={setShowOnlineOnly}
                      />
                      <label htmlFor="online-only" className="text-sm font-medium">
                        {t('teleconsultation.onlineOnly')}
                      </label>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doctor) => (
                        <Card key={doctor.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-1/4 flex flex-col items-center justify-center">
                                <Avatar className="h-24 w-24 mb-2">
                                  <img src={doctor.avatar} alt={doctor.name} />
                                </Avatar>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span className="text-sm">{doctor.rating} ({doctor.reviews})</span>
                                </div>
                                <Badge 
                                  className={`mt-2 ${doctor.online ? 'bg-green-500' : 'bg-gray-400'}`}
                                >
                                  {doctor.online ? t('teleconsultation.online') : t('teleconsultation.offline')}
                                </Badge>
                              </div>
                              
                              <div className="md:w-2/4">
                                <h3 className="text-lg font-medium">{doctor.name}</h3>
                                <p className="text-gray-500">{doctor.specialty}</p>
                                
                                <div className="mt-2">
                                  <p className="text-sm font-medium">{t('teleconsultation.languages')}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {doctor.languages.map((lang: string, index: number) => (
                                      <Badge key={index} variant="outline">
                                        {lang}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="mt-2">
                                  <p className="text-sm font-medium">{t('teleconsultation.consultationFee')}</p>
                                  <p className="text-medical-blue font-bold">{doctor.hourlyRate} MAD / {t('teleconsultation.hour')}</p>
                                </div>
                              </div>
                              
                              <div className="md:w-1/4 flex flex-col gap-2 justify-center">
                                <Button
                                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                                  disabled={!doctor.online}
                                  onClick={() => startConsultation(doctor, "video")}
                                >
                                  <Video className="mr-2 h-4 w-4" />
                                  {t('teleconsultation.videoCall')}
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  disabled={!doctor.online}
                                  onClick={() => startConsultation(doctor, "audio")}
                                >
                                  <Phone className="mr-2 h-4 w-4" />
                                  {t('teleconsultation.audioCall')}
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  disabled={!doctor.online}
                                  onClick={() => startConsultation(doctor, "chat")}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  {t('teleconsultation.chatWithDoctor')}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <div className="h-20 w-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <User className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium">{t('teleconsultation.noDoctorsFound')}</h3>
                        <p className="text-gray-500 mt-1">{t('teleconsultation.tryDifferentFilters')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>{t('teleconsultation.pastConsultations')}</CardTitle>
                  <CardDescription>{t('teleconsultation.pastConsultationsDesc')}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  {pastConsultations.length > 0 ? (
                    <div className="space-y-4">
                      {pastConsultations.map((consultation) => (
                        <Card key={consultation.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-1/4 flex flex-col items-center md:items-start">
                                <Avatar className="h-16 w-16 mb-2">
                                  <img src={consultation.avatar} alt={consultation.doctorName} />
                                </Avatar>
                                <h3 className="font-medium">{consultation.doctorName}</h3>
                                <p className="text-sm text-gray-500">{consultation.specialty}</p>
                              </div>
                              
                              <div className="md:w-2/4">
                                <div className="flex flex-wrap gap-y-2 gap-x-4">
                                  <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="text-sm">
                                      {new Date(consultation.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="text-sm">{consultation.time}</span>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Badge variant="outline">
                                      {consultation.type === "Video" ? (
                                        <Video className="h-3 w-3 mr-1" />
                                      ) : consultation.type === "Audio" ? (
                                        <Phone className="h-3 w-3 mr-1" />
                                      ) : (
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                      )}
                                      {consultation.type}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="text-sm">{consultation.duration}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <p className="text-sm font-medium">{t('teleconsultation.summary')}</p>
                                  <p className="text-sm text-gray-600">{consultation.summary}</p>
                                </div>
                                
                                {consultation.documents.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-sm font-medium">{t('teleconsultation.documents')}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {consultation.documents.map((doc, index) => (
                                        <Badge key={index} variant="outline" className="cursor-pointer">
                                          {doc}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="md:w-1/4 flex flex-col gap-2">
                                <Button className="w-full">
                                  {t('teleconsultation.viewDetails')}
                                </Button>
                                
                                <Button variant="outline" className="w-full">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  {t('teleconsultation.messageDoctor')}
                                </Button>
                                
                                <Button variant="outline" className="w-full">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {t('teleconsultation.bookFollowUp')}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="h-20 w-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium">{t('teleconsultation.noConsultations')}</h3>
                      <p className="text-gray-500 mt-1">{t('teleconsultation.startConsultation')}</p>
                      <Button 
                        className="mt-4 bg-medical-blue hover:bg-medical-blue/90"
                        onClick={() => document.querySelector('button[value="doctors"]')?.click()}
                      >
                        {t('teleconsultation.findDoctorNow')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="request">
              <Card>
                <CardHeader>
                  <CardTitle>{t('teleconsultation.requestConsultation')}</CardTitle>
                  <CardDescription>{t('teleconsultation.requestDesc')}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('teleconsultation.specialty')}</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t('teleconsultation.selectSpecialty')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gp">{t('teleconsultation.generalPractitioner')}</SelectItem>
                            <SelectItem value="pediatrician">{t('teleconsultation.pediatrician')}</SelectItem>
                            <SelectItem value="cardiologist">{t('teleconsultation.cardiologist')}</SelectItem>
                            <SelectItem value="dermatologist">{t('teleconsultation.dermatologist')}</SelectItem>
                            <SelectItem value="other">{t('teleconsultation.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('teleconsultation.preferredLanguage')}</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t('teleconsultation.selectLanguage')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arabic">{t('teleconsultation.arabic')}</SelectItem>
                            <SelectItem value="french">{t('teleconsultation.french')}</SelectItem>
                            <SelectItem value="english">{t('teleconsultation.english')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('teleconsultation.preferredDate')}</label>
                        <Input type="date" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('teleconsultation.preferredTime')}</label>
                        <Input type="time" />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">{t('teleconsultation.consultationType')}</label>
                        <div className="grid grid-cols-3 gap-3 mt-1">
                          <Button variant="outline" className="flex flex-col items-center h-auto py-4">
                            <Video className="h-6 w-6 mb-2 text-medical-blue" />
                            <span>{t('teleconsultation.videoCall')}</span>
                          </Button>
                          <Button variant="outline" className="flex flex-col items-center h-auto py-4">
                            <Phone className="h-6 w-6 mb-2 text-medical-blue" />
                            <span>{t('teleconsultation.audioCall')}</span>
                          </Button>
                          <Button variant="outline" className="flex flex-col items-center h-auto py-4">
                            <MessageSquare className="h-6 w-6 mb-2 text-medical-blue" />
                            <span>{t('teleconsultation.chat')}</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">{t('teleconsultation.reasonForConsultation')}</label>
                        <Textarea 
                          placeholder={t('teleconsultation.brieflyDescribe')}
                          rows={4}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                          <Switch id="urgent" />
                          <label htmlFor="urgent" className="text-sm font-medium">
                            {t('teleconsultation.urgentConsultation')}
                          </label>
                        </div>
                        
                        <Button className="w-full md:w-auto bg-medical-blue hover:bg-medical-blue/90">
                          {t('teleconsultation.submitRequest')}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>{t('teleconsultation.howItWorks')}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-medical-blue">1</span>
                      </div>
                      <h3 className="font-bold mb-2">{t('teleconsultation.step1Title')}</h3>
                      <p className="text-gray-600">{t('teleconsultation.step1Desc')}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-medical-blue">2</span>
                      </div>
                      <h3 className="font-bold mb-2">{t('teleconsultation.step2Title')}</h3>
                      <p className="text-gray-600">{t('teleconsultation.step2Desc')}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-medical-blue">3</span>
                      </div>
                      <h3 className="font-bold mb-2">{t('teleconsultation.step3Title')}</h3>
                      <p className="text-gray-600">{t('teleconsultation.step3Desc')}</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <div className="w-full bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium">{t('teleconsultation.limitedConnectivity')}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('teleconsultation.connectivityMessage')}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Teleconsultation;
