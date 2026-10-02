'use client';

import React, { useState } from 'react';
import { 
  X, 
  Ticket, 
  CalendarDays, 
  Clock, 
  MapPin, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import TokenTicket from './TokenTicket';

export default function MyTokensDrawer() {
  const {
    isTokenDrawerOpen,
    closeTokenDrawer,
    queueTokens,
    appointments,
    cancelAppointment,
    cancelQueueToken,
    openBookingModal,
  } = useHealthcare();

  const [selectedTokenForPass, setSelectedTokenForPass] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'TOKENS' | 'APPOINTMENTS'>('TOKENS');

  if (!isTokenDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">My Healthcare Passes</h3>
              <p className="text-xs text-slate-500">Live tokens and booked doctor visits</p>
            </div>
          </div>

          <button
            onClick={closeTokenDrawer}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 shrink-0">
          <button
            onClick={() => {
              setActiveTab('TOKENS');
              setSelectedTokenForPass(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'TOKENS'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-500" />
            <span>Active Tokens ({queueTokens.filter(t => t.status !== 'CANCELLED').length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('APPOINTMENTS');
              setSelectedTokenForPass(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'APPOINTMENTS'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-teal-600" />
            <span>Appointments ({appointments.filter(a => a.status !== 'CANCELLED').length})</span>
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {selectedTokenForPass ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedTokenForPass(null)}
                className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                ← Back to all tokens
              </button>
              <TokenTicket token={selectedTokenForPass} onClose={() => setSelectedTokenForPass(null)} />
            </div>
          ) : activeTab === 'TOKENS' ? (
            <div className="space-y-3">
              {queueTokens.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No Active Queue Tokens</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Generate an instant walk-in token to skip the waiting room at any nearby clinic or hospital.
                  </p>
                  <button
                    onClick={() => {
                      closeTokenDrawer();
                      openBookingModal({ mode: 'TOKEN' });
                    }}
                    className="mt-2 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Generate Walk-in Token
                  </button>
                </div>
              ) : (
                queueTokens.map((token) => (
                  <div
                    key={token.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all bg-white space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-lg">
                          {token.tokenNumber}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          token.status === 'CALLED' ? 'bg-amber-500 text-white animate-pulse' :
                          token.status === 'WAITING' ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {token.status}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-800">
                          {token.positionInQueue === 0 ? 'NOW' : `${token.positionInQueue} Ahead`}
                        </span>
                        <p className="text-[10px] text-slate-400">~{token.estimatedWaitMin}m wait</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 text-sm">{token.facilityName}</p>
                      <p className="text-xs text-teal-600 font-medium">{token.departmentName}</p>
                      {token.doctorName && (
                        <p className="text-xs text-slate-500">Dr. {token.doctorName}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => setSelectedTokenForPass(token)}
                        className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View Boarding Pass</span>
                      </button>

                      {token.status === 'WAITING' && (
                        <button
                          onClick={() => cancelQueueToken(token.id)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* APPOINTMENTS TAB */
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No Scheduled Appointments</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Book an exact time slot with verified specialists and doctors in your area.
                  </p>
                  <button
                    onClick={() => {
                      closeTokenDrawer();
                      openBookingModal({ mode: 'APPOINTMENT' });
                    }}
                    className="mt-2 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Book Doctor Appointment
                  </button>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all bg-white space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {apt.appointmentNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 text-sm">{apt.doctorName}</p>
                      <p className="text-xs text-teal-600 font-medium">{apt.doctorSpecialty} • {apt.facilityName}</p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.appointmentDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{apt.facilityAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-500">Patient: {apt.patientName}</span>
                      {apt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">ReadyCare Access System</p>
          <button
            onClick={() => {
              closeTokenDrawer();
              openBookingModal({ mode: 'APPOINTMENT' });
            }}
            className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            + New Booking
          </button>
        </div>

      </div>

    </div>
  );
}
