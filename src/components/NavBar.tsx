
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Menu, X, Home, Calendar, User, ShoppingCart } from "lucide-react";

const NavBar = () => {
  const { t, isRTL } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: t('nav.home'), path: "/", icon: Home },
    { label: t('nav.appointments'), path: "/appointments", icon: Calendar },
    { label: t('nav.services'), path: "/services", icon: User },
    { label: t('nav.shop'), path: "/shop", icon: ShoppingCart },
    { label: t('nav.doctors'), path: "/doctors", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-medical-blue">SIHATI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-medical-blue",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">{t('auth.login')}</Link>
          </Button>
          <Button className="bg-medical-blue hover:bg-medical-blue/90" size="sm" asChild>
            <Link to="/signup">{t('auth.signup')}</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)] bg-white md:hidden">
          <nav className="container grid gap-6 p-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 text-lg font-medium transition-colors hover:text-medical-blue",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
