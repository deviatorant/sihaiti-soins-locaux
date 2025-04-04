
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { initializeAllServices } from "@/services/supabase";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import Shop from "./pages/Shop";
import Pharmacy from "./pages/Pharmacy";
import HomeCare from "./pages/HomeCare";
import Teleconsultation from "./pages/Teleconsultation";
import Profile from "./pages/Profile";

// Component to handle setup when the app first loads
const AppSetup = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize all services (database, OAuth, Twilio, Mapbox, Calendar)
        await initializeAllServices();
        console.log('App initialization complete');
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    // Only run setup if we're on the main page
    if (location.pathname === '/') {
      initializeApp();
    }
  }, [location.pathname]);

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <AppSetup>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:serviceType" element={<ServiceDetail />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/homecare" element={<HomeCare />} />
        <Route path="/teleconsultation" element={<Teleconsultation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppSetup>
  );
};

export default AppRoutes;
