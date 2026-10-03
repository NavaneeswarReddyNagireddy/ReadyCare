'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  AlertCircle
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';
import { SearchFilters, Facility } from '@/types';
import EmergencyBanner from '@/components/EmergencyBanner';
import SearchFilterBar from '@/components/SearchFilterBar';
import FacilityCard from '@/components/FacilityCard';

export default function PatientDashboardPage() {
  const { 
    facilities, 
    queueTokens, 
    activeToken, 
    openBookingModal, 
    openTokenDrawer,
    hospitalQueues
  } = useHealthcare();
  const { user } = useAuth();

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    specialty: '',
    facilityType: '',
    maxDistanceKm: 15,
    onlyOpenNow: false,
    onlyEmergencyER: false,
    sortBy: 'distance',
  });

  // Calculate user's active token position in its specific hospital
  const activeUserToken = queueTokens.find(t => t.status === 'Waiting' || t.status === 'Current') || null;
  const tokenFacility = activeUserToken ? facilities.find(f => f.id === activeUserToken.facilityId) : null;
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

  // Filter and sort facilities across multiple hospitals
  const filteredFacilities = useMemo(() => {
    return facilities
      .filter((facility) => {
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

        if (filters.specialty) {
          const hasSpec = facility.featuredSpecialties.some(s => s.toLowerCase() === filters.specialty.toLowerCase()) ||
            facility.departments.some(d => d.name.toLowerCase().includes(filters.specialty.toLowerCase())) ||
            facility.doctors.some(doc => doc.specialty.toLowerCase().includes(filters.specialty.toLowerCase()));
          if (!hasSpec) return false;
        }

        if (filters.facilityType && facility.type !== filters.facilityType) {
          return false;
        }

        if (facility.distanceKm > filters.maxDistanceKm) {
          return false;
        }

        if (filters.onlyOpenNow && !facility.isOpenNow) {
          return false;
        }

        if (filters.onlyEmergencyER && !facility.hasEmergencyER) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'distance') return a.distanceKm - b.distanceKm;
        if (filters.sortBy === 'wait_time') return a.currentAvgWaitMin - b.currentAvgWaitMin;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [facilities, filters]);

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
            <span className="text-xs text-slate-400">Multi-Hospital Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Welcome, {user?.fullName || 'Alex Henderson'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse nearby accredited medical centers, secure walk-in tickets, and monitor your live place in line.
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

      {/* ACTIVE USER QUEUE SPOTLIGHT (Strict Patient View: Place in line only) */}
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
              <p className="text-xs text-slate-400">Select any hospital below to secure a live walk-in pass or schedule an appointment.</p>
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

      {/* MULTI-HOSPITAL SEARCH & DISCOVERY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Nearby Hospitals & Medical Centers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Compare distance, live wait times, and book visits across {facilities.length} accredited facilities.
            </p>
          </div>
        </div>

        <SearchFilterBar
          filters={filters}
          onFilterChange={setFilters}
          resultCount={filteredFacilities.length}
        />
      </section>

      {/* HOSPITAL CARDS GRID */}
      <section>
        {filteredFacilities.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No matching facilities found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your distance radius or clearing your specialty filters.
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
              Reset Filters
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

    </div>
  );
}
