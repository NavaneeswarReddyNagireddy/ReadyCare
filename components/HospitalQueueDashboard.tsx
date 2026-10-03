'use client';

import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Ticket, 
  Sparkles, 
  Building2, 
  MapPin, 
  ShieldAlert, 
  AlertCircle,
  Stethoscope,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Facility } from '@/types';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';

interface HospitalQueueDashboardProps {
  facility: Facility | null;
  onClose: () => void;
}

export default function HospitalQueueDashboard({ facility, onClose }: HospitalQueueDashboardProps) {
  const { 
    hospitalQueues, 
    advanceHospitalQueue, 
    queueTokens, 
    openBookingModal, 
    openTokenDrawer 
  } = useHealthcare();
  const { user } = useAuth();

  if (!facility) return null;

  const queueState = hospitalQueues[facility.id] || hospitalQueues['fac-1'];
  
  // Find if current active user has a token in this facility
  const userTokenInFacility = queueTokens.find(
    t => t.facilityId === facility.id && (t.status === 'Waiting' || t.status === 'Current' || t.status === 'Visited')
  );

  // Position calculation: count how many 'Waiting' tokens are ahead of user's token
  let userWaitingAheadCount = 0;
  if (userTokenInFacility && userTokenInFacility.status === 'Waiting') {
    const userIndexInQueue = queueState.tokensList.findIndex(t => t.tokenNumber === userTokenInFacility.tokenNumber);
    if (userIndexInQueue !== -1) {
      userWaitingAheadCount = queueState.tokensList
        .slice(0, userIndexInQueue)
        .filter(t => t.status === 'Waiting').length;
    } else {
      userWaitingAheadCount = userTokenInFacility.positionInQueue;
    }
  }

  const handleNextPatientClick = () => {
    advanceHospitalQueue(facility.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Hero Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-teal-500/20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-md">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-teal-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  Live Queue Dispatch
                </span>
                <span className="text-xs text-teal-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {facility.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>{facility.address} • {facility.distanceKm} km away</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Queue Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          
          {/* USER SPECIFIC QUEUE STATUS BANNER (Dynamic active user position) */}
          <div className="rounded-2xl p-4 sm:p-5 border shadow-sm transition-all bg-white">
            {userTokenInFacility ? (
              userTokenInFacility.status === 'Current' ? (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-pulse">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                      🔔 Action Required
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">
                      It is YOUR Turn! (Token #{userTokenInFacility.tokenNumber})
                    </h3>
                    <p className="text-xs text-emerald-100">
                      Please proceed immediately to <strong>{queueState.currentlyServing.roomNumber}</strong> for your consultation with {queueState.currentlyServing.doctorName}.
                    </p>
                  </div>

                  <button
                    onClick={openTokenDrawer}
                    className="py-2.5 px-5 bg-white text-slate-950 hover:bg-emerald-50 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    View QR Pass
                  </button>
                </div>
              ) : userTokenInFacility.status === 'Waiting' ? (
                <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs font-bold text-teal-300">YOUR QUEUE POSITION:</span>
                      <span className="font-mono font-black text-sm bg-teal-600 px-2 py-0.5 rounded-md text-white">
                        {userTokenInFacility.tokenNumber}
                      </span>
                    </div>
                    
                    {/* Exact User Prompt Requirement */}
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {userWaitingAheadCount === 0 ? (
                        'You are next in line! Prepare to enter.'
                      ) : (
                        `There are ${userWaitingAheadCount} ${userWaitingAheadCount === 1 ? 'patient' : 'patients'} waiting before you`
                      )}
                    </h3>

                    <p className="text-xs text-slate-300">
                      Currently serving: <strong className="text-amber-300 font-mono">#{queueState.currentlyServing.tokenNumber}</strong> • Est. wait time: <strong className="text-teal-300">~{userWaitingAheadCount * 4 || 3} mins</strong>
                    </p>
                  </div>

                  <button
                    onClick={openTokenDrawer}
                    className="py-2.5 px-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    Track My Live Ticket
                  </button>
                </div>
              ) : (
                <div className="bg-slate-100 text-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">Your Appointment (Token #{userTokenInFacility.tokenNumber}) is Visited</p>
                      <p className="text-[11px] text-slate-500">Thank you for visiting {facility.name}.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openBookingModal({ facility, mode: 'TOKEN' })}
                    className="text-xs font-bold text-teal-600 hover:underline cursor-pointer"
                  >
                    Get New Token
                  </button>
                </div>
              )
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">You do not currently have a token at this hospital</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Generate a digital walk-in pass to reserve your spot in this live line.</p>
                </div>
                <button
                  onClick={() => openBookingModal({ facility, mode: 'TOKEN' })}
                  className="py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Get Instant Token</span>
                </button>
              </div>
            )}
          </div>

          {/* METRIC CARDS: If PATIENT, show Estimated Average Wait instead of Next Patient button */}
          <div className={`grid grid-cols-1 ${user?.role === 'HOSPITAL_ADMIN' ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-4`}>
            
            {/* Total Waiting Patients */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Waiting</span>
                <Users className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900">
                {queueState.totalWaiting} <span className="text-xs font-semibold text-slate-400">Patients</span>
              </p>
              <p className="text-[11px] text-slate-500">In queue for {queueState.departmentName}</p>
            </div>

            {/* Currently Serving Token */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Currently Calling</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-3xl sm:text-4xl font-black font-mono text-teal-700">
                {queueState.currentlyServing.tokenNumber}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {queueState.currentlyServing.patientName} • {queueState.currentlyServing.roomNumber}
              </p>
            </div>

            {/* If HOSPITAL_ADMIN: Show Next Patient simulation control */}
            {user?.role === 'HOSPITAL_ADMIN' ? (
              <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-teal-300 tracking-wider">Hospital Admin Control</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-200 mt-1">Advance Queue</h4>
                </div>

                <button
                  type="button"
                  onClick={handleNextPatientClick}
                  className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Next Patient ➔</span>
                </button>
              </div>
            ) : (
              /* For PATIENT: Next Patient button is COMPLETELY HIDDEN. Show queue turnaround time */
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 text-slate-800 rounded-2xl p-5 border border-teal-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">Avg. Consultation</span>
                  <Clock className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-3xl sm:text-4xl font-black text-slate-900">
                  ~12 <span className="text-xs font-semibold text-slate-500">Mins / Patient</span>
                </p>
                <p className="text-[11px] text-teal-700">Estimated turnaround on schedule</p>
              </div>
            )}

          </div>

          {/* QUEUE LIFECYCLE TABLE / VISUALIZER */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  Live Patient Queue Matrix ({queueState.departmentName})
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">Auto-updating live</span>
            </div>

            <div className="divide-y divide-slate-100">
              {queueState.tokensList.map((tokenItem) => {
                const isUserToken = userTokenInFacility?.tokenNumber === tokenItem.tokenNumber;

                return (
                  <div 
                    key={tokenItem.id} 
                    className={`p-3.5 sm:p-4 flex items-center justify-between transition-colors ${
                      tokenItem.status === 'Current' 
                        ? 'bg-emerald-50/70 border-l-4 border-l-emerald-500' 
                        : isUserToken 
                        ? 'bg-teal-50/60 border-l-4 border-l-teal-500' 
                        : tokenItem.status === 'Visited'
                        ? 'opacity-60 bg-slate-50/40'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Left: Token Number & Patient Info */}
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                        tokenItem.status === 'Current' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : tokenItem.status === 'Visited'
                          ? 'bg-slate-200 text-slate-600 line-through'
                          : 'bg-slate-100 text-slate-900'
                      }`}>
                        {tokenItem.tokenNumber}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs sm:text-sm text-slate-900">
                            {tokenItem.patientName}
                          </p>
                          {isUserToken && (
                            <span className="bg-teal-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-sm uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Issued: {tokenItem.issueTime} • Priority: {tokenItem.priority.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    {/* Right: Status Badge & Position */}
                    <div className="text-right flex items-center gap-3">
                      {tokenItem.status === 'Current' ? (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          IN CONSULTATION
                        </span>
                      ) : tokenItem.status === 'Visited' ? (
                        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                          Visited
                        </span>
                      ) : (
                        <div>
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            Waiting #{tokenItem.position}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500">
            Click <strong>'Next Patient'</strong> to advance consultations in real time.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            
            <button
              onClick={() => {
                onClose();
                openBookingModal({ facility, mode: 'TOKEN' });
              }}
              className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              + Get Another Token
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
