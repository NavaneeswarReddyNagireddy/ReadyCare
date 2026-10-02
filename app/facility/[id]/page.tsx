'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  ShieldAlert, 
  Phone, 
  Mail, 
  Car, 
  Building2, 
  Users, 
  Activity, 
  Ticket, 
  CalendarDays,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  Baby,
  Bone,
  Zap
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import DoctorCard from '@/components/DoctorCard';

export default function FacilityPage() {
  const params = useParams();
  const { facilities, openBookingModal } = useHealthcare();
  const [activeTab, setActiveTab] = useState<'DEPT' | 'DOCTORS' | 'QUEUE'>('DEPT');

  const facility = facilities.find(f => f.id === params?.id || f.slug === params?.id) || facilities[0];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top back link */}
      <Link 
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hospitals Directory</span>
      </Link>

      {/* Hero Facility Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={facility.imageUrl}
            alt={facility.name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

          {/* Badges */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-teal-500 text-white text-xs font-black uppercase px-3 py-1 rounded-md">
                {facility.type.replace('_', ' ')}
              </span>
              {facility.hasEmergencyER && (
                <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-md flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> 24/7 ER Trauma Unit
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold">
              <span className={`w-2.5 h-2.5 rounded-full ${facility.isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span>{facility.isOpenNow ? 'Open Now' : 'Closed'}</span>
            </div>
          </div>

          {/* Info Bottom */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{facility.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{facility.address}, {facility.city}, {facility.state} {facility.zipCode}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-xs">
                <span className="text-teal-400 font-extrabold">{facility.distanceKm} km</span> ({facility.driveTimeMin} min drive)
              </div>

              <div className="bg-amber-500 text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1">
                <Star className="w-4 h-4 fill-white text-white" />
                <span>{facility.rating.toFixed(1)}</span>
                <span className="text-[10px] font-normal text-amber-100">({facility.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Quick Action Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">About the Facility</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{facility.description}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                <p className="text-slate-400">Average Wait</p>
                <p className="font-extrabold text-slate-900 text-base mt-0.5">~{facility.currentAvgWaitMin} mins</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                <p className="text-slate-400">Clinical Teams</p>
                <p className="font-extrabold text-slate-900 text-base mt-0.5">{facility.departments.length} Departments</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                <p className="text-slate-400">Emergency Care</p>
                <p className="font-extrabold text-slate-900 text-base mt-0.5">{facility.hasEmergencyER ? '24/7 Level-1' : 'Standard'}</p>
              </div>
            </div>
          </div>

          {/* Clinical Departments */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Departments & Specialties</h2>
              <span className="text-xs text-teal-600 font-semibold">{facility.departments.length} Active Services</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facility.departments.map(dept => (
                <div key={dept.id} className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                      {getDeptIcon(dept.iconName)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{dept.name}</h4>
                      <p className="text-[11px] text-slate-500">{dept.doctorCount} Doctors • ~{dept.currentWaitMin}m wait</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors on Duty */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">Attending Specialists ({facility.doctors.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facility.doctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} facility={facility} />
              ))}
            </div>
          </div>

        </div>

        {/* Right Action Sidebar (1 Col) */}
        <div className="space-y-6">
          
          {/* Quick Booking Box */}
          <div className="bg-gradient-to-b from-teal-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-teal-500/20 space-y-5">
            <div>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">ReadyCare Fast-Track</span>
              <h3 className="text-xl font-black mt-1">Book or Queue Instantly</h3>
              <p className="text-xs text-slate-300 mt-1">Skip waiting rooms with digital token dispatch.</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openBookingModal({ facility, mode: 'TOKEN' })}
                className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Get Instant Walk-in Token</span>
              </button>

              <button
                onClick={() => openBookingModal({ facility, mode: 'APPOINTMENT' })}
                className="w-full py-3.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Schedule Doctor Slot</span>
              </button>
            </div>

            <div className="pt-3 border-t border-teal-800/60 text-xs text-slate-300 space-y-1.5">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Instant SMS & digital QR pass</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Live queue position alerts</span>
              </p>
            </div>
          </div>

          {/* Operating & Contact card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base">Facility Contact</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="text-slate-400">Hours of Operation</p>
                <p className="font-bold text-slate-800">{facility.operatingHours}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="text-slate-400">Appointments Desk</p>
                <a href={`tel:${facility.phone}`} className="font-bold text-teal-700 hover:underline">
                  {facility.phone}
                </a>
              </div>

              {facility.emergencyPhone && (
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200 space-y-1">
                  <p className="text-red-500 font-bold">24/7 ER Trauma Desk</p>
                  <a href={`tel:${facility.emergencyPhone}`} className="font-black text-red-700">
                    {facility.emergencyPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
