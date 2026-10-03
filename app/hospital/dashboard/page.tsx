'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Activity, 
  Users, 
  Play, 
  Clock, 
  CheckCircle2, 
  Ticket, 
  Building2, 
  Sparkles, 
  Search, 
  AlertCircle,
  Stethoscope,
  Phone,
  User,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  HeartPulse,
  Plus
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';

export default function HospitalDashboardPage() {
  const { 
    facilities, 
    hospitalQueues, 
    advanceHospitalQueue, 
    openBookingModal 
  } = useHealthcare();
  const { user, setHospitalTenant } = useAuth();

  // Strict Hospital Tenant Data Isolation: Bound to the user's hospitalId
  const currentHospitalId = user?.hospitalId || 'fac-1';
  const hospitalFacility = facilities.find(f => f.id === currentHospitalId) || facilities[0];
  const queueState = hospitalQueues[currentHospitalId] || hospitalQueues['fac-1'];

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Waiting' | 'Current' | 'Visited'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleNextPatient = () => {
    advanceHospitalQueue(currentHospitalId);
  };

  const filteredTokens = (queueState?.tokensList || []).filter((token) => {
    if (filterStatus !== 'ALL' && token.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        token.tokenNumber.toLowerCase().includes(q) ||
        token.patientName.toLowerCase().includes(q) ||
        token.priority.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const waitingCount = (queueState?.tokensList || []).filter(t => t.status === 'Waiting').length;
  const visitedCount = (queueState?.tokensList || []).filter(t => t.status === 'Visited').length;
  const currentToken = (queueState?.tokensList || []).find(t => t.status === 'Current');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Top Header & Hospital Tenant Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-900 text-purple-200 border border-purple-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              Hospital Staff Portal • Dedicated Tenant
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Staff: <strong>{user?.fullName || 'Hospital Admin'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {hospitalFacility?.name || user?.hospitalName || 'MetroHealth Grand Medical Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{hospitalFacility?.address}, {hospitalFacility?.city} • {hospitalFacility?.type}</span>
          </p>
        </div>

        {/* Desk Actions & Walk-in Pass Issuance */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openBookingModal({ facility: hospitalFacility, mode: 'TOKEN' })}
            className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Desk Token</span>
          </button>
        </div>
      </div>

      {/* Hospital Switcher (For Demo/Evaluation of Tenant Isolation) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Multi-Tenant Data Isolation Active</p>
            <p className="text-slate-500 text-[11px]">
              This dashboard only reads and manages the queue and appointments for <strong className="text-teal-700">{hospitalFacility?.name}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500">Switch Facility:</span>
          <select
            value={currentHospitalId}
            onChange={(e) => {
              const fac = facilities.find(f => f.id === e.target.value);
              if (fac) {
                setHospitalTenant(fac.id, fac.name);
              }
            }}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            {facilities.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.name} ({fac.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* THREE COMMAND METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Currently Calling / Active Consultation Room */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Consultation Room</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-teal-700">
                {queueState?.currentlyServing?.tokenNumber || 'None'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-md">
                ROOM ACTIVE
              </span>
            </div>

            <div className="mt-3 space-y-1 text-xs">
              <p className="font-bold text-slate-900 text-sm">{queueState?.currentlyServing?.patientName || 'No patient currently inside'}</p>
              <p className="text-slate-500">{queueState?.currentlyServing?.roomNumber || 'Room 101'} • {queueState?.currentlyServing?.doctorName || 'Assigned Specialist'}</p>
              <p className="text-[11px] text-teal-700 font-medium">Called at: {queueState?.currentlyServing?.calledTime || 'Just now'}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Department: <strong className="text-slate-700">{queueState?.departmentName || 'General Medicine'}</strong>
          </div>
        </div>

        {/* Card 2: Total Waiting Patients Count */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patients in Waiting Line</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>

          <div>
            <p className="text-4xl sm:text-5xl font-black text-slate-900">
              {waitingCount} <span className="text-base font-semibold text-slate-400">waiting</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Estimated wait throughput: <strong>~{waitingCount * (hospitalFacility?.currentAvgWaitMin || 10)} mins</strong>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Completed Today: <strong className="text-slate-800">{visitedCount}</strong></span>
            <span className="text-emerald-600 font-bold">● High Throughput</span>
          </div>
        </div>

        {/* Card 3: PROMINENT 'NEXT PATIENT' PROGRESSION BUTTON */}
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-teal-500/30 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-teal-300 tracking-wider">Queue Progression</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">
              Next Patient Action
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Completes current visit (marks as <strong className="text-emerald-400">Visited</strong>) and pulls the next waiting ticket to <strong className="text-teal-300">Current</strong> with immediate turn notification.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextPatient}
            className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Next Patient ➔</span>
          </button>
        </div>

      </div>

      {/* QUEUE MANAGEMENT TABLE FOR THIS HOSPITAL */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-5 sm:p-6">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-slate-100">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <h3 className="font-extrabold text-slate-900 text-base">Hospital Live Queue Table</h3>
            <span className="text-xs bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full font-black">
              {filteredTokens.length} Tokens
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search token # or patient..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {(['ALL', 'Waiting', 'Current', 'Visited'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Priority Level</th>
                <th className="py-3 px-4">Issue Time</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No tickets found matching this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token) => (
                  <tr 
                    key={token.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      token.status === 'Current' 
                        ? 'bg-emerald-50/60 font-semibold' 
                        : token.status === 'Visited'
                        ? 'opacity-60 bg-slate-50/30'
                        : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-black px-2 py-0.5 rounded-md text-xs ${
                        token.status === 'Current' 
                          ? 'bg-emerald-600 text-white' 
                          : token.status === 'Visited'
                          ? 'bg-slate-200 text-slate-600 line-through'
                          : 'bg-slate-100 text-slate-900'
                      }`}>
                        {token.tokenNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {token.patientName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        token.priority === 'EMERGENCY_TRIAGE'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : token.priority === 'SENIOR_CITIZEN'
                          ? 'bg-amber-100 text-amber-800'
                          : token.priority === 'PEDIATRIC'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {token.priority.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {token.issueTime}
                    </td>

                    <td className="py-3.5 px-4 font-bold">
                      {token.status === 'Current' ? (
                        <span className="text-emerald-600 font-extrabold">In Consultation</span>
                      ) : token.status === 'Visited' ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                          #{token.position} in line
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        token.status === 'Current'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                          : token.status === 'Visited'
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {token.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {token.status === 'Waiting' && (
                        <button
                          onClick={handleNextPatient}
                          className="py-1 px-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Call Now
                        </button>
                      )}
                      {token.status === 'Current' && (
                        <button
                          onClick={handleNextPatient}
                          className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Finish & Next
                        </button>
                      )}
                      {token.status === 'Visited' && (
                        <span className="text-slate-400 text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          Visited
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* HOSPITAL DEPARTMENTS & ON-DUTY SPECIALISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Departments */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              Active Hospital Departments
            </h3>
            <span className="text-xs text-slate-400">{hospitalFacility?.departments?.length || 0} Units</span>
          </div>

          <div className="space-y-2">
            {hospitalFacility?.departments?.map((dept) => (
              <div key={dept.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{dept.name}</p>
                  <p className="text-[11px] text-slate-500">Est. wait: {dept.currentWaitMin} mins • {dept.doctorCount} doctors</p>
                </div>
                <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                  {dept.code}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctors on Duty */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Specialists On Duty
            </h3>
            <span className="text-xs text-emerald-600 font-bold">● Available</span>
          </div>

          <div className="space-y-2">
            {hospitalFacility?.doctors?.map((doc) => (
              <div key={doc.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xs">
                    {doc.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{doc.name}</p>
                    <p className="text-[11px] text-slate-500">{doc.specialty} • {doc.departmentName}</p>
                  </div>
                </div>
                <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                  doc.isAvailableToday ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {doc.isAvailableToday ? 'On Duty' : 'Off Duty'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
