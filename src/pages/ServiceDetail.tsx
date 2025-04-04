
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, ArrowLeft, Check } from "lucide-react";

const ServiceDetail = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");

  useEffect(() => {
    // Set service title and description based on service type
    switch (serviceType) {
      case "appointment":
        setServiceTitle(t('services.appointment'));
        setServiceDescription(t('services.appointmentDesc'));
        break;
      case "teleconsultation":
        setServiceTitle(t('services.teleconsultation'));
        setServiceDescription(t('services.teleconsultationDesc'));
        break;
      case "blood-test":
        setServiceTitle(t('services.bloodTest'));
        setServiceDescription(t('services.bloodTestDesc'));
        break;
      case "nursing":
        setServiceTitle(t('services.nursing'));
        setServiceDescription(t('services.nursingDesc'));
        break;
      case "physiotherapy":
        setServiceTitle(t('services.physiotherapy'));
        setServiceDescription(t('services.physiotherapyDesc'));
        break;
      case "homecare":
        setServiceTitle(t('services.homecare'));
        setServiceDescription(t('services.homecareDesc'));
        break;
      case "emergency":
        setServiceTitle(t('services.emergency'));
        setServiceDescription(t('services.emergencyDesc'));
        break;
      case "ambulance":
        setServiceTitle(t('services.ambulance'));
        setServiceDescription(t('services.ambulanceDesc'));
        break;
      case "doctors":
        setServiceTitle(t('services.doctors'));
        setServiceDescription(t('services.doctorsDesc'));
        break;
      case "pharmacy":
        setServiceTitle(t('services.pharmacy'));
        setServiceDescription(t('services.pharmacyDesc'));
        break;
      default:
        setServiceTitle("Service");
        setServiceDescription("");
    }
  }, [serviceType, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      serviceType,
      date,
      time,
      address,
      notes
    });
    
    // Here would be the actual booking logic
    toast({
      title: t('services.bookingSuccess'),
      description: t('services.bookingConfirmation'),
      variant: "success"
    });
    
    // Redirect to services page after booking
    setTimeout(() => {
      navigate("/services");
    }, 1500);
  };

  const handleBack = () => {
    navigate("/services");
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          {t('general.back')}
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-medical-blue">
              {serviceTitle}
            </CardTitle>
            <p className="text-gray-600">{serviceDescription}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar size={16} />
                    {t('appointments.date')}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="bg-white"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock size={16} />
                    {t('appointments.time')}
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="bg-white"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              {(serviceType === "homecare" || serviceType === "blood-test" || 
                serviceType === "nursing" || serviceType === "physiotherapy" || 
                serviceType === "emergency" || serviceType === "ambulance") && (
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin size={16} />
                    {t('general.address')}
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="bg-white"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">
                  {t('general.notes')}
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white"
                  dir={isRTL ? 'rtl' : 'ltr'}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-medical-blue hover:bg-medical-blue/90 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                {t('services.book')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ServiceDetail;
