'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Ticket, 
  CalendarDays, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  User, 
  Phone,
  Trash2,
  Plus
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import TokenTicket from '@/components/TokenTicket';

export default function MyAppointmentsPage() {
  const { 
    queueTokens, 
    appointments, 
    cancelAppointment, 
    cancelQueueToken, 
    openBookingModal 
  } = useHealthcare();

  const [activeTab, setActiveTab] = useState<'TOKENS' | 'APPOINTMENTS'>('TOKENS');
  const [selectedTokenForTicket, setSelectedTokenForTicket] = useState<any | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospital Discovery</span>
        </Link>

        <button
          onClick={() => openBookingModal({ mode: 'APPOINTMENT' })}
          className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Visit / Token</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Visits & Queue Passes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your scheduled doctor appointments, view live queue positions, and access QR check-in passes.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => {
            setActiveTab('TOKENS');
            setSelectedTokenForTicket(null);
          }}
          className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'TOKENS'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Active Digital Tokens ({queueTokens.filter(t => t.status !== 'Cancelled').length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('APPOINTMENTS');
            setSelectedTokenForTicket(null);
          }}
          className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'APPOINTMENTS'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Scheduled Visits ({appointments.filter(a => a.status !== 'CANCELLED').length})</span>
        </button>
      </div>

      {/* Content */}
      {selectedTokenForTicket ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTokenForTicket(null)}
            className="text-xs text-teal-600 font-bold hover:underline cursor-pointer"
          >
            ← Back to all tokens
          </button>
          <TokenTicket token={selectedTokenForTicket} onClose={() => setSelectedTokenForTicket(null)} />
        </div>
      ) : activeTab === 'TOKENS' ? (
        <div className="space-y-4">
          {queueTokens.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active walk-in tokens</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need urgent care or want to skip waiting lines? Generate a digital token now.
              </p>
              <button
                onClick={() => openBookingModal({ mode: 'TOKEN' })}
                className="mt-2 py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Generate Fast Token
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {queueTokens.map((token) => (
                <div
                  key={token.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xl text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                        {token.tokenNumber}
                      </span>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        token.status === 'Current' ? 'bg-amber-500 text-white animate-pulse' :
                        token.status === 'Waiting' ? 'bg-teal-100 text-teal-800' :
                        token.status === 'Visited' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {token.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">
                        {token.positionInQueue === 0 ? 'NOW CALLING' : `${token.positionInQueue} Ahead`}
                      </p>
                      <p className="text-[11px] text-teal-600 font-medium">~{token.estimatedWaitMin} min wait</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{token.facilityName}</h3>
                    <p className="text-xs text-teal-600 font-medium">{token.departmentName}</p>
                    {token.doctorName && (
                      <p className="text-xs text-slate-500 mt-0.5">Doctor: {token.doctorName}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">Patient: {token.patientName} • Issued {token.issueTime}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => setSelectedTokenForTicket(token)}
                      className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>View Live Boarding Pass</span>
                    </button>

                    {token.status === 'Waiting' && (
                      <button
                        onClick={() => cancelQueueToken(token.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Cancel Token
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* APPOINTMENTS TAB */
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No scheduled appointments</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Book a consultation with board-certified physicians and specialists today.
              </p>
              <button
                onClick={() => openBookingModal({ mode: 'APPOINTMENT' })}
                className="mt-2 py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Schedule Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {apt.appointmentNumber}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{apt.doctorName}</h3>
                    <p className="text-xs text-teal-600 font-medium">{apt.doctorSpecialty} • {apt.facilityName}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 text-slate-700">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.appointmentDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{apt.facilityAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">Patient: {apt.patientName}</span>
                    {apt.status === 'CONFIRMED' && (
                      <button
                        onClick={() => cancelAppointment(apt.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
