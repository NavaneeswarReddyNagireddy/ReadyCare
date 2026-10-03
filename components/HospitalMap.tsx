'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HospitalProfile } from '@/types';
import { 
  MapPin, 
  Navigation, 
  HeartPulse, 
  AlertCircle, 
  Activity, 
  Users, 
  Building2, 
  Ticket, 
  Maximize2, 
  Compass,
  Phone,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface HospitalMapProps {
  hospitals: HospitalProfile[];
  userLocation: [number, number] | null;
  selectedHospitalId: string | null;
  onSelectHospital: (hospitalId: string) => void;
  onOpenBookingModal: (hospital: HospitalProfile) => void;
  onRequestUserLocation?: () => void;
  isLocatingUser?: boolean;
}

// Helper to calculate haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

const SPECIALTY_COLORS: Record<string, { bg: string; border: string; text: string; pinBg: string }> = {
  'Cardiology': { bg: '#ffe4e6', border: '#f43f5e', text: '#be123c', pinBg: '#e11d48' },
  '24/7 Emergency': { bg: '#fef3c7', border: '#f59e0b', text: '#b45309', pinBg: '#d97706' },
  'Orthopedics': { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8', pinBg: '#2563eb' },
  'Pediatrics': { bg: '#d1fae5', border: '#10b981', text: '#047857', pinBg: '#059669' },
  'General Hospital': { bg: '#ede9fe', border: '#8b5cf6', text: '#6d28d9', pinBg: '#7c3aed' },
};

export default function HospitalMap({
  hospitals,
  userLocation,
  selectedHospitalId,
  onSelectHospital,
  onOpenBookingModal,
  onRequestUserLocation,
  isLocatingUser = false,
}: HospitalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const userMarkerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [activePopupHospital, setActivePopupHospital] = useState<HospitalProfile | null>(null);

  // Default fallback center (Metro Health District)
  const defaultCenter: [number, number] = userLocation || [37.7749, -122.4194];

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isSubscribed = true;

    async function initMap() {
      const L = (await import('leaflet')).default;

      if (!isSubscribed || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      // Use free public OpenStreetMap tile server
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add custom positioned zoom controls
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      setIsMapReady(true);
    }

    initMap();

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || typeof window === 'undefined') return;

    async function renderUserMarker() {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }

      if (userLocation) {
        // Create custom pulsing user location icon
        const userIcon = L.divIcon({
          className: 'custom-user-location-marker',
          html: `
            <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
              <span style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background-color: rgba(13, 148, 136, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <div style="width: 16px; height: 16px; border-radius: 9999px; background-color: #0d9488; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);"></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(userLocation, { icon: userIcon, zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: system-ui, sans-serif; padding: 4px; text-align: center;">
              <strong style="color: #0f766e; font-size: 12px;">📍 Your Current Location</strong>
              <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Live Geolocation Active</p>
            </div>
          `);

        userMarkerRef.current = marker;
      }
    }

    renderUserMarker();
  }, [isMapReady, userLocation]);

  // Render & Update Hospital Markers
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || typeof window === 'undefined') return;

    async function renderHospitalMarkers() {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // Clear existing hospital markers
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};

      const bounds = L.latLngBounds([]);
      if (userLocation) {
        bounds.extend(userLocation);
      }

      hospitals.forEach((hosp) => {
        const lat = hosp.latitude || 37.7749;
        const lng = hosp.longitude || -122.4194;
        const isSelected = hosp.id === selectedHospitalId;
        const specStyle = SPECIALTY_COLORS[hosp.specialty] || SPECIALTY_COLORS['General Hospital'];

        // Compute distance from user if available
        const distKm = userLocation ? calculateDistanceKm(userLocation[0], userLocation[1], lat, lng) : null;

        // Custom Hospital Pin Icon
        const markerHtml = `
          <div style="
            position: relative;
            cursor: pointer;
            transition: transform 0.2s ease;
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          ">
            <div style="
              background: ${isSelected ? '#0f172a' : specStyle.pinBg};
              color: #ffffff;
              width: 36px;
              height: 36px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0, 0, 0, ${isSelected ? '0.4' : '0.25'});
              border: 2px solid #ffffff;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            ${isSelected ? '<div style="position: absolute; -bottom: 6px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; background: #0f172a; border-radius: 9999px;"></div>' : ''}
          </div>
        `;

        const customIcon = L.divIcon({
          className: `hospital-marker-${hosp.id}`,
          html: markerHtml,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -20],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        // Click Handler
        marker.on('click', () => {
          onSelectHospital(hosp.id);
          setActivePopupHospital(hosp);
        });

        // Popup Content
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 200px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: ${specStyle.bg}; color: ${specStyle.text}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${specStyle.border};">
                ${hosp.specialty}
              </span>
              ${distKm !== null ? `<span style="font-size: 11px; font-weight: bold; color: #0d9488;">📍 ${distKm} km away</span>` : ''}
            </div>
            <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">
              ${hosp.hospitalName}
            </h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0;">
              ${hosp.location}
            </p>
            <div style="display: flex; gap: 6px;">
              <button 
                id="popup-btn-select-${hosp.id}"
                style="flex: 1; padding: 6px 8px; background: #0f172a; color: #ffffff; border: none; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;"
              >
                Highlight in List
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`popup-btn-select-${hosp.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectHospital(hosp.id);
            };
          }
        });

        markersRef.current[hosp.id] = marker;
        bounds.extend([lat, lng]);
      });

      // Fit bounds if multiple hospitals
      if (hospitals.length > 0 && bounds.isValid() && !selectedHospitalId) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    renderHospitalMarkers();
  }, [isMapReady, hospitals, selectedHospitalId, userLocation]);

  // Pan to selected hospital when selectedHospitalId changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !selectedHospitalId) return;

    const targetHosp = hospitals.find((h) => h.id === selectedHospitalId);
    const marker = markersRef.current[selectedHospitalId];

    if (targetHosp && mapInstanceRef.current) {
      const lat = targetHosp.latitude || 37.7749;
      const lng = targetHosp.longitude || -122.4194;
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.2 });
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedHospitalId, isMapReady, hospitals]);

  // Center on user location
  const handleCenterUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userLocation, 14, { duration: 1 });
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
    } else if (onRequestUserLocation) {
      onRequestUserLocation();
    }
  };

  // Fit all markers
  const handleFitAll = async () => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;
    const L = (await import('leaflet')).default;
    const bounds = L.latLngBounds([]);

    if (userLocation) bounds.extend(userLocation);
    hospitals.forEach((h) => {
      if (h.latitude && h.longitude) {
        bounds.extend([h.latitude, h.longitude]);
      }
    });

    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-md">
      
      {/* Map Header Overlay Bar */}
      <div className="absolute top-3 left-3 z-1000 flex items-center gap-2 flex-wrap pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2 text-xs font-bold text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Live Medical Map</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">{hospitals.length} Facilities</span>
        </div>

        {userLocation && (
          <div className="bg-teal-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-teal-700/50 flex items-center gap-1.5 text-xs font-bold text-teal-100">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>GPS Location Centered</span>
          </div>
        )}
      </div>

      {/* Floating Action Controls */}
      <div className="absolute bottom-4 right-4 z-1000 flex flex-col gap-2 pointer-events-auto">
        
        {/* Geolocation Button */}
        <button
          onClick={handleCenterUser}
          disabled={isLocatingUser}
          title={userLocation ? 'Center on My Location' : 'Detect My Location'}
          className={`p-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-lg border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95 disabled:opacity-60 ${
            userLocation ? 'text-teal-700 ring-2 ring-teal-500/20' : ''
          }`}
        >
          <Navigation className={`w-4 h-4 ${isLocatingUser ? 'animate-spin text-teal-600' : 'text-teal-600'}`} />
          <span className="hidden sm:inline">
            {isLocatingUser ? 'Locating...' : userLocation ? 'My GPS Location' : 'Find My Location'}
          </span>
        </button>

        {/* Fit All Hospitals Button */}
        <button
          onClick={handleFitAll}
          title="Fit all hospitals on map"
          className="p-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-lg border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95"
        >
          <Maximize2 className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Fit All</span>
        </button>

      </div>

      {/* Map Container Element */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-80 sm:h-96 md:h-[420px] relative z-0"
      />

    </div>
  );
}
