
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { VideoIcon, MessageSquare, PhoneCall } from "lucide-react";

const Teleconsultation = () => {
  const { t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState("video");
  
  const handleStartConsultation = (type: string) => {
    console.log(`Starting ${type} consultation`);
    // This would initiate the actual consultation
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-medical-blue">
          {t('services.teleconsultation')}
        </h1>
        
        <Tabs 
          defaultValue="video" 
          className="w-full max-w-4xl mx-auto"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <VideoIcon className="h-4 w-4" />
              {t('teleconsultation.video')}
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              {t('teleconsultation.audio')}
            </TabsTrigger>
            <TabsTrigger value="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('teleconsultation.message')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="video">
            <Card>
              <CardHeader>
                <CardTitle>{t('teleconsultation.videoTitle')}</CardTitle>
                <CardDescription>
                  {t('teleconsultation.videoDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-64 md:h-96 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-4">
                    <VideoIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">{t('teleconsultation.cameraPlaceholder')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-2">{t('teleconsultation.availableDoctors')}</h3>
                    {[1, 2, 3].map((doctor) => (
                      <div key={doctor} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                        <Avatar className="h-10 w-10">
                          <img src={`https://randomuser.me/api/portraits/men/${doctor + 20}.jpg`} alt="Doctor" />
                        </Avatar>
                        <div>
                          <p className="font-medium">Dr. {doctor === 1 ? 'Martin' : doctor === 2 ? 'Chen' : 'Kumar'}</p>
                          <p className="text-sm text-gray-500">{doctor === 1 ? 'Cardiologist' : doctor === 2 ? 'General Practitioner' : 'Pediatrician'}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => handleStartConsultation('video')}
                        >
                          {t('teleconsultation.select')}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-2">{t('teleconsultation.requirements')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="bg-green-100 p-1 rounded-full mt-0.5">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {t('teleconsultation.requirementCamera')}
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-100 p-1 rounded-full mt-0.5">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {t('teleconsultation.requirementMicrophone')}
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-100 p-1 rounded-full mt-0.5">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {t('teleconsultation.requirementInternet')}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                  onClick={() => handleStartConsultation('video')}
                >
                  {t('teleconsultation.startVideoConsultation')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="audio">
            <Card>
              <CardHeader>
                <CardTitle>{t('teleconsultation.audioTitle')}</CardTitle>
                <CardDescription>
                  {t('teleconsultation.audioDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-4">
                    <PhoneCall className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">{t('teleconsultation.audioPlaceholder')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-2">{t('teleconsultation.availableDoctors')}</h3>
                    {[1, 2, 3].map((doctor) => (
                      <div key={doctor} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                        <Avatar className="h-10 w-10">
                          <img src={`https://randomuser.me/api/portraits/women/${doctor + 30}.jpg`} alt="Doctor" />
                        </Avatar>
                        <div>
                          <p className="font-medium">Dr. {doctor === 1 ? 'Smith' : doctor === 2 ? 'Patel' : 'Garcia'}</p>
                          <p className="text-sm text-gray-500">{doctor === 1 ? 'Neurologist' : doctor === 2 ? 'Dermatologist' : 'Psychiatrist'}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => handleStartConsultation('audio')}
                        >
                          {t('teleconsultation.select')}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-2">{t('teleconsultation.requirements')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="bg-green-100 p-1 rounded-full mt-0.5">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {t('teleconsultation.requirementMicrophone')}
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-100 p-1 rounded-full mt-0.5">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {t('teleconsultation.requirementInternet')}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                  onClick={() => handleStartConsultation('audio')}
                >
                  {t('teleconsultation.startAudioConsultation')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="message">
            <Card>
              <CardHeader>
                <CardTitle>{t('teleconsultation.messageTitle')}</CardTitle>
                <CardDescription>
                  {t('teleconsultation.messageDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg h-64 md:h-80 p-4 mb-4">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">{t('teleconsultation.messagePlaceholder')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 rounded-lg border p-2" 
                        placeholder={t('teleconsultation.typeMessage')}
                      />
                      <Button size="sm">
                        {t('teleconsultation.send')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-2">{t('teleconsultation.availableDoctors')}</h3>
                    {[1, 2, 3].map((doctor) => (
                      <div key={doctor} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                        <Avatar className="h-10 w-10">
                          <img src={`https://randomuser.me/api/portraits/men/${doctor + 10}.jpg`} alt="Doctor" />
                        </Avatar>
                        <div>
                          <p className="font-medium">Dr. {doctor === 1 ? 'Jones' : doctor === 2 ? 'Wang' : 'Lopez'}</p>
                          <p className="text-sm text-gray-500">{doctor === 1 ? 'Orthopedist' : doctor === 2 ? 'Endocrinologist' : 'Ophthalmologist'}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => handleStartConsultation('message')}
                        >
                          {t('teleconsultation.select')}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-2">{t('teleconsultation.benefits')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                          <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        {t('teleconsultation.benefitConvenient')}
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                          <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        {t('teleconsultation.benefitDiscreet')}
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                          <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        {t('teleconsultation.benefitFlexible')}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                  onClick={() => handleStartConsultation('message')}
                >
                  {t('teleconsultation.startMessageConsultation')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Teleconsultation;
