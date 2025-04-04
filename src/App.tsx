import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { TranslationProvider } from "@/hooks/useTranslation";
import { AuthProvider } from "@/providers/AuthProvider";
import { DoctorsProvider } from "@/hooks/useDoctors";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppSetup = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeAllServices();
        console.log('App initialization complete');
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    if (location.pathname === '/') {
      initializeApp();
    }
  }, [location.pathname]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TranslationProvider>
          <DoctorsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
            </BrowserRouter>
          </DoctorsProvider>
        </TranslationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
