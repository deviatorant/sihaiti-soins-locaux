
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Phone, User, Facebook, ArrowRight } from "lucide-react";

const Login = () => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const { login, loginWithPhone, loginWithGoogle, loginWithFacebook, continueAsGuest, register } = useAuth();
  const { toast } = useToast();
  
  // Login with email/password states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Login with phone states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Register states
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      await login(email, password);
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeBack'),
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: t('auth.loginFailed'),
        description: t('auth.invalidCredentials'),
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleSendOtp = async () => {
    if (!phone) return;
    
    try {
      // Here we would normally call an API to send OTP
      // For mock demo, we'll just set the state
      setOtpSent(true);
      toast({
        title: t('auth.otpSent'),
        description: t('auth.checkPhone'),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t('auth.otpFailed'),
        description: t('auth.tryAgain'),
        variant: "destructive",
      });
    }
  };
  
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      await loginWithPhone(phone, otp);
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeBack'),
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: t('auth.verificationFailed'),
        description: t('auth.invalidOtp'),
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      toast({
        title: t('auth.loginFailed'),
        description: t('auth.tryAgain'),
        variant: "destructive",
      });
    }
  };
  
  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      navigate("/");
    } catch (error) {
      toast({
        title: t('auth.loginFailed'),
        description: t('auth.tryAgain'),
        variant: "destructive",
      });
    }
  };
  
  const handleGuestLogin = () => {
    continueAsGuest();
    toast({
      title: t('auth.guestMode'),
      description: t('auth.guestDescription'),
    });
    navigate("/");
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== confirmPassword) {
      toast({
        title: t('auth.passwordMismatch'),
        description: t('auth.passwordsMustMatch'),
        variant: "destructive",
      });
      return;
    }
    
    setIsRegistering(true);
    
    try {
      await register(registerEmail, registerPassword, firstName, lastName);
      toast({
        title: t('auth.registrationSuccess'),
        description: t('auth.accountCreated'),
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: t('auth.registrationFailed'),
        description: t('auth.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <NavBar />
      <main className="container px-4 py-8 mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-medical-blue">
              {t('auth.welcome')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.continueToAccount')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="email">{t('auth.email')}</TabsTrigger>
                <TabsTrigger value="phone">{t('auth.phone')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
              </TabsList>
              
              {/* Email/Password Login */}
              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth.enterEmail')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">{t('auth.password')}</Label>
                      <a href="#" className="text-xs text-medical-blue hover:underline">
                        {t('auth.forgotPassword')}
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.enterPassword')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-medical-blue hover:bg-medical-blue/90"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? t('auth.loggingIn') : t('auth.login')}
                  </Button>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        {t('auth.orContinueWith')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      className="flex items-center justify-center"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFacebookLogin}
                      className="flex items-center justify-center"
                    >
                      <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                      Facebook
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Phone OTP Login */}
              <TabsContent value="phone">
                <div className="space-y-4">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('auth.phoneNumber')}</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+212 6XX XXXXXX"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        onClick={handleSendOtp}
                        className="w-full bg-medical-blue hover:bg-medical-blue/90"
                        disabled={!phone}
                      >
                        {t('auth.sendOtp')}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">{t('auth.otpCode')}</Label>
                        <Input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-digit code"
                          maxLength={6}
                          className="text-center text-xl tracking-wider"
                          required
                        />
                        <p className="text-sm text-gray-500 text-center">
                          {t('auth.otpSentTo')} {phone}
                        </p>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setOtpSent(false)}
                          className="flex-1"
                        >
                          {t('auth.back')}
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-medical-blue hover:bg-medical-blue/90"
                          disabled={isVerifying || otp.length !== 6}
                        >
                          {isVerifying ? t('auth.verifying') : t('auth.verify')}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </TabsContent>
              
              {/* Registration */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder={t('auth.firstName')}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t('auth.lastName')}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerEmail"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder={t('auth.enterEmail')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerPassword"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder={t('auth.enterPassword')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('auth.confirmPassword')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-medical-blue hover:bg-medical-blue/90"
                    disabled={isRegistering}
                  >
                    {isRegistering ? t('auth.registering') : t('auth.createAccount')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              variant="ghost"
              onClick={handleGuestLogin}
              className="text-gray-500 hover:text-gray-700"
            >
              {t('auth.continueAsGuest')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Login;
