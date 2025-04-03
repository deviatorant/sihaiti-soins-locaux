
import { useEffect, useRef } from "react";

// Composant placeholder pour la future intégration de carte
const LocationMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Ici nous simulerons une carte avec un conteneur stylisé
    // Dans une implémentation réelle, il faudrait intégrer Google Maps, Mapbox, etc.
    console.log("Map initialized");
  }, []);
  
  return (
    <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg relative overflow-hidden">
      <div ref={mapRef} className="w-full h-full">
        {/* Placeholder pour la carte */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 mx-auto mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <p>Carte de localisation</p>
            <p className="text-xs mt-2">Les professionnels de santé proches de vous apparaîtront ici</p>
          </div>
        </div>
        
        {/* Exemple d'épingles sur la carte */}
        <div className="absolute top-1/4 left-1/3">
          <div className="w-4 h-4 bg-medical-blue rounded-full animate-pulse-gentle"></div>
        </div>
        <div className="absolute top-1/2 left-2/3">
          <div className="w-4 h-4 bg-medical-red rounded-full animate-pulse-gentle"></div>
        </div>
        <div className="absolute top-3/4 left-1/4">
          <div className="w-4 h-4 bg-medical-green rounded-full animate-pulse-gentle"></div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
