
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "@/hooks/useTranslation";
import { AuthProvider } from "@/hooks/useAuth";
import { DoctorsProvider } from "@/hooks/useDoctors";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TranslationProvider>
          <DoctorsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
            </BrowserRouter>
          </DoctorsProvider>
        </TranslationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
