
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { Facebook, Mail, Phone, Smartphone, User, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithPhone, loginWithGoogle, loginWithFacebook, continueAsGuest, sendOTP } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneAuthError, setPhoneAuthError] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  
  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error) {
      const errorMessage = errorDescription || `Authentication error: ${error}`;
      setOauthError(errorMessage);
      console.error('OAuth error from URL:', error, errorDescription);
    }
  }, [location]);
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      try {
        await login(email, password);
        navigate("/");
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: t('login.loginError'),
        description: t('login.enterCredentials'),
        variant: "destructive",
      });
    }
  };
  
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneAuthError(null);
    
    // Format phone number (ensure it has country code)
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+212${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
    
    if (!isOtpSent) {
      setIsLoading(true);
      try {
        await sendOTP(formattedPhone);
        setIsOtpSent(true);
      } catch (error: any) {
        console.error('Phone auth error:', error);
        if (error?.message?.includes('Unsupported provider') || 
            error?.message?.includes('not enabled') || 
            error?.error_description?.includes('not enabled')) {
          setPhoneAuthError("L'authentification par téléphone n'est pas activée. Veuillez utiliser l'email ou les réseaux sociaux.");
        } else {
          setPhoneAuthError(error?.message || "Échec de l'envoi du code OTP. Veuillez essayer une autre méthode de connexion.");
        }
      } finally {
        setIsLoading(false);
      }
    } else if (otp.length === 6) {
      setIsLoading(true);
      try {
        await loginWithPhone(formattedPhone, otp);
        navigate("/");
      } catch (error: any) {
        console.error('OTP verification error:', error);
        setPhoneAuthError(error?.message || "Échec de la vérification du code OTP. Veuillez réessayer ou utiliser une autre méthode de connexion.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: t('login.otpError'),
        description: t('login.enterValidOtp'),
        variant: "destructive",
      });
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setOauthError(null);
    try {
      await loginWithGoogle();
      // Redirect happens in the OAuth flow
    } catch (error: any) {
      console.error('Google login error:', error);
      setOauthError(error?.message || "Échec de la connexion avec Google. Veuillez réessayer ou utiliser une autre méthode.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setOauthError(null);
    try {
      await loginWithFacebook();
      // Redirect happens in the OAuth flow
    } catch (error: any) {
      console.error('Facebook login error:', error);
      setOauthError(error?.message || "Échec de la connexion avec Facebook. Veuillez réessayer ou utiliser une autre méthode.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await continueAsGuest();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{t('login.title')}</CardTitle>
              <CardDescription>{t('login.description')}</CardDescription>
            </CardHeader>
            
            <CardContent>
              {oauthError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur d'authentification</AlertTitle>
                  <AlertDescription>{oauthError}</AlertDescription>
                </Alert>
              )}
              
              <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertTitle>Configuration Supabase requise</AlertTitle>
                <AlertDescription className="text-sm">
                  Pour que l'authentification Google et téléphone fonctionne, vous devez configurer 
                  ces fournisseurs dans votre projet Supabase. Allez dans Authentication &gt; Providers 
                  et activez Google et Phone.
                </AlertDescription>
              </Alert>
              
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="email">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('login.emailTab')}
                  </TabsTrigger>
                  <TabsTrigger value="phone">
                    <Phone className="mr-2 h-4 w-4" />
                    {t('login.phoneTab')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('login.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t('login.password')}</Label>
                        <a href="#" className="text-sm text-medical-blue hover:underline">
                          {t('login.forgotPassword')}
                        </a>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-medical-blue hover:bg-medical-blue/90"
                      disabled={isLoading}
                    >
                      {isLoading ? t('common.loading') : t('login.loginButton')}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="phone">
                  <form onSubmit={handlePhoneLogin} className="space-y-4">
                    {phoneAuthError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Erreur d'authentification</AlertTitle>
                        <AlertDescription>{phoneAuthError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('login.phoneNumber')}</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                          +212
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="6XX-XXXXXX"
                          className="rounded-l-none"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isOtpSent || isLoading}
                        />
                      </div>
                    </div>
                    
                    {isOtpSent && (
                      <div className="space-y-2">
                        <Label htmlFor="otp">{t('login.enterOtp')}</Label>
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={setOtp}
                          disabled={isLoading}
                          render={({ slots }) => (
                            <InputOTPGroup>
                              {slots.map((slot, i) => (
                                <InputOTPSlot key={i} {...slot} index={i} />
                              ))}
                            </InputOTPGroup>
                          )}
                        />
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-medical-blue hover:bg-medical-blue/90"
                      disabled={isLoading}
                    >
                      {isLoading ? 
                        t('common.loading') : 
                        (isOtpSent ? t('login.verifyOtp') : t('login.sendOtp'))}
                    </Button>
                    
                    {isOtpSent && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setIsOtpSent(false);
                          setOtp("");
                          setPhoneAuthError(null);
                        }}
                        disabled={isLoading}
                      >
                        {t('login.changePhoneNumber')}
                      </Button>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {t('login.orContinueWith')}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 18.0004 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  Google
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                >
                  <Facebook className="h-5 w-5 mr-2 text-[#1877F2]" />
                  Facebook
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                <User className="h-5 w-5 mr-2" />
                {t('login.continueAsGuest')}
              </Button>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                {t('login.noAccount')}{' '}
                <Link to="/signup" className="text-medical-blue hover:underline">
                  {t('login.createAccount')}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
