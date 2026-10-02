'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  ShieldAlert, 
  Phone, 
  Globe, 
  Mail, 
  Car, 
  Footprints, 
  CalendarDays, 
  Ticket, 
  Users, 
  Activity, 
  CheckCircle2, 
  Building2,
  Stethoscope,
  HeartPulse,
  Baby,
  Bone,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Facility } from '@/types';
import { useHealthcare } from '@/context/HealthcareContext';
import DoctorCard from './DoctorCard';

interface FacilityDetailsModalProps {
  facility: Facility | null;
  onClose: () => void;
}

export default function FacilityDetailsModal({ facility, onClose }: FacilityDetailsModalProps) {
  const { openBookingModal } = useHealthcare();
  const [activeTab, setActiveTab] = useState<'DEPARTMENTS' | 'DOCTORS' | 'QUEUE_BOARD' | 'HOURS'>('DEPARTMENTS');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL');

  if (!facility) return null;

  const filteredDoctors = selectedDeptId === 'ALL'
    ? facility.doctors
    : facility.doctors.filter(d => d.departmentId === selectedDeptId);

  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Baby': return <Baby className="w-5 h-5 text-pink-600" />;
      case 'Bone': return <Bone className="w-5 h-5 text-amber-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      default: return <Stethoscope className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Hero Image */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 shrink-0">
          <img
            src={facility.imageUrl}
            alt={facility.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
            <span className="bg-teal-500 text-white text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              {facility.type.replace('_', ' ')}
            </span>
            {facility.hasEmergencyER && (
              <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs">
                <ShieldAlert className="w-3.5 h-3.5" /> 24/7 Emergency Center
              </span>
            )}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white backdrop-blur-md ${facility.isOpenNow ? 'bg-emerald-600/90' : 'bg-red-600/90'}`}>
              ● {facility.isOpenNow ? 'Open Now' : 'Closed'}
            </span>
          </div>

          {/* Header Title Information */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight drop-shadow-xs">
                  {facility.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1 drop-shadow-xs">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{facility.address}, {facility.city}, {facility.state} {facility.zipCode}</span>
                </p>
              </div>

              {/* Distance and Rating Badge */}
              <div className="flex items-center gap-2 sm:self-end shrink-0">
                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs text-white">
                  <span className="font-bold text-teal-400">{facility.distanceKm} km</span> ({facility.driveTimeMin}m drive)
                </div>
                <div className="bg-amber-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{facility.rating.toFixed(1)}</span>
                  <span className="text-[10px] font-normal text-amber-100">({facility.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('DEPARTMENTS')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'DEPARTMENTS'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Departments ({facility.departments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('DOCTORS')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'DOCTORS'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Doctors On Duty ({facility.doctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('QUEUE_BOARD')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'QUEUE_BOARD'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-500" />
            <span>Live Queue Status</span>
          </button>

          <button
            onClick={() => setActiveTab('HOURS')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'HOURS'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Hours & Contact</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: DEPARTMENTS */}
          {activeTab === 'DEPARTMENTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Clinical Departments & Specialties</h3>
                  <p className="text-xs text-slate-500">Select a department to view available specialists and queue times</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {facility.departments.map(dept => (
                  <div
                    key={dept.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                        {getDeptIcon(dept.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{dept.name}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono">
                            {dept.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {dept.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-600 font-medium">
                        {dept.doctorCount} Doctors available
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[11px]">
                          ~{dept.currentWaitMin}m wait
                        </span>
                        <button
                          onClick={() => {
                            setSelectedDeptId(dept.id);
                            setActiveTab('DOCTORS');
                          }}
                          className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-0.5 ml-1 cursor-pointer"
                        >
                          <span>Doctors</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DOCTORS */}
          {activeTab === 'DOCTORS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Available Doctors & Specialists</h3>
                  <p className="text-xs text-slate-500">Reserve a slot or generate an instant walk-in token</p>
                </div>

                {/* Filter by Department dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Department:</span>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-hidden"
                  >
                    <option value="ALL">All Departments ({facility.doctors.length})</option>
                    {facility.departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredDoctors.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold">No doctors currently listed for this department.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDoctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} facility={facility} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE QUEUE BOARD */}
          {activeTab === 'QUEUE_BOARD' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-teal-700 font-bold uppercase tracking-wider">Average Wait Time</p>
                  <p className="text-3xl font-black text-teal-900 mt-1">~{facility.currentAvgWaitMin} min</p>
                  <p className="text-[11px] text-teal-600 mt-1">Updated 2 mins ago</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Active In Queue</p>
                  <p className="text-3xl font-black text-amber-900 mt-1">{facility.activeQueueCount} Patients</p>
                  <p className="text-[11px] text-amber-600 mt-1">Across all departments</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Doctor Response Rate</p>
                  <p className="text-3xl font-black text-blue-900 mt-1">98.4%</p>
                  <p className="text-[11px] text-blue-600 mt-1">On-time consultations</p>
                </div>
              </div>

              {/* Department breakdown table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between">
                  <span>Department Live Status</span>
                  <span>Estimated Queue Wait</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {facility.departments.map(dept => (
                    <div key={dept.id} className="p-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <p className="font-bold text-slate-900">{dept.name}</p>
                          <p className="text-slate-500 text-[11px]">{dept.doctorCount} Doctors active</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-800 text-sm">~{dept.currentWaitMin} mins</span>
                        <p className="text-[10px] text-emerald-600 font-medium">Fast Queue Flow</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital token CTA */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base">Skip the physical waiting room</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Generate a digital token now. We will notify you when it's your turn.</p>
                </div>
                <button
                  onClick={() => openBookingModal({ facility, mode: 'TOKEN' })}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Generate Token Now</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: OPERATING HOURS & CONTACT */}
          {activeTab === 'HOURS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Operating Schedule */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Operating Hours</span>
                  </h4>
                  <p className="text-xs text-slate-600 font-medium bg-white p-3 rounded-xl border border-slate-200">
                    {facility.operatingHours}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Emergency Room (ER)</span>
                      <strong className="text-slate-900">{facility.hasEmergencyER ? 'Open 24/7' : 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Outpatient Clinics (OPD)</span>
                      <strong className="text-slate-900">08:00 AM - 08:00 PM</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Diagnostic Lab & Pharmacy</span>
                      <strong className="text-slate-900">24/7 Service</strong>
                    </div>
                  </div>
                </div>

                {/* Contact & Location Details */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>Contact & Location</span>
                  </h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                      <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400">Reception & Inquiries</p>
                        <a href={`tel:${facility.phone}`} className="font-bold text-slate-800 hover:text-teal-600">
                          {facility.phone}
                        </a>
                      </div>
                    </div>

                    {facility.emergencyPhone && (
                      <div className="flex items-center gap-2.5 bg-red-50 p-2.5 rounded-xl border border-red-200">
                        <Phone className="w-4 h-4 text-red-600 shrink-0" />
                        <div>
                          <p className="text-[10px] text-red-500 font-bold">24/7 Emergency Line</p>
                          <a href={`tel:${facility.emergencyPhone}`} className="font-bold text-red-700">
                            {facility.emergencyPhone}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                      <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400">Official Email</p>
                        <span className="font-bold text-slate-800">{facility.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="text-xs text-slate-500 hidden sm:block">
            Need directions? Address: <strong className="text-slate-800">{facility.address}</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                openBookingModal({ facility, mode: 'TOKEN' });
              }}
              className="flex-1 sm:flex-initial py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Get Live Walk-in Token</span>
            </button>

            <button
              onClick={() => {
                onClose();
                openBookingModal({ facility, mode: 'APPOINTMENT' });
              }}
              className="flex-1 sm:flex-initial py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20 transition-all cursor-pointer"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Schedule Doctor Visit</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
