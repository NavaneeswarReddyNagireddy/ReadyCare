'use client';

import React, { useState, useMemo } from 'react';
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
  Zap,
  Star
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { SearchFilters, Facility } from '@/types';
import EmergencyBanner from '@/components/EmergencyBanner';
import SearchFilterBar from '@/components/SearchFilterBar';
import FacilityCard from '@/components/FacilityCard';

export default function HomePage() {
  const { facilities, openBookingModal } = useHealthcare();

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    specialty: '',
    facilityType: '',
    maxDistanceKm: 15,
    onlyOpenNow: false,
    onlyEmergencyER: false,
    sortBy: 'distance',
  });

  // Filter and sort facilities
  const filteredFacilities = useMemo(() => {
    return facilities
      .filter((facility) => {
        // Query filter
        if (filters.query.trim()) {
          const q = filters.query.toLowerCase();
          const matchName = facility.name.toLowerCase().includes(q);
          const matchCity = facility.city.toLowerCase().includes(q) || facility.address.toLowerCase().includes(q);
          const matchDept = facility.departments.some(d => d.name.toLowerCase().includes(q));
          const matchDoc = facility.doctors.some(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
          const matchSpec = facility.featuredSpecialties.some(s => s.toLowerCase().includes(q));
          if (!matchName && !matchCity && !matchDept && !matchDoc && !matchSpec) {
            return false;
          }
        }

        // Specialty filter
        if (filters.specialty) {
          const hasSpec = facility.featuredSpecialties.some(s => s.toLowerCase() === filters.specialty.toLowerCase()) ||
            facility.departments.some(d => d.name.toLowerCase().includes(filters.specialty.toLowerCase())) ||
            facility.doctors.some(doc => doc.specialty.toLowerCase().includes(filters.specialty.toLowerCase()) || doc.departmentName.toLowerCase().includes(filters.specialty.toLowerCase()));
          if (!hasSpec) return false;
        }

        // Facility Type filter
        if (filters.facilityType && facility.type !== filters.facilityType) {
          return false;
        }

        // Distance filter
        if (facility.distanceKm > filters.maxDistanceKm) {
          return false;
        }

        // Open Now filter
        if (filters.onlyOpenNow && !facility.isOpenNow) {
          return false;
        }

        // Emergency ER filter
        if (filters.onlyEmergencyER && !facility.hasEmergencyER) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'distance') {
          return a.distanceKm - b.distanceKm;
        } else if (filters.sortBy === 'wait_time') {
          return a.currentAvgWaitMin - b.currentAvgWaitMin;
        } else if (filters.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [facilities, filters]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white pt-12 sm:pt-16 pb-16 sm:pb-20">
        
        {/* Subtle background graphics */}
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Pill */}
          <div className="flex items-center justify-center sm:justify-start">
            <span className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Smart Hospital Access & Queue Dispatch Engine</span>
            </span>
          </div>

          {/* Heading & Subtitle */}
          <div className="max-w-3xl space-y-4 text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Instant Healthcare Access. <br />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Zero Waiting Rooms.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-normal">
              Find nearby accredited hospitals, urgent care centers, and verified specialists with live distance metrics and real-time wait tracking. Reserve confirmed appointments or secure your fast-track digital walk-in queue token instantly.
            </p>
          </div>

          {/* Hero Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <button
              onClick={() => openBookingModal({ mode: 'APPOINTMENT' })}
              className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl flex items-center gap-2 shadow-xl shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CalendarDays className="w-5 h-5 text-slate-950" />
              <span>Book Doctor Appointment</span>
            </button>

            <button
              onClick={() => openBookingModal({ mode: 'TOKEN' })}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base rounded-2xl flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer"
            >
              <Activity className="w-5 h-5 text-amber-400" />
              <span>Get Digital Walk-in Token</span>
            </button>
          </div>

          {/* Real-time stats ticker strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">Average Wait</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">~12 Mins</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Across local clinics</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">Nearby Facilities</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{facilities.length} Active</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Hospitals & Labs</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">ER Response</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">24/7 Live</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Level-1 Trauma Centers</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">Verified Doctors</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">28+ On Duty</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Board-certified specialists</p>
            </div>

          </div>

        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* EMERGENCY QUICK ACCESS BANNER */}
        <EmergencyBanner />

        {/* SEARCH & DISCOVERY CONTROLS */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Nearby Healthcare Facilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time distance, operating status, wait times, and direct booking
              </p>
            </div>
          </div>

          <SearchFilterBar
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredFacilities.length}
          />
        </section>

        {/* FACILITY CARDS GRID */}
        <section>
          {filteredFacilities.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No matching healthcare facilities found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your distance radius, removing filters, or searching with another keyword.
                </p>
              </div>
              <button
                onClick={() => setFilters({
                  query: '',
                  specialty: '',
                  facilityType: '',
                  maxDistanceKm: 15,
                  onlyOpenNow: false,
                  onlyEmergencyER: false,
                  sortBy: 'distance',
                })}
                className="py-2 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          )}
        </section>

        {/* HOW READYCARE WORKS SECTION */}
        <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 rounded-3xl border border-teal-200/70 p-6 sm:p-10 space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Simple 3-Step Process</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How ReadyCare Access Works</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Transforming how patients discover, navigate, and receive timely medical attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-black flex items-center justify-center text-base">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Discover Local Care</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter nearby hospitals, clinics, and diagnostic labs by real distance, current wait times, and emergency ER capabilities.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-black flex items-center justify-center text-base">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">Reserve Slot or Walk-in Token</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose between booking a scheduled specialist consultation or pulling a live walk-in queue token for urgent care.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-black flex items-center justify-center text-base">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">Arrive Just in Time</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track your live queue position and estimated arrival countdown on your phone. Scan your digital QR pass at the clinic door.
              </p>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}
