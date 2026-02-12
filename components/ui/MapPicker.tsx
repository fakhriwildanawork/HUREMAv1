
import React, { useEffect, useRef } from 'react';

interface MapPickerProps {
  lat: number;
  lng: number;
  radius: number;
  onPositionChange: (lat: number, lng: number) => void;
  className?: string;
}

const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, radius, onPositionChange, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const marker = useRef<any>(null);
  const circle = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Initialize map
    const L = (window as any).L;
    if (!L) return;

    leafletMap.current = L.map(mapRef.current).setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap.current);

    marker.current = L.marker([lat, lng], { draggable: true }).addTo(leafletMap.current);
    circle.current = L.circle([lat, lng], {
      color: '#005E4E',
      fillColor: '#00E8C1',
      fillOpacity: 0.2,
      radius: radius
    }).addTo(leafletMap.current);

    marker.current.on('dragend', (e: any) => {
      const pos = e.target.getLatLng();
      onPositionChange(pos.lat, pos.lng);
    });

    leafletMap.current.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      marker.current.setLatLng([lat, lng]);
      circle.current.setLatLng([lat, lng]);
      onPositionChange(lat, lng);
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (leafletMap.current && marker.current && circle.current) {
      marker.current.setLatLng([lat, lng]);
      circle.current.setLatLng([lat, lng]);
      circle.current.setRadius(radius);
      leafletMap.current.panTo([lat, lng]);
    }
  }, [lat, lng, radius]);

  return <div ref={mapRef} className={`w-full h-full rounded-2xl overflow-hidden z-0 border border-slate-200 ${className}`} />;
};

export default MapPicker;