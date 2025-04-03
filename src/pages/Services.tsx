
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocationMap from "@/components/LocationMap";
import { 
  Search,
  Heart, 
  Stethoscope, 
  Pill, 
  Phone, 
  VideoIcon, 
  Ambulance, 
  Home, 
  Activity, 
  Droplets, 
  UserPlus,
  MapPin
} from "lucide-react";

const Services = () => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleServiceClick = (serviceType: string) => {
    console.log(`Service clicked: ${serviceType}`);
    // Navigate to the specific service page
    navigate(`/service/${serviceType}`);
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-medical-blue">
          {t('services.title')}
        </h1>

        {/* Search bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
          <Input
            type="text"
            placeholder={t('general.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Services Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t('services.teleconsultation')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title={t('services.appointment')}
              description={t('services.appointmentDesc')}
              icon={Phone}
              isTeleconsultation={true}
              onClick={() => handleServiceClick('appointment')}
            />
            <ServiceCard
              title={t('services.teleconsultation')}
              description={t('services.teleconsultationDesc')}
              icon={VideoIcon}
              isTeleconsultation={true}
              onClick={() => handleServiceClick('teleconsultation')}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t('services.homecare')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title={t('services.bloodTest')}
              description={t('services.bloodTestDesc')}
              icon={Droplets}
              isHomecare={true}
              onClick={() => handleServiceClick('blood-test')}
            />
            <ServiceCard
              title={t('services.nursing')}
              description={t('services.nursingDesc')}
              icon={Heart}
              isHomecare={true}
              onClick={() => handleServiceClick('nursing')}
            />
            <ServiceCard
              title={t('services.physiotherapy')}
              description={t('services.physiotherapyDesc')}
              icon={Activity}
              isHomecare={true}
              onClick={() => handleServiceClick('physiotherapy')}
            />
            <ServiceCard
              title={t('services.homecare')}
              description={t('services.homecareDesc')}
              icon={Home}
              isHomecare={true}
              onClick={() => handleServiceClick('homecare')}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t('services.emergency')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title={t('services.emergency')}
              description={t('services.emergencyDesc')}
              icon={Stethoscope}
              isEmergency={true}
              onClick={() => handleServiceClick('emergency')}
            />
            <ServiceCard
              title={t('services.ambulance')}
              description={t('services.ambulanceDesc')}
              icon={Ambulance}
              isEmergency={true}
              onClick={() => handleServiceClick('ambulance')}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t('services.moreServices')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title={t('services.doctors')}
              description={t('services.doctorsDesc')}
              icon={UserPlus}
              onClick={() => handleServiceClick('doctors')}
            />
            <ServiceCard
              title={t('services.pharmacy')}
              description={t('services.pharmacyDesc')}
              icon={Pill}
              onClick={() => handleServiceClick('pharmacy')}
            />
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t('services.nearbyProfessionals')}
          </h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <LocationMap />
            <div className="flex justify-center mt-4">
              <Button 
                className="bg-medical-blue hover:bg-medical-blue/90 flex items-center gap-2"
                onClick={() => handleServiceClick('map')}
              >
                <MapPin size={18} />
                {t('general.viewMore')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;
