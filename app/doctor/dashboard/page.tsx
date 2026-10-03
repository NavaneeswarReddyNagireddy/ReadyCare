'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  Building2, 
  Users, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  Play, 
  Video, 
  FileText, 
  Activity, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';

export default function DoctorDashboardPage() {
  const { 
    facilities, 
    hospitalQueues, 
    advanceHospitalQueue, 
    appointments 
  } = useHealthcare();
  const { user } = useAuth();

  const doctorProfile = user?.doctorProfile;
  const hospitalName = doctorProfile?.workingHospitalName || user?.hospitalName || 'MetroHealth Grand Medical Center';
  const doctorSpecialty = doctorProfile?.specialization || 'Interventional Cardiologist';
  const doctorName = doctorProfile?.doctorName || user?.fullName || 'Dr. Sarah Jenkins';

  const currentHospitalId = user?.hospitalId || 'fac-1';
  const queueState = hospitalQueues[currentHospitalId] || hospitalQueues['fac-1'];

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'APPOINTMENTS'>('QUEUE');

  const handleNextPatient = () => {
    advanceHospitalQueue(currentHospitalId);
  };

  const waitingTokens = (queueState?.tokensList || []).filter(t => t.status === 'Waiting');
  const currentToken = (queueState?.tokensList || []).find(t => t.status === 'Current');
  const completedTokens = (queueState?.tokensList || []).filter(t => t.status === 'Visited');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 shrink-0">
              <Stethoscope className="w-8 h-8 text-slate-950" />
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Clinician Portal • Verified Doctor
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2 py-0.5 rounded-md">
                  ● On Duty & Available
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {doctorName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-0.5">
                <span className="font-semibold text-teal-300">{doctorSpecialty}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {hospitalName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {doctorProfile?.email || user?.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNextPatient}
              className="py-3 px-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Call Next Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Currently in Room */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In-Room Patient</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {currentToken ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-teal-700">
                  {currentToken.tokenNumber}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                  Active Consultation
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{currentToken.patientName}</p>
              <p className="text-xs text-slate-500">Priority: <strong className="text-slate-800">{currentToken.priority}</strong></p>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-sm font-bold text-slate-400">Consultation Room Free</p>
              <p className="text-xs text-slate-500 mt-1">Ready to call the next waiting patient.</p>
            </div>
          )}

          <button
            onClick={handleNextPatient}
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {currentToken ? 'Complete & Call Next' : 'Call Waiting Patient'}
          </button>
        </div>

        {/* Metric 2: Waiting Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waiting in Line</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900">
              {waitingTokens.length} <span className="text-sm font-semibold text-slate-400">patients</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Estimated consultation time: <strong>~{waitingTokens.length * 15} mins</strong>
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <span>Completed Today: <strong className="text-slate-800">{completedTokens.length}</strong></span>
            <span className="text-teal-600 font-bold">On Schedule</span>
          </div>
        </div>

        {/* Metric 3: Scheduled Visits */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Bookings</span>
            <CalendarDays className="w-5 h-5 text-teal-600" />
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900">
              {appointments.length} <span className="text-sm font-semibold text-slate-400">confirmed</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Specialist Dept: <strong className="text-teal-700">{doctorSpecialty}</strong>
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <span>Telehealth: <strong className="text-slate-800">2 Video Slots</strong></span>
            <span className="text-purple-600 font-bold">HD Video Room</span>
          </div>
        </div>

      </div>

      {/* Main Tabs: Live Queue vs Confirmed Appointments */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-5 sm:p-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('QUEUE')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'QUEUE'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Live Clinical Queue ({waitingTokens.length + (currentToken ? 1 : 0)})
            </button>
            <button
              onClick={() => setActiveTab('APPOINTMENTS')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'APPOINTMENTS'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Scheduled Appointments ({appointments.length})
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Hospital: {hospitalName}
          </span>
        </div>

        {/* Content */}
        {activeTab === 'QUEUE' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Triage Priority</th>
                  <th className="py-3 px-4">Check-in Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(queueState?.tokensList || []).map((token) => (
                  <tr key={token.id} className={token.status === 'Current' ? 'bg-emerald-50/70 font-semibold' : ''}>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{token.tokenNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{token.patientName}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                        {token.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{token.issueTime}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        token.status === 'Current'
                          ? 'bg-emerald-600 text-white'
                          : token.status === 'Visited'
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {token.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {token.status === 'Waiting' && (
                        <button
                          onClick={handleNextPatient}
                          className="py-1 px-3 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Admit Patient
                        </button>
                      )}
                      {token.status === 'Current' && (
                        <button
                          onClick={handleNextPatient}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Finish Visit
                        </button>
                      )}
                      {token.status === 'Visited' && (
                        <span className="text-slate-400 text-xs">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{apt.patientName}</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md">
                      {apt.timeSlot}
                    </span>
                  </div>
                  <p className="text-slate-500">Reason: {apt.reasonForVisit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold text-xs">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
