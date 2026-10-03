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
  ChevronRight
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';

export default function AdminQueueManagerPage() {
  const { 
    facilities, 
    hospitalQueues, 
    advanceHospitalQueue, 
    openBookingModal 
  } = useHealthcare();
  const { user, toggleRole, setRole } = useAuth();

  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'fac-1');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Waiting' | 'Current' | 'Visited'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];
  const queueState = hospitalQueues[selectedFacilityId] || hospitalQueues['fac-1'];

  const handleNextPatient = () => {
    advanceHospitalQueue(selectedFacilityId);
  };

  const filteredTokens = queueState.tokensList.filter((token) => {
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

  const waitingCount = queueState.tokensList.filter(t => t.status === 'Waiting').length;
  const visitedCount = queueState.tokensList.filter(t => t.status === 'Visited').length;
  const currentToken = queueState.tokensList.find(t => t.status === 'Current');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Top Header & Role Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Hospital Staff & Triage Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">RBAC Mode: <strong>{user?.role || 'PATIENT'}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Live Queue Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Dispatch waiting room queues, call next patients to clinical rooms, and track real-time patient throughput.
          </p>
        </div>

        {/* Demo Toggle & Shortcuts */}
        <div className="flex items-center gap-3">
          {user?.role !== 'HOSPITAL_ADMIN' && (
            <button
              onClick={() => setRole('HOSPITAL_ADMIN')}
              className="py-2 px-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Enable Admin Access (Demo)</span>
            </button>
          )}

          <button
            onClick={() => openBookingModal({ facility: currentFacility, mode: 'TOKEN' })}
            className="py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>+ Issue Walk-in Pass</span>
          </button>
        </div>
      </div>

      {/* Role Warning Banner if viewing as Patient */}
      {user?.role !== 'HOSPITAL_ADMIN' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">You are currently in Patient Mode ({user?.fullName})</p>
              <p className="text-amber-700 text-[11px]">
                In production, this route is restricted to hospital staff. For testing and presenting to judges, flip your role using the button on the right.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRole('HOSPITAL_ADMIN')}
            className="py-1.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs whitespace-nowrap cursor-pointer"
          >
            Switch to Hospital Admin
          </button>
        </div>
      )}

      {/* Facility Selector & Department Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Active Hospital Facility
            </label>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>Department: <strong className="text-slate-800">{queueState.departmentName}</strong></span>
        </div>

      </div>

      {/* THREE COMMAND METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Currently Calling / In Consultation */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Consultation</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-teal-700">
                {queueState.currentlyServing.tokenNumber}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-md">
                ROOM ACTIVE
              </span>
            </div>

            <div className="mt-2 space-y-1 text-xs">
              <p className="font-bold text-slate-900 text-sm">{queueState.currentlyServing.patientName}</p>
              <p className="text-slate-500">{queueState.currentlyServing.roomNumber} • {queueState.currentlyServing.doctorName}</p>
              <p className="text-[11px] text-teal-700 font-medium">Called at: {queueState.currentlyServing.calledTime}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Assigned Specialist: {queueState.currentlyServing.doctorName}
          </div>
        </div>

        {/* Card 2: Total Waiting Count */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patients in Waiting Line</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>

          <div>
            <p className="text-4xl sm:text-5xl font-black text-slate-900">
              {waitingCount} <span className="text-base font-semibold text-slate-400">in line</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Estimated line clearance: <strong>~{waitingCount * 10} mins</strong>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Served Today: <strong className="text-slate-800">{visitedCount}</strong></span>
            <span className="text-emerald-600 font-bold">● High Throughput</span>
          </div>
        </div>

        {/* Card 3: PROMINENT 'NEXT PATIENT' ADVANCE ACTION (Exact Requirement) */}
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-teal-500/30 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-teal-300 tracking-wider">Queue Progression</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">
              Advance Waiting Queue
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Completes active consultation (marks as <strong className="text-emerald-400">Visited</strong>) and promotes the next waiting patient in line to <strong className="text-teal-300">Current</strong> with instant audio-visual dispatch alert.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextPatient}
            className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Call Next Patient ➔</span>
          </button>
        </div>

      </div>

      {/* QUEUE MANAGEMENT TABLE & SEARCH */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-5 sm:p-6">
        
        {/* Table Top Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-slate-100">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <h3 className="font-extrabold text-slate-900 text-base">Active Queue Matrix</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {filteredTokens.length} Records
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
                    No tokens found matching this filter criteria.
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
                        <span className="text-emerald-600 font-extrabold">In Room</span>
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
                          Done
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

    </div>
  );
}
