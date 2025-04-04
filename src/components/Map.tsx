
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  title?: string;
  description?: string;
}

const Map: React.FC<MapProps> = ({ 
  latitude, 
  longitude, 
  zoom = 15,
  title = '',
  description = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // We're using OpenStreetMap with Leaflet as it doesn't require API keys
    // This is a fallback to the more advanced Mapbox implementation that would be used in production
    
    const initMap = async () => {
      try {
        // Create a link element for the Leaflet CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(linkElement);
        
        // Wait for the CSS to load
        await new Promise(resolve => {
          linkElement.onload = resolve;
        });
        
        // Load Leaflet
        const L = await import('leaflet');
        
        // Create map
        const map = L.map(mapRef.current).setView([latitude, longitude], zoom);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add marker
        L.marker([latitude, longitude]).addTo(map)
          .bindPopup(title || 'Location')
          .openPopup();
        
        setIsLoading(false);
        console.log('Map initialized');
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to load map. Please try again later.');
        setIsLoading(false);
      }
    };
    
    initMap();
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [latitude, longitude, zoom, title]);

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-[300px] bg-gray-100"
          data-testid="map-container"
        ></div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 animate-spin text-medical-blue" />
              <p className="mt-2 text-sm text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
            <div className="text-center p-4">
              <p className="text-red-500">{error}</p>
              <p className="text-sm text-gray-600 mt-1">{t('common.tryAgainLater')}</p>
            </div>
          </div>
        )}
        
        {description && (
          <div className="p-4">
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Map;
