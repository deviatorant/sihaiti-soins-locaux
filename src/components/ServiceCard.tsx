
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isEmergency?: boolean;
  isTeleconsultation?: boolean;
  isHomecare?: boolean;
  onClick?: () => void;
}

const ServiceCard = ({
  title,
  description,
  icon: Icon,
  isEmergency = false,
  isTeleconsultation = false,
  isHomecare = false,
  onClick
}: ServiceCardProps) => {
  const { isRTL } = useTranslation();
  
  return (
    <div 
      className={cn(
        "service-card cursor-pointer p-6 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105",
        isEmergency && "emergency-service bg-red-50 border-l-4 border-medical-red",
        isTeleconsultation && "teleconsultation-service bg-blue-50 border-l-4 border-medical-blue", 
        isHomecare && "homecare-service bg-green-50 border-l-4 border-medical-green",
        !isEmergency && !isTeleconsultation && !isHomecare && "bg-white border border-gray-200",
        isRTL ? "text-right" : "text-left",
        // Handle border direction for RTL
        isRTL && isEmergency && "border-r-4 border-l-0 border-medical-red",
        isRTL && isTeleconsultation && "border-r-4 border-l-0 border-medical-blue",
        isRTL && isHomecare && "border-r-4 border-l-0 border-medical-green"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={title}
    >
      <div className={cn(
        "service-icon inline-flex items-center justify-center w-12 h-12 rounded-full mb-4",
        isEmergency && "bg-red-100 text-medical-red",
        isTeleconsultation && "bg-blue-100 text-medical-blue",
        isHomecare && "bg-green-100 text-medical-green",
        !isEmergency && !isTeleconsultation && !isHomecare && "bg-gray-100 text-gray-600"
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;
