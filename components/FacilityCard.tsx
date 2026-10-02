'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Star, 
  ShieldAlert, 
  Car, 
  Footprints, 
  Phone, 
  CalendarDays, 
  Ticket, 
  ChevronRight, 
  Building2, 
  Activity,
  Users
} from 'lucide-react';
import { Facility } from '@/types';
import { useHealthcare } from '@/context/HealthcareContext';

interface FacilityCardProps {
  facility: Facility;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const { openFacilityDetails, openBookingModal, openHospitalQueueModal } = useHealthcare();

  const getFacilityTypeBadge = (type: string) => {
    switch (type) {
      case 'HOSPITAL':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-md">Hospital & Trauma</span>;
      case 'URGENT_CARE':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-md">Urgent Care</span>;
      case 'SPECIALTY_CENTER':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-2.5 py-0.5 rounded-md">Specialty Center</span>;
      case 'DIAGNOSTIC_CENTER':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-md">Diagnostics & Lab</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-2.5 py-0.5 rounded-md">Clinic</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-teal-200 transition-all duration-200 overflow-hidden flex flex-col group">
      
      {/* Top Banner / Image Header */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={facility.imageUrl}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {getFacilityTypeBadge(facility.type)}
            {facility.hasEmergencyER && (
              <span className="bg-red-600/90 backdrop-blur-xs text-white text-xs font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5" /> 24/7 ER
              </span>
            )}
          </div>

          {/* Open / Closed status */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20">
            <span className={`w-2 h-2 rounded-full ${facility.isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span>{facility.isOpenNow ? 'Open Now' : 'Closed'}</span>
          </div>
        </div>

        {/* Bottom overlay: Distance & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>{facility.distanceKm} km away</span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-200">
              <Car className="w-3 h-3 text-slate-300" /> {facility.driveTimeMin}m
            </span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-md text-white px-2 py-1 rounded-lg font-bold text-xs shadow-sm">
            <Star className="w-3.5 h-3.5 fill-white text-white" />
            <span>{facility.rating.toFixed(1)}</span>
            <span className="text-[10px] font-normal text-amber-100">({facility.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Title & Address */}
          <h3 
            onClick={() => openFacilityDetails(facility)}
            className="text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors cursor-pointer line-clamp-1"
          >
            {facility.name}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{facility.address}</span>
          </p>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {facility.description}
          </p>
        </div>

        {/* Live Metrics: Wait Time & Available Doctors */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Est. Wait Time</p>
              <p className="font-bold text-slate-800">~{facility.currentAvgWaitMin} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Available Doctors</p>
              <p className="font-bold text-slate-800">{facility.doctors.length} On Duty</p>
            </div>
          </div>
        </div>

        {/* Featured Specialties Chips */}
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {facility.featuredSpecialties.slice(0, 3).map((spec, i) => (
              <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                {spec}
              </span>
            ))}
            {facility.featuredSpecialties.length > 3 && (
              <span className="text-[11px] text-slate-400 font-medium">
                +{facility.featuredSpecialties.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
          
          <button
            onClick={() => openHospitalQueueModal(facility)}
            className="w-full sm:flex-1 py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Queue</span>
          </button>

          <button
            onClick={() => openBookingModal({ facility, mode: 'TOKEN' })}
            className="w-full sm:flex-1 py-2 px-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Fast Token</span>
          </button>

          <button
            onClick={() => openFacilityDetails(facility)}
            className="w-full sm:flex-1 py-2 px-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Book / Details</span>
          </button>

        </div>

      </div>

    </div>
  );
}
