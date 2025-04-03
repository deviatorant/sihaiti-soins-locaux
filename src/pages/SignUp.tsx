
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SignUp = () => {
  const { t, isRTL } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up with phone:", phoneNumber, "name:", name);
    // À implémenter: logique d'inscription
  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google");
    // À implémenter: logique d'inscription Google
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-medical-light p-4">
      <Card className={`w-full max-w-md shadow-lg ${isRTL ? 'text-right' : 'text-left'}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-medical-blue">
            SIHATI
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.signup')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phoneNumber')}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+212 6XX-XXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-white"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <Button type="submit" className="w-full bg-medical-blue hover:bg-medical-blue/90">
              {t('auth.signup')}
            </Button>
          </form>

          <div className="flex items-center my-4">
            <Separator className="flex-1" />
            <span className="px-3 text-sm text-gray-500">{t('auth.or')}</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
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
            {t('auth.continueWithGoogle')}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-medical-blue hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
