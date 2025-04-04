import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth, withAuth } from '@/hooks/useAuth';
import { useDoctors } from '@/hooks/useDoctors';
import { Calendar } from '@/components/ui/calendar';
import { withToggleState } from '@/hooks/use-mobile';
import { Clock, Phone, Video, MessageSquare, Calendar as CalendarIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import NavBar from '@/components/NavBar';

export interface Consultation {
  id: string;
  doctorId: string;
  patientId: string;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'ongoing' | 'completed' | 'canceled';
  date: Date;
  notes?: string;
}

// Mock data for past consultations (will be replaced with Supabase data)
const mockPastConsultations: Consultation[] = [
  {
    id: 'c1',
    doctorId: '1',
    patientId: 'p1',
    type: 'video',
    status: 'completed',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    notes: 'Follow-up in 2 weeks',
  },
  {
    id: 'c2',
    doctorId: '2',
    patientId: 'p1',
    type: 'chat',
    status: 'completed',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    notes: 'Prescription sent',
  },
];

// Mock data for upcoming consultations (will be replaced with Supabase data)
const mockUpcomingConsultations: Consultation[] = [
  {
    id: 'c3',
    doctorId: '3',
    patientId: 'p1',
    type: 'video',
    status: 'scheduled',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    id: 'c4',
    doctorId: '1',
    patientId: 'p1',
    type: 'audio',
    status: 'scheduled',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
];

const Teleconsultation: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filteredDoctors } = useDoctors();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [upcomingConsultations, setUpcomingConsultations] = useState<Consultation[]>(mockUpcomingConsultations);
  const [pastConsultations, setPastConsultations] = useState<Consultation[]>(mockPastConsultations);
  const [isInConsultation, setIsInConsultation] = useState(false);
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'chat'>('video');
  const [currentChat, setCurrentChat] = useState<{ messages: any[] }>({ messages: [] });
  const [messageInput, setMessageInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  // Function to start a consultation
  const startConsultation = async (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setConsultationType(consultation.type);
    setIsInConsultation(true);

    if (consultation.type === 'video' || consultation.type === 'audio') {
      try {
        // Request user media (camera and/or microphone)
        const constraints = {
          video: consultation.type === 'video',
          audio: true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Display the local video stream if video consultation
        if (videoRef.current && consultation.type === 'video') {
          videoRef.current.srcObject = stream;
        }

        // Initialize Twilio or other service here in a real implementation
        toast({
          title: t('teleconsultation.connecting'),
          description: t('teleconsultation.pleaseWait'),
        });

        // Simulate connection delay
        setTimeout(() => {
          toast({
            title: t('teleconsultation.connected'),
            description: t('teleconsultation.consultationStarted'),
          });
        }, 2000);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: t('teleconsultation.mediaError'),
          description: t('teleconsultation.permissionDenied'),
          variant: 'destructive',
        });
        setIsInConsultation(false);
      }
    } else {
      // For chat consultations
      setCurrentChat({ messages: [] });
    }
  };

  // Function to end consultation
  const endConsultation = () => {
    // Stop all media streams
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsInConsultation(false);
    setSelectedConsultation(null);

    toast({
      title: t('teleconsultation.consultationEnded'),
      description: t('teleconsultation.summary'),
    });
  };

  // Function to send a chat message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'patient',
      text: messageInput,
      timestamp: new Date(),
    };

    setCurrentChat(prev => ({
      messages: [...prev.messages, newMessage],
    }));

    setMessageInput('');

    // Simulate doctor response after a short delay
    setTimeout(() => {
      const doctorResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        text: t('teleconsultation.simulatedResponse'),
        timestamp: new Date(),
      };

      setCurrentChat(prev => ({
        messages: [...prev.messages, doctorResponse],
      }));
    }, 3000);
  };

  // Helper function to safely get user display name
  const getUserDisplayName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.name) return user.name;
    return 'You';
  };

  // Get doctor information for a consultation
  function getDoctorForConsultation(doctorId: string) {
    // This would typically fetch from a doctor store or API
    return {
      name: 'Dr. Smith',
      specialty: 'General Practitioner',
      avatar: '/placeholder-avatar.jpg'
    };
  }

  // Format date for display
  const formatConsultationDate = (date: Date) => {
    return format(date, 'PPP p');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        {isInConsultation ? (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={getDoctorForConsultation(selectedConsultation?.doctorId || '').avatar} />
                      <AvatarFallback>{getDoctorForConsultation(selectedConsultation?.doctorId || '').name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{getDoctorForConsultation(selectedConsultation?.doctorId || '').name}</CardTitle>
                      <CardDescription>{getDoctorForConsultation(selectedConsultation?.doctorId || '').specialty}</CardDescription>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={endConsultation}>
                    {t('teleconsultation.endConsultation')}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {consultationType === 'video' && (
                  <div className="teleconsultation-video">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 md:h-80 bg-gray-900 rounded-lg"
                        />
                        <div className="absolute bottom-4 left-4 text-white px-2 py-1 bg-black/50 rounded">
                          {getUserDisplayName()} (You)
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full h-64 md:h-80 bg-gray-800 rounded-lg flex items-center justify-center">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={getDoctorForConsultation(selectedConsultation?.doctorId || '').avatar} />
                            <AvatarFallback>{getDoctorForConsultation(selectedConsultation?.doctorId || '').name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white px-2 py-1 bg-black/50 rounded">
                          {getDoctorForConsultation(selectedConsultation?.doctorId || '').name}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-4 space-x-2">
                      <Button variant="outline" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {consultationType === 'audio' && (
                  <div className="teleconsultation-audio">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="text-center">
                        <Avatar className="w-32 h-32 mx-auto">
                          <AvatarImage src="" />
                          <AvatarFallback>{getUserDisplayName().charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="mt-2 text-lg font-medium">{getUserDisplayName()} (You)</div>
                        <div className="text-sm text-gray-500">Speaking...</div>
                      </div>
                      <div className="text-center">
                        <Avatar className="w-32 h-32 mx-auto">
                          <AvatarImage src={getDoctorForConsultation(selectedConsultation?.doctorId || '').avatar} />
                          <AvatarFallback>{getDoctorForConsultation(selectedConsultation?.doctorId || '').name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="mt-2 text-lg font-medium">{getDoctorForConsultation(selectedConsultation?.doctorId || '').name}</div>
                        <div className="text-sm text-gray-500">Listening...</div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-8 space-x-4">
                      <Button variant="outline" size="icon">
                        <Phone className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {consultationType === 'chat' && (
                  <div className="teleconsultation-chat">
                    <div className="h-96 overflow-y-auto p-4 bg-gray-100 rounded mb-4">
                      {currentChat.messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <MessageSquare className="h-12 w-12 mb-2" />
                          <p>{t('teleconsultation.startChatting')}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentChat.messages.map((msg: any) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.sender === 'patient' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                                  msg.sender === 'patient'
                                    ? 'bg-medical-blue text-white rounded-tr-none'
                                    : 'bg-white border rounded-tl-none'
                                }`}
                              >
                                <p>{msg.text}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {format(msg.timestamp, 'p')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <form onSubmit={sendMessage} className="flex space-x-2">
                      <Input
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        placeholder={t('teleconsultation.typeMessage')}
                        className="flex-1"
                      />
                      <Button type="submit">{t('teleconsultation.send')}</Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>Consultation listings will appear here</div>
        )}
      </main>
    </div>
  );
};

// Export with auth HOC
export default withAuth(Teleconsultation);
