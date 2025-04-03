
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import NavBar from "@/components/NavBar";
import ServiceCard from "@/components/ServiceCard";
import LocationMap from "@/components/LocationMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, User, Ambulance, Home as HomeIcon, Calendar as CalendarIcon } from "lucide-react";

const Index = () => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Données de services (à déplacer vers un fichier de données plus tard)
  const services = [
    {
      id: 1,
      title: t('services.homecare'),
      description: "Des soins médicaux professionnels dans le confort de votre domicile.",
      icon: HomeIcon,
      path: "/services/homecare",
      isEmergency: false
    },
    {
      id: 2,
      title: t('services.physiotherapy'),
      description: "Séances de kinésithérapie à domicile par des professionnels certifiés.",
      icon: User,
      path: "/services/physiotherapy",
      isEmergency: false
    },
    {
      id: 3,
      title: t('services.emergency'),
      description: "Intervention médicale rapide à votre domicile en cas d'urgence.",
      icon: User,
      path: "/services/emergency",
      isEmergency: true
    },
    {
      id: 4,
      title: t('services.ambulance'),
      description: "Service d'ambulance rapide avec suivi en temps réel.",
      icon: Ambulance,
      path: "/services/ambulance",
      isEmergency: true
    }
  ];

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // À implémenter: logique de recherche
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
      
      {/* Services Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('home.findServices')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                isEmergency={service.isEmergency}
                onClick={() => handleServiceClick(service.path)}
              />
            ))}
          </div>
        </div>
      </section>
      
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="appointment-card flex items-center p-6">
              <CalendarIcon className="h-8 w-8 text-medical-blue mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{t('appointments.book')}</h3>
                <p className="text-sm text-gray-600">Planifiez votre prochain rendez-vous</p>
              </div>
            </div>
            
            <div className="appointment-card flex items-center p-6">
              <Search className="h-8 w-8 text-medical-blue mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{t('doctors.directory')}</h3>
                <p className="text-sm text-gray-600">Trouvez le bon spécialiste</p>
              </div>
            </div>
            
            <div className="appointment-card flex items-center p-6">
              <User className="h-8 w-8 text-medical-blue mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{t('shop.products')}</h3>
                <p className="text-sm text-gray-600">Parcourez notre boutique médicale</p>
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
