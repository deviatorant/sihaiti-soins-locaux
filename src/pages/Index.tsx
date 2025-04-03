
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import ServiceCard from "@/components/ServiceCard";
import LocationMap from "@/components/LocationMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Video, 
  Calendar, 
  Search, 
  User, 
  Ambulance, 
  Home as HomeIcon, 
  Stethoscope, 
  Activity,
  HeartPulse,
  Clock,
  Pill
} from "lucide-react";

const Index = () => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Services data organized by category
  const serviceCategoriesData = [
    {
      id: "appointments",
      title: t('home.appointments'),
      services: [
        {
          id: 1,
          title: t('services.appointment'),
          description: t('services.appointmentDesc'),
          icon: Calendar,
          path: "/appointments",
          isHomecare: false,
          isTeleconsultation: false,
          isEmergency: false
        },
        {
          id: 2,
          title: t('services.teleconsultation'),
          description: t('services.teleconsultationDesc'),
          icon: Video,
          path: "/services/teleconsultation",
          isHomecare: false,
          isTeleconsultation: true,
          isEmergency: false
        }
      ]
    },
    {
      id: "homecare",
      title: t('home.homecare'),
      services: [
        {
          id: 3,
          title: t('services.homecare'),
          description: t('services.homecareDesc'),
          icon: HomeIcon,
          path: "/services/homecare",
          isHomecare: true,
          isTeleconsultation: false,
          isEmergency: false
        },
        {
          id: 4,
          title: t('services.physiotherapy'),
          description: t('services.physiotherapyDesc'),
          icon: Activity,
          path: "/services/physiotherapy",
          isHomecare: true,
          isTeleconsultation: false,
          isEmergency: false
        },
        {
          id: 5,
          title: t('services.bloodTest'),
          description: t('services.bloodTestDesc'),
          icon: HeartPulse,
          path: "/services/bloodtest",
          isHomecare: true,
          isTeleconsultation: false,
          isEmergency: false
        },
        {
          id: 6,
          title: t('services.nursing'),
          description: t('services.nursingDesc'),
          icon: Stethoscope,
          path: "/services/nursing",
          isHomecare: true,
          isTeleconsultation: false,
          isEmergency: false
        }
      ]
    },
    {
      id: "emergency",
      title: t('home.emergency'),
      services: [
        {
          id: 7,
          title: t('services.emergency'),
          description: t('services.emergencyDesc'),
          icon: Clock,
          path: "/services/emergency",
          isHomecare: false,
          isTeleconsultation: false,
          isEmergency: true
        },
        {
          id: 8,
          title: t('services.ambulance'),
          description: t('services.ambulanceDesc'),
          icon: Ambulance,
          path: "/services/ambulance",
          isHomecare: false,
          isTeleconsultation: false,
          isEmergency: true
        }
      ]
    },
    {
      id: "more",
      title: t('home.moreServices'),
      services: [
        {
          id: 9,
          title: t('services.doctors'),
          description: t('services.doctorsDesc'),
          icon: User,
          path: "/doctors",
          isHomecare: false,
          isTeleconsultation: false,
          isEmergency: false
        },
        {
          id: 10,
          title: t('services.pharmacy'),
          description: t('services.pharmacyDesc'),
          icon: Pill,
          path: "/shop/pharmacy",
          isHomecare: false,
          isTeleconsultation: false,
          isEmergency: false
        }
      ]
    }
  ];

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // To implement: search logic
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-medical-blue to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.welcome')}</h1>
          <p className="text-xl mb-8">{t('home.tagline')}</p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder={t('general.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white text-black pl-10 h-12 rounded-full"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Button 
                type="submit" 
                className="absolute right-1 top-1 rounded-full bg-medical-blue h-10"
              >
                {t('general.search')}
              </Button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Services Sections - Organized by category */}
      {serviceCategoriesData.map((category) => (
        <section key={category.id} className="py-8 first:pt-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">{category.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  isEmergency={service.isEmergency}
                  isTeleconsultation={service.isTeleconsultation}
                  isHomecare={service.isHomecare}
                  onClick={() => handleServiceClick(service.path)}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
      
      {/* Map Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{t('services.nearbyProfessionals')}</h2>
          <LocationMap />
        </div>
      </section>
      
      {/* Quick Access Section */}
      <section className="py-12 bg-medical-light">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('home.quickAccess')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="appointment-card flex items-center p-6 bg-white rounded-lg shadow-sm">
              <Calendar className="h-8 w-8 text-medical-blue mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{t('appointments.book')}</h3>
                <p className="text-sm text-gray-600">{t('appointments.bookDesc')}</p>
              </div>
            </div>
            
            <div className="appointment-card flex items-center p-6 bg-white rounded-lg shadow-sm">
              <Search className="h-8 w-8 text-medical-blue mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{t('doctors.directory')}</h3>
                <p className="text-sm text-gray-600">{t('doctors.directoryDesc')}</p>
              </div>
            </div>
            
            <div className="appointment-card flex items-center p-6 bg-white rounded-lg shadow-sm">
              <User className="h-8 w-8 text-medical-blue mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{t('shop.products')}</h3>
                <p className="text-sm text-gray-600">{t('shop.productsDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">SIHATI</h2>
              <p className="text-gray-400">© 2023 SIHATI. Tous droits réservés.</p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="hover:text-medical-blue">Conditions</a>
              <a href="#" className="hover:text-medical-blue">Confidentialité</a>
              <a href="#" className="hover:text-medical-blue">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
