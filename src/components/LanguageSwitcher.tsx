
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleLanguage}
      title={t('general.language')}
      className="rounded-full"
    >
      <Languages className="h-5 w-5" />
      <span className="ml-2 text-xs font-semibold">{language === 'fr' ? 'FR' : 'عر'}</span>
    </Button>
  );
};

export default LanguageSwitcher;
