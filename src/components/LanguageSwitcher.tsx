
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Globe } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full flex items-center justify-center gap-1.5 hover:bg-gray-100/50 transition-colors border-medical-blue"
        >
          <Globe className="h-4 w-4 text-medical-blue" />
          <span className="text-xs font-medium uppercase hidden sm:inline-block">
            {language === 'fr' ? '🇫🇷 FR' : language === 'ar' ? '🇲🇦 AR' : '🇬🇧 EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`cursor-pointer flex items-center space-x-2 ${language === lang.code ? 'font-bold bg-blue-50' : ''}`}
            onClick={() => setLanguage(lang.code as any)}
          >
            <span className="text-base mr-2">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
