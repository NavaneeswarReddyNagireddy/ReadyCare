'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarDays, 
  Ticket, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  MapPin,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';
import { AppointmentType, PriorityLevel } from '@/types';
import { TIME_SLOTS } from '@/data/mockData';
import TokenTicket from '@/components/TokenTicket';

export default function BookingPage() {
  const {
    facilities,
    createAppointment,
    createQueueToken,
  } = useHealthcare();
  const { user } = useAuth();

  const [bookingMode, setBookingMode] = useState<'APPOINTMENT' | 'TOKEN'>('APPOINTMENT');
  
  // Selected state
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || '');
  const currentFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];
  
  const [selectedDeptId, setSelectedDeptId] = useState<string>(currentFacility?.departments[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(currentFacility?.doctors[0]?.id || '');
  
  // Appointment specific
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow, Oct 3, 2026');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('IN_PERSON');
  const [reasonForVisit, setReasonForVisit] = useState<string>('');

  // Token priority
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>('STANDARD');

  // Patient Info
  const [patientName, setPatientName] = useState<string>(user?.fullName || 'Alex Henderson');
  const [patientPhone, setPatientPhone] = useState<string>(user?.phone || '+1 (555) 892-4112');
  const [patientEmail, setPatientEmail] = useState<string>(user?.email || 'alex.henderson@example.com');

  // Results
  const [createdToken, setCreatedToken] = useState<any | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const currentDoctor = currentFacility?.doctors.find(d => d.id === selectedDoctorId);
  const currentDepartment = currentFacility?.departments.find(d => d.id === selectedDeptId);

  const handleFacilitySelect = (id: string) => {
    setSelectedFacilityId(id);
    const fac = facilities.find(f => f.id === id);
    if (fac && fac.departments.length > 0) {
      setSelectedDeptId(fac.departments[0].id);
      if (fac.doctors.length > 0) {
        setSelectedDoctorId(fac.doctors[0].id);
      } else {
        setSelectedDoctorId('');
      }
    }
  };

  const handleDepartmentSelect = (id: string) => {
    setSelectedDeptId(id);
    const docs = currentFacility?.doctors.filter(d => d.departmentId === id) || [];
    if (docs.length > 0) {
      setSelectedDoctorId(docs[0].id);
    } else {
      setSelectedDoctorId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient full name');
      return;
    }
    if (!patientPhone.trim()) {
      setErrorMsg('Please enter a valid contact phone number');
      return;
    }

    if (bookingMode === 'APPOINTMENT') {
      const newApt = createAppointment({
        facilityId: currentFacility.id,
        facilityName: currentFacility.name,
        facilityAddress: currentFacility.address,
        doctorId: currentDoctor?.id || 'doc-general',
        doctorName: currentDoctor?.name || 'Duty Medical Officer',
        doctorSpecialty: currentDoctor?.specialty || currentDepartment?.name || 'General Consultation',
        departmentName: currentDepartment?.name || 'Outpatient Clinic',
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot,
        type: appointmentType,
        status: 'CONFIRMED',
        patientName,
        patientPhone,
        patientEmail,
        reasonForVisit: reasonForVisit || 'Specialist Consultation',
      });
      setCreatedAppointment(newApt);
    } else {
      const newToken = createQueueToken({
        facilityId: currentFacility.id,
        facilityName: currentFacility.name,
        facilityAddress: currentFacility.address,
        doctorId: currentDoctor?.id,
        doctorName: currentDoctor?.name,
        departmentId: currentDepartment?.id || 'dept-general',
        departmentName: currentDepartment?.name || 'General OPD',
        status: 'Waiting',
        priority: priorityLevel,
        patientName,
        patientPhone,
        estimatedWaitMin: currentDepartment?.currentWaitMin || currentFacility.currentAvgWaitMin || 15,
        notes: reasonForVisit,
      });
      setCreatedToken(newToken);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top back link & header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospital Discovery</span>
        </Link>

        <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
          Smart Booking Portal
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Healthcare Access & Booking Kiosk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select an accredited facility, pick your doctor, and secure an exact appointment or live queue token.
        </p>
      </div>

      {/* Booking Confirmation views */}
      {createdToken ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Your Live Walk-in Token is Confirmed!</h2>
            <p className="text-xs text-slate-500">Track your queue spot or scan this ticket at hospital reception.</p>
          </div>

          <TokenTicket token={createdToken} />

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setCreatedToken(null);
              }}
              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Book Another Visit
            </button>
            <Link
              href="/"
              className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Return to Discovery
            </Link>
          </div>
        </div>
      ) : createdAppointment ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Appointment Scheduled Successfully!</h2>
            <p className="text-xs text-slate-500">Reference: <strong>{createdAppointment.appointmentNumber}</strong></p>
          </div>

          <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Doctor:</span>
              <strong className="text-slate-900">{createdAppointment.doctorName} ({createdAppointment.doctorSpecialty})</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Date & Slot:</span>
              <strong className="text-slate-900">{createdAppointment.appointmentDate} • {createdAppointment.timeSlot}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Facility:</span>
              <strong className="text-slate-900">{createdAppointment.facilityName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <strong className="text-slate-900">{createdAppointment.patientName} ({createdAppointment.patientPhone})</strong>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCreatedAppointment(null);
              }}
              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Book Another Visit
            </button>
            <Link
              href="/"
              className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setBookingMode('APPOINTMENT')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                bookingMode === 'APPOINTMENT'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Scheduled Appointment</span>
            </button>

            <button
              type="button"
              onClick={() => setBookingMode('TOKEN')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                bookingMode === 'TOKEN'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-4 h-4 text-amber-500" />
              <span>Fast Walk-in Token</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Select Facility */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">1</span>
                <span>Select Healthcare Facility</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {facilities.map(fac => (
                  <div
                    key={fac.id}
                    onClick={() => handleFacilitySelect(fac.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      selectedFacilityId === fac.id
                        ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-md">
                          {fac.type}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{fac.distanceKm} km</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-1">{fac.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{fac.address}</p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                      <span>Wait: ~{fac.currentAvgWaitMin}m</span>
                      <span className="text-teal-700 font-bold">{fac.doctors.length} Doctors</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Department & Doctor */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">2</span>
                <span>Choose Department & Doctor</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => handleDepartmentSelect(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    {currentFacility.departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} (~{d.currentWaitMin}m wait)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialist Doctor</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    <option value="">Any Available Duty Physician</option>
                    {currentFacility.doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.specialty} (${doc.consultationFee})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Slot or Priority */}
            {bookingMode === 'APPOINTMENT' ? (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">3</span>
                  <span>Select Date & Time Slot</span>
                </h3>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {['Today, Oct 2', 'Tomorrow, Oct 3', 'Monday, Oct 5'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`py-2.5 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                        selectedDate === d
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Available Consultation Hours</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        {slot.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">3</span>
                  <span>Select Priority Level</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Standard', value: 'STANDARD', desc: 'General walk-in' },
                    { label: 'Senior Citizen', value: 'SENIOR_CITIZEN', desc: 'Age 60+ Fast-track' },
                    { label: 'Pediatric', value: 'PEDIATRIC', desc: 'Infants & Kids' },
                    { label: 'ER Triage', value: 'EMERGENCY_TRIAGE', desc: 'Urgent attention' },
                  ].map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriorityLevel(p.value as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        priorityLevel === p.value
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-bold text-xs">{p.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Patient Information */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">4</span>
                <span>Patient Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (for SMS & Queue Alerts)</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit / Symptoms</label>
                <input
                  type="text"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder="e.g. Mild headache, regular heart follow-up, infant vaccination"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-4">
              <Link
                href="/"
                className="py-3 px-5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className={`py-3.5 px-8 rounded-2xl font-black text-sm text-white shadow-lg transition-all cursor-pointer hover:scale-102 active:scale-98 ${
                  bookingMode === 'APPOINTMENT'
                    ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
                    : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                }`}
              >
                {bookingMode === 'APPOINTMENT' ? 'Confirm Scheduled Booking' : 'Generate Instant Walk-in Token'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
