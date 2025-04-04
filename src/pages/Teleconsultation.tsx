import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import withAuth from "@/hooks/auth/withAuth";
import { useParams, useSearchParams } from "react-router-dom";
import { useDoctors } from "@/hooks/useDoctors";
import withToggleState from "@/hooks/auth/withToggleState";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { VideoIcon, MicIcon, MicOffIcon, PhoneIcon, MessageSquare, User, Users } from "lucide-react";

const Teleconsultation = () => {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor');
  const { doctors, selectedDoctor, setSelectedDoctor } = useDoctors();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChattingOpen, setIsChattingOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: string, text: string, time: string}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  useEffect(() => {
    if (doctorId && doctors.length > 0) {
      const doctor = doctors.find(d => d.id === doctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
      }
    }
  }, [doctorId, doctors, setSelectedDoctor]);
  
  const handleConnect = () => {
    if (!selectedDoctor) {
      toast({
        title: t('teleconsultation.noDoctorSelected'),
        description: t('teleconsultation.selectDoctor'),
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      setMessages([
        {
          sender: selectedDoctor.name,
          text: t('teleconsultation.welcomeMessage'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      
      toast({
        title: t('teleconsultation.connected'),
        description: t('teleconsultation.doctorJoined', { doctor: selectedDoctor.name }),
      });
    }, 2000);
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: t('teleconsultation.disconnected'),
      description: t('teleconsultation.callEnded'),
    });
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };
  
  const toggleChat = () => {
    setIsChattingOpen(!isChattingOpen);
  };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage = {
      sender: user?.firstName || t('teleconsultation.you'),
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    setTimeout(() => {
      const doctorMessage = {
        sender: selectedDoctor?.name || t('teleconsultation.doctor'),
        text: t('teleconsultation.autoResponse'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, doctorMessage]);
    }, 3000);
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t('teleconsultation.title')}</h1>
          
          {selectedDoctor ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="overflow-hidden">
                  <div className="relative bg-black aspect-video">
                    {isConnected ? (
                      <>
                        {isVideoOn ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img 
                              src={selectedDoctor.avatar} 
                              alt={selectedDoctor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <User className="h-24 w-24 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded overflow-hidden border-2 border-white">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {isVideoOn ? (
                              <img 
                                src="/user-avatar.jpg" 
                                alt="You"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-12 w-12 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                        <Users className="h-24 w-24 text-gray-400 mb-4" />
                        <p className="text-white text-lg">
                          {isConnecting 
                            ? t('teleconsultation.connecting') 
                            : t('teleconsultation.notConnected')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <CardFooter className="flex justify-center p-4 space-x-4">
                    {!isConnected ? (
                      <Button 
                        onClick={handleConnect}
                        className="bg-green-500 hover:bg-green-600"
                        disabled={isConnecting}
                      >
                        <VideoIcon className="mr-2 h-4 w-4" />
                        {isConnecting ? t('teleconsultation.connecting') : t('teleconsultation.startCall')}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={toggleMute}
                          className={isMuted ? "bg-red-100 text-red-500 border-red-200" : ""}
                        >
                          {isMuted ? (
                            <MicOffIcon className="h-4 w-4" />
                          ) : (
                            <MicIcon className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={toggleVideo}
                          className={!isVideoOn ? "bg-red-100 text-red-500 border-red-200" : ""}
                        >
                          <VideoIcon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={toggleChat}
                          className={isChattingOpen ? "bg-blue-100 text-blue-500 border-blue-200" : ""}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="destructive"
                          onClick={handleDisconnect}
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{selectedDoctor.name}</CardTitle>
                    <CardDescription>{selectedDoctor.specialty}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{t('teleconsultation.about')}</h3>
                        <p className="text-sm text-gray-500">{selectedDoctor.bio}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">{t('teleconsultation.consultationFee')}</h3>
                        <p className="text-lg font-bold text-medical-blue">
                          {selectedDoctor.consultationFee} MAD
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {isChattingOpen && isConnected && (
                <div className="md:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('teleconsultation.chat')}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="h-64 overflow-y-auto mb-4 p-4 border rounded-md">
                        {messages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`mb-3 ${message.sender === (user?.firstName || t('teleconsultation.you')) 
                              ? 'text-right' 
                              : 'text-left'}`}
                          >
                            <div 
                              className={`inline-block px-3 py-2 rounded-lg ${
                                message.sender === (user?.firstName || t('teleconsultation.you'))
                                  ? 'bg-medical-blue text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {message.sender} • {message.time}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={t('teleconsultation.typeMessage')}
                          className="flex-1 px-3 py-2 border rounded-md"
                        />
                        <Button type="submit">
                          {t('teleconsultation.send')}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Users className="h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t('teleconsultation.noDoctorSelected')}</h2>
                <p className="text-gray-500 text-center mb-4">
                  {t('teleconsultation.selectDoctorDescription')}
                </p>
                <Button onClick={() => window.history.back()}>
                  {t('teleconsultation.backToDoctors')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default withAuth(Teleconsultation);
