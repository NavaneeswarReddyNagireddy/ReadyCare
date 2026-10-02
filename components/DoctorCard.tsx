'use client';

import React from 'react';
import { Star, Clock, CalendarDays, Ticket, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Doctor, Facility } from '@/types';
import { useHealthcare } from '@/context/HealthcareContext';

interface DoctorCardProps {
  doctor: Doctor;
  facility?: Facility;
}

export default function DoctorCard({ doctor, facility }: DoctorCardProps) {
  const { openBookingModal } = useHealthcare();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      
      {/* Doctor Header & Avatar */}
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-xs"
          />
          {doctor.isAvailableToday && (
            <span 
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" 
              title="Available Today"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {doctor.name}
            </h4>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-1.5 py-0.5 rounded-md font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{doctor.rating}</span>
            </div>
          </div>

          <p className="text-xs font-semibold text-teal-600 truncate mt-0.5">
            {doctor.specialty}
          </p>

          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {doctor.qualification} • {doctor.experienceYears} yrs exp.
          </p>
        </div>
      </div>

      {/* Bio excerpt */}
      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
        {doctor.bio}
      </p>

      {/* Next slot & Fee pill */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-medium">Next: <strong className="text-slate-800">{doctor.nextAvailableSlot}</strong></span>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400">Fee: </span>
          <span className="text-xs font-extrabold text-slate-900">${doctor.consultationFee}</span>
        </div>
      </div>

      {/* Booking Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => openBookingModal({ doctor, facility, mode: 'TOKEN' })}
          className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <Ticket className="w-3.5 h-3.5 text-amber-600" />
          <span>Walk-in Token</span>
        </button>

        <button
          onClick={() => openBookingModal({ doctor, facility, mode: 'APPOINTMENT' })}
          className="py-2 px-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Book Visit</span>
        </button>
      </div>

    </div>
  );
}
