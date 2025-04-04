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

  const startConsultation = async (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setConsultationType(consultation.type);
    setIsInConsultation(true);

    if (consultation.type === 'video' || consultation.type === 'audio') {
      try {
        const constraints = {
          video: consultation.type === 'video',
          audio: true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current && consultation.type === 'video') {
          videoRef.current.srcObject = stream;
        }

        toast({
          title: t('teleconsultation.connecting'),
          description: t('teleconsultation.pleaseWait'),
        });

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
      setCurrentChat({ messages: [] });
    }
  };

  const endConsultation = () => {
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

  const getDoctorForConsultation = (doctorId: string) => {
    return filteredDoctors.find(d => d.id === doctorId) || { name: 'Unknown Doctor', avatar: '', specialty: '' };
  };

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
                          {user?.name || 'You'} (You)
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
                          <AvatarFallback>{user?.name?.charAt(0) || 'Y'}</AvatarFallback>
                        </Avatar>
                        <div className="mt-2 text-lg font-medium">{user?.name || 'You'} (You)</div>
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('teleconsultation.title')}</h1>
            
            <Tabs defaultValue="upcoming" className="mb-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upcoming">{t('teleconsultation.upcomingConsultations')}</TabsTrigger>
                <TabsTrigger value="past">{t('teleconsultation.pastConsultations')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingConsultations.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-gray-500">{t('teleconsultation.noUpcomingConsultations')}</p>
                      <Button onClick={() => navigate('/doctors')} className="mt-4">
                        {t('teleconsultation.findDoctor')}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {upcomingConsultations.map(consultation => (
                      <Card key={consultation.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={getDoctorForConsultation(consultation.doctorId).avatar} />
                                <AvatarFallback>{getDoctorForConsultation(consultation.doctorId).name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{getDoctorForConsultation(consultation.doctorId).name}</h3>
                                <p className="text-sm text-gray-500">{getDoctorForConsultation(consultation.doctorId).specialty}</p>
                                <div className="flex items-center mt-1 text-sm">
                                  <CalendarIcon className="h-3 w-3 mr-1 text-gray-400" />
                                  <span>{formatConsultationDate(consultation.date)}</span>
                                  
                                  {consultation.type === 'video' && <Video className="h-3 w-3 ml-2 mr-1 text-gray-400" />}
                                  {consultation.type === 'audio' && <Phone className="h-3 w-3 ml-2 mr-1 text-gray-400" />}
                                  {consultation.type === 'chat' && <MessageSquare className="h-3 w-3 ml-2 mr-1 text-gray-400" />}
                                  <span className="capitalize">{consultation.type}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Button
                                variant="default"
                                disabled={new Date() > consultation.date || new Date() < new Date(consultation.date.getTime() - 10 * 60 * 1000)}
                                onClick={() => startConsultation(consultation)}
                              >
                                {new Date() > consultation.date
                                  ? t('teleconsultation.missed')
                                  : new Date() > new Date(consultation.date.getTime() - 10 * 60 * 1000)
                                    ? t('teleconsultation.joinNow')
                                    : t('teleconsultation.notYetAvailable')}
                              </Button>
                              <Button variant="outline">
                                {t('teleconsultation.reschedule')}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastConsultations.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-gray-500">{t('teleconsultation.noPastConsultations')}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pastConsultations.map(consultation => (
                      <Card key={consultation.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={getDoctorForConsultation(consultation.doctorId).avatar} />
                                <AvatarFallback>{getDoctorForConsultation(consultation.doctorId).name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{getDoctorForConsultation(consultation.doctorId).name}</h3>
                                <p className="text-sm text-gray-500">{getDoctorForConsultation(consultation.doctorId).specialty}</p>
                                <div className="flex items-center mt-1 text-sm">
                                  <CalendarIcon className="h-3 w-3 mr-1 text-gray-400" />
                                  <span>{formatConsultationDate(consultation.date)}</span>
                                  
                                  {consultation.type === 'video' && <Video className="h-3 w-3 ml-2 mr-1 text-gray-400" />}
                                  {consultation.type === 'audio' && <Phone className="h-3 w-3 ml-2 mr-1 text-gray-400" />}
                                  {consultation.type === 'chat' && <MessageSquare className="h-3 w-3 ml-2 mr-1 text-gray-400" />}
                                  <span className="capitalize">{consultation.type}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline">
                                {t('teleconsultation.viewSummary')}
                              </Button>
                              <Button variant="outline">
                                {t('teleconsultation.bookFollowUp')}
                              </Button>
                            </div>
                          </div>
                          {consultation.notes && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm font-semibold">{t('teleconsultation.doctorNotes')}:</p>
                              <p className="text-sm">{consultation.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('teleconsultation.scheduleNew')}</CardTitle>
                <CardDescription>{t('teleconsultation.scheduleDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">{t('teleconsultation.selectDate')}</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="border rounded-md"
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        date > new Date(new Date().setDate(new Date().getDate() + 30))
                      }
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">{t('teleconsultation.selectTime')}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', 
                       '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map((time) => (
                        <Button key={time} variant="outline" className="text-sm">
                          {time}
                        </Button>
                      ))}
                    </div>
                    
                    <h3 className="font-medium mt-6 mb-2">{t('teleconsultation.consultationType')}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="flex flex-col items-center p-4">
                        <Video className="h-5 w-5 mb-1" />
                        <span className="text-xs">{t('teleconsultation.videoCall')}</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center p-4">
                        <Phone className="h-5 w-5 mb-1" />
                        <span className="text-xs">{t('teleconsultation.audioCall')}</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center p-4">
                        <MessageSquare className="h-5 w-5 mb-1" />
                        <span className="text-xs">{t('teleconsultation.chat')}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/doctors')} className="w-full md:w-auto">
                  {t('teleconsultation.findDoctorToSchedule')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default withAuth(Teleconsultation);
