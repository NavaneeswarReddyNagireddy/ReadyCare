'use client';

import React from 'react';
import { AlertCircle, PhoneCall, Navigation, Ambulance, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';

export default function EmergencyBanner() {
  const { facilities, openFacilityDetails, openBookingModal } = useHealthcare();

  // Find nearest emergency hospital
  const nearestER = facilities.find(f => f.hasEmergencyER) || facilities[0];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white p-5 sm:p-7 shadow-xl shadow-red-500/15 border border-red-500/30">
      {/* Background graphic effect */}
      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <Ambulance className="w-64 h-64 text-white" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white border border-white/30">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              Emergency Quick-Access & Triage
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold text-rose-200">
              Live ER Dispatch Available
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Need Immediate Critical or Urgent Care?
          </h2>
          
          <p className="text-sm text-rose-100 leading-relaxed">
            Nearest 24/7 Level-1 Trauma ER is <strong className="text-white underline underline-offset-2">{nearestER.name}</strong> ({nearestER.distanceKm} km away • ~{nearestER.driveTimeMin} min drive). Current ER triage wait time is <strong>~{nearestER.currentAvgWaitMin} mins</strong>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <a
            href={`tel:${nearestER.emergencyPhone || '911'}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-red-700 font-bold text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>Call ER: (555) 911-0001</span>
          </a>

          <button
            onClick={() => openBookingModal({ facility: nearestER, mode: 'TOKEN' })}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-red-900/60 hover:bg-red-900/80 border border-white/30 text-white font-semibold text-sm px-4 py-3 rounded-xl backdrop-blur-xs transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4 text-yellow-300" />
            <span>Fast-Track ER Token</span>
          </button>

          <button
            onClick={() => openFacilityDetails(nearestER)}
            className="inline-flex items-center justify-center gap-1.5 text-xs text-rose-200 hover:text-white font-medium px-2 py-2 cursor-pointer transition-colors"
          >
            <span>ER Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
