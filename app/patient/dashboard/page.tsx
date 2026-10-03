'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Ticket, 
  CalendarDays, 
  Users, 
  Building2, 
  HeartPulse, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  ArrowRight, 
  Stethoscope, 
  QrCode,
  User,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  Filter,
  Navigation,
  Map as MapIcon,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';
import { HospitalProfile, Facility } from '@/types';
import { getRegisteredHospitalProfiles } from '@/app/actions/hospital';
import EmergencyBanner from '@/components/EmergencyBanner';

// Dynamically import Leaflet Map to avoid SSR window errors
const HospitalMap = dynamic(() => import('@/components/HospitalMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 sm:h-96 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center text-teal-600">
        <MapIcon className="w-5 h-5 animate-spin" />
      </div>
      <p className="text-xs font-bold text-slate-500">Loading interactive real-time map...</p>
    </div>
  ),
});

const SPECIALTY_OPTIONS = [
  'ALL',
  'General Hospital',
  '24/7 Emergency',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
];

// Helper to calculate distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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

export default function PatientDashboardPage() {
  const { 
    facilities, 
    queueTokens, 
    openBookingModal, 
    openTokenDrawer,
    hospitalQueues,
    openHospitalQueueModal
  } = useHealthcare();
  const { user } = useAuth();

  // Dynamic state for registered HospitalProfile records fetched from database
  const [hospitals, setHospitals] = useState<HospitalProfile[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');

  // Interactive Map & Geolocation State
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(true);

  // Request browser geolocation on mount
  const requestUserLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocatingUser(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setIsLocatingUser(false);
        },
        (err) => {
          console.warn('Geolocation permission not granted or timeout, setting default city coordinates:', err);
          setUserLocation([37.7749, -122.4194]);
          setIsLocatingUser(false);
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      setUserLocation([37.7749, -122.4194]);
    }
  };

  useEffect(() => {
    requestUserLocation();
  }, []);

  // Fetch live registered hospital records from DB / Server Action
  const loadHospitals = async () => {
    try {
      setIsLoadingHospitals(true);
      setFetchError('');
      
      // Try Next.js dynamic API endpoint first
      const res = await fetch('/api/hospitals', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setHospitals(json.data);
          setIsLoadingHospitals(false);
          return;
        }
      }

      // Direct Server Action fallback
      const directRecords = await getRegisteredHospitalProfiles();
      setHospitals(directRecords);
    } catch (err: any) {
      console.warn('Error fetching hospital profiles, falling back to server action:', err);
      try {
        const directRecords = await getRegisteredHospitalProfiles();
        setHospitals(directRecords);
      } catch (fallbackErr: any) {
        setFetchError('Unable to load live hospital records. Please retry.');
      }
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  // Active user token calculations
  const activeUserToken = queueTokens.find(t => t.status === 'Waiting' || t.status === 'Current') || null;
  const hospitalQueue = activeUserToken ? hospitalQueues[activeUserToken.facilityId] : null;
  
  let userWaitingAheadCount = activeUserToken?.positionInQueue || 0;
  if (activeUserToken && hospitalQueue && activeUserToken.status === 'Waiting') {
    const userIndex = hospitalQueue.tokensList.findIndex(t => t.tokenNumber === activeUserToken.tokenNumber);
    if (userIndex !== -1) {
      userWaitingAheadCount = hospitalQueue.tokensList
        .slice(0, userIndex)
        .filter(t => t.status === 'Waiting').length;
    }
  }

  // Filtered dynamically fetched hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hosp) => {
      // Search query filter (matches hospital name, location, owner, or specialty)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = hosp.hospitalName.toLowerCase().includes(q);
        const matchesLocation = hosp.location.toLowerCase().includes(q);
        const matchesOwner = hosp.ownerName.toLowerCase().includes(q);
        const matchesSpecialty = hosp.specialty.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesOwner && !matchesSpecialty) {
          return false;
        }
      }

      // Specialty filter
      if (selectedSpecialty !== 'ALL') {
        if (hosp.specialty.toLowerCase() !== selectedSpecialty.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [hospitals, searchQuery, selectedSpecialty]);

  // Convert HospitalProfile into Facility structure for modal actions
  const getFacilityFromHospital = (hosp: HospitalProfile): Facility => {
    const matched = facilities.find(f => f.name.toLowerCase() === hosp.hospitalName.toLowerCase());
    if (matched) return matched;

    return {
      id: hosp.id,
      name: hosp.hospitalName,
      slug: hosp.hospitalName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'HOSPITAL',
      description: `Accredited medical facility specializing in ${hosp.specialty}. Supervised by ${hosp.ownerName}.`,
      address: hosp.location,
      city: hosp.location.split(',')[0] || hosp.location,
      state: 'Metro',
      zipCode: '90001',
      phone: hosp.phoneNumber,
      emergencyPhone: hosp.phoneNumber,
      email: hosp.email,
      website: `https://${hosp.hospitalName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.readycare.org`,
      distanceKm: 3.2,
      driveTimeMin: 10,
      walkTimeMin: 25,
      isOpen24Hours: hosp.specialty === '24/7 Emergency',
      isOpenNow: true,
      hasEmergencyER: hosp.specialty === '24/7 Emergency',
      operatingHours: 'Mon-Sun: 24/7 Emergency & Walk-in Triage',
      rating: 4.8,
      reviewCount: 38,
      currentAvgWaitMin: 15,
      activeQueueCount: 4,
      imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
      departments: [
        {
          id: `dept-${hosp.id}`,
          name: hosp.specialty,
          code: 'SPEC',
          description: `Primary department for ${hosp.specialty}`,
          iconName: 'Activity',
          doctorCount: 4,
          currentWaitMin: 15
        }
      ],
      doctors: [],
      featuredSpecialties: [hosp.specialty, 'Emergency Triage', 'Outpatient Care'],
    };
  };

  // Map to List Selection connection: highlights and scrolls to card
  const handleSelectHospitalFromMap = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    const element = document.getElementById(`hospital-card-${hospitalId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getSpecialtyBadgeInfo = (specialty: string) => {
    switch (specialty) {
      case 'Cardiology':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          icon: HeartPulse,
        };
      case '24/7 Emergency':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
          dot: 'bg-amber-500 animate-pulse',
          icon: AlertCircle,
        };
      case 'Orthopedics':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: Activity,
        };
      case 'Pediatrics':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: Users,
        };
      default:
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          icon: Building2,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Patient Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-100 text-teal-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              Patient Portal
            </span>
            <span className="text-xs text-slate-400">Live Hospital Discovery & Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Welcome, {user?.fullName || 'Alex Henderson'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse registered hospitals in real-time, inspect specialties on the interactive map, and secure walk-in passes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openBookingModal({ mode: 'TOKEN' })}
            className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>Get Walk-in Token</span>
          </button>

          <button
            onClick={() => openBookingModal({ mode: 'APPOINTMENT' })}
            className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Book Doctor Visit</span>
          </button>
        </div>
      </div>

      {/* ACTIVE USER QUEUE SPOTLIGHT (Place in line only) */}
      <section>
        {activeUserToken ? (
          <div className={`rounded-3xl p-6 sm:p-7 text-white shadow-xl border relative overflow-hidden ${
            activeUserToken.status === 'Current'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 border-emerald-400/50 shadow-emerald-500/20 animate-pulse'
              : 'bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border-teal-500/30 shadow-teal-500/15'
          }`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-black uppercase px-2.5 py-0.5 rounded-full">
                    {activeUserToken.status === 'Current' ? '🔔 NOW CALLING YOU' : '● Live Queue Active'}
                  </span>
                  <span className="text-xs text-teal-200">
                    Token #{activeUserToken.tokenNumber}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-white">
                  {activeUserToken.status === 'Current' ? (
                    'It is YOUR Turn! Please enter the consultation room.'
                  ) : userWaitingAheadCount === 0 ? (
                    'You are next in line! Prepare to enter.'
                  ) : (
                    `There are ${userWaitingAheadCount} ${userWaitingAheadCount === 1 ? 'patient' : 'patients'} waiting before you`
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-slate-200">
                  Hospital: <strong>{activeUserToken.facilityName}</strong> • Department: <span className="text-teal-300 font-semibold">{activeUserToken.departmentName}</span>
                </p>

                <p className="text-xs text-slate-300">
                  Currently serving: <strong className="text-amber-300 font-mono">#{activeUserToken.currentlyServingNumber}</strong> • Est. wait: <strong className="text-teal-300">~{activeUserToken.estimatedWaitMin} mins</strong>
                </p>
              </div>

              {/* View Boarding Pass button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={openTokenDrawer}
                  className="py-3.5 px-6 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-teal-600" />
                  <span>View Live Boarding Pass</span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400">ReadyCare Instant Triage</span>
              <h3 className="text-lg sm:text-xl font-bold">You don't have an active queue token yet</h3>
              <p className="text-xs text-slate-400">Select any hospital on the map or list below to secure a walk-in pass or schedule an appointment.</p>
            </div>
            <button
              onClick={() => openBookingModal({ mode: 'TOKEN' })}
              className="py-2.5 px-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Get Instant Walk-in Token
            </button>
          </div>
        )}
      </section>

      {/* EMERGENCY TRIAGE BANNER */}
      <EmergencyBanner />

      {/* INTERACTIVE REAL-TIME MAP SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <MapIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Live Interactive Hospital Map
              </h2>
              <p className="text-xs text-slate-500">
                Click any hospital marker to view specialty details, live distance, and fast walk-in booking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMapVisible(!isMapVisible)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>{isMapVisible ? 'Hide Map' : 'Show Map'}</span>
            </button>
          </div>
        </div>

        {isMapVisible && (
          <HospitalMap
            hospitals={filteredHospitals}
            userLocation={userLocation}
            selectedHospitalId={selectedHospitalId}
            onSelectHospital={handleSelectHospitalFromMap}
            onOpenBookingModal={(hosp) => {
              const fac = getFacilityFromHospital(hosp);
              openBookingModal({ facility: fac, mode: 'TOKEN' });
            }}
            onRequestUserLocation={requestUserLocation}
            isLocatingUser={isLocatingUser}
          />
        )}
      </section>

      {/* DYNAMIC HOSPITAL DIRECTORY SECTION (Real-Time Database Query) */}
      <section className="space-y-6">
        
        {/* Section Header with live badge & refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Database Query
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {hospitals.length} Registered Facilities
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Hospital Directory & Walk-in Access
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Live directory of accredited hospitals fetched dynamically from the database.
            </p>
          </div>

          <button
            onClick={loadHospitals}
            disabled={isLoadingHospitals}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHospitals ? 'animate-spin text-teal-600' : 'text-slate-400'}`} />
            <span>{isLoadingHospitals ? 'Refreshing...' : 'Refresh Directory'}</span>
          </button>
        </div>

        {/* Search & Specialization Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital name, city, location, or administrator..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            {/* Specialization Select Dropdown */}
            <div className="w-full md:w-64">
              <div className="relative">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="ALL">All Specializations</option>
                  <option value="General Hospital">General Hospital</option>
                  <option value="24/7 Emergency">24/7 Emergency</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>
            </div>

          </div>

          {/* Quick Specialty Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Quick Filter:
            </span>
            {SPECIALTY_OPTIONS.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedSpecialty === spec
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {spec === 'ALL' ? 'Show All' : spec}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR STATE */}
        {fetchError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={loadHospitals}
              className="font-bold underline hover:text-rose-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoadingHospitals ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-100 rounded-md w-1/2" />
                <div className="h-16 bg-slate-50 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredHospitals.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No registered hospitals match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your search query or choosing "Show All" specializations.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('ALL');
              }}
              className="py-2 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* DYNAMIC HOSPITAL CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hosp) => {
              const badgeInfo = getSpecialtyBadgeInfo(hosp.specialty);
              const BadgeIcon = badgeInfo.icon;
              const facilityObj = getFacilityFromHospital(hosp);
              const isSelected = selectedHospitalId === hosp.id;

              // Compute distance from user if available
              const distKm = userLocation && hosp.latitude && hosp.longitude 
                ? calculateDistanceKm(userLocation[0], userLocation[1], hosp.latitude, hosp.longitude)
                : null;

              return (
                <div 
                  id={`hospital-card-${hosp.id}`}
                  key={hosp.id}
                  onClick={() => setSelectedHospitalId(hosp.id)}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer ${
                    isSelected 
                      ? 'border-teal-500 ring-2 ring-teal-400/50 shadow-xl bg-teal-50/20' 
                      : 'border-slate-200/90 hover:border-teal-300 shadow-xs hover:shadow-lg'
                  }`}
                >
                  
                  {/* Card Header */}
                  <div className="p-6 space-y-4">
                    
                    {/* Top Badges: Specialization & Live status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-bold ${badgeInfo.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${badgeInfo.dot}`} />
                        <BadgeIcon className="w-3.5 h-3.5" />
                        <span>{hosp.specialty}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {distKm !== null && (
                          <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-teal-600" />
                            {distKm} km
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Hospital Name */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 flex items-center justify-between">
                        <span>{hosp.hospitalName}</span>
                        {isSelected && (
                          <span className="text-[10px] font-black uppercase text-teal-600 bg-teal-100 px-2 py-0.5 rounded-md">
                            Selected
                          </span>
                        )}
                      </h3>
                      
                      {/* Location (City / Address) */}
                      <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5 mt-1.5">
                        <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{hosp.location}</span>
                      </p>
                    </div>

                    {/* Facility Details Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                      
                      {/* Administrator / Owner */}
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> Chief Admin:
                        </span>
                        <span className="font-bold text-slate-800">{hosp.ownerName}</span>
                      </div>

                      {/* Phone Contact */}
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> Contact:
                        </span>
                        <span className="font-semibold text-slate-700 font-mono text-[11px]">{hosp.phoneNumber}</span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> Official Email:
                        </span>
                        <span className="font-semibold text-teal-700 truncate max-w-[150px] text-[11px]">{hosp.email}</span>
                      </div>

                    </div>

                  </div>

                  {/* Card Action Buttons Footer */}
                  <div className="p-5 pt-0 mt-auto border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openHospitalQueueModal(facilityObj);
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Queue</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBookingModal({ facility: facilityObj, mode: 'TOKEN' });
                      }}
                      className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5 text-amber-300" />
                      <span>Walk-in Token</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
}
