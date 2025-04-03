
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isEmergency?: boolean;
  onClick?: () => void;
}

const ServiceCard = ({
  title,
  description,
  icon: Icon,
  isEmergency = false,
  onClick
}: ServiceCardProps) => {
  const { isRTL } = useTranslation();
  
  return (
    <div 
      className={cn(
        "service-card cursor-pointer",
        isEmergency && "emergency-service",
        isRTL ? "text-right" : "text-left"
      )}
      onClick={onClick}
    >
      <div className="service-icon inline-flex">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;
