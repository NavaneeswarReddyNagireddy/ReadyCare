'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  ChevronRight,
  Video,
  MapPin
} from 'lucide-react';
import { Facility, Doctor, Department, AppointmentType, PriorityLevel } from '@/types';
import { TIME_SLOTS } from '@/data/mockData';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';
import TokenTicket from './TokenTicket';

export default function BookingModal() {
  const {
    isBookingOpen,
    bookingFacility,
    bookingDoctor,
    bookingDepartment,
    bookingInitialMode,
    closeBookingModal,
    facilities,
    createAppointment,
    createQueueToken,
  } = useHealthcare();

  const [bookingMode, setBookingMode] = useState<'APPOINTMENT' | 'TOKEN'>('APPOINTMENT');
  
  // Selected fields
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  
  // Appointment specific
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow, Oct 3, 2026');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('IN_PERSON');
  const [reasonForVisit, setReasonForVisit] = useState<string>('');

  // Walk-in Token specific
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>('STANDARD');

  // Patient Info
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  
  // Success states
  const [createdTokenResult, setCreatedTokenResult] = useState<any | null>(null);
  const [createdAppointmentResult, setCreatedAppointmentResult] = useState<any | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  const { user } = useAuth();

  // Sync props when modal opens
  useEffect(() => {
    if (isBookingOpen) {
      setBookingMode(bookingInitialMode);
      setCreatedTokenResult(null);
      setCreatedAppointmentResult(null);
      setValidationError('');
      
      const currentFac = bookingFacility || facilities[0];
      setSelectedFacilityId(currentFac.id);

      if (bookingDepartment) {
        setSelectedDeptId(bookingDepartment.id);
      } else if (currentFac.departments.length > 0) {
        setSelectedDeptId(currentFac.departments[0].id);
      }

      if (bookingDoctor) {
        setSelectedDoctorId(bookingDoctor.id);
        setSelectedDeptId(bookingDoctor.departmentId);
      } else if (currentFac.doctors.length > 0) {
        setSelectedDoctorId(currentFac.doctors[0].id);
      } else {
        setSelectedDoctorId('');
      }

      // Default to logged-in user
      setPatientName(user?.fullName || 'Alex Henderson');
      setPatientPhone(user?.phone || '+1 (555) 892-4112');
      setPatientEmail(user?.email || 'alex.henderson@example.com');
      setReasonForVisit('Routine medical check-up and clinical consultation');
    }
  }, [isBookingOpen, bookingFacility, bookingDoctor, bookingDepartment, bookingInitialMode, facilities, user]);

  if (!isBookingOpen) return null;

  const currentFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];
  const currentDepartments = currentFacility?.departments || [];
  const currentDoctors = currentFacility?.doctors.filter(d => !selectedDeptId || d.departmentId === selectedDeptId) || currentFacility?.doctors || [];
  const currentDoctor = currentFacility?.doctors.find(d => d.id === selectedDoctorId);
  const currentDepartment = currentFacility?.departments.find(d => d.id === selectedDeptId);

  const handleFacilityChange = (facId: string) => {
    setSelectedFacilityId(facId);
    const newFac = facilities.find(f => f.id === facId);
    if (newFac && newFac.departments.length > 0) {
      setSelectedDeptId(newFac.departments[0].id);
      if (newFac.doctors.length > 0) {
        setSelectedDoctorId(newFac.doctors[0].id);
      } else {
        setSelectedDoctorId('');
      }
    }
  };

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const docsInDept = currentFacility.doctors.filter(d => d.departmentId === deptId);
    if (docsInDept.length > 0) {
      setSelectedDoctorId(docsInDept[0].id);
    } else {
      setSelectedDoctorId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!patientName.trim()) {
      setValidationError('Please enter patient full name.');
      return;
    }
    if (!patientPhone.trim()) {
      setValidationError('Please enter patient phone number.');
      return;
    }

    if (bookingMode === 'APPOINTMENT') {
      if (!selectedTimeSlot) {
        setValidationError('Please select an appointment time slot.');
        return;
      }

      const newApt = createAppointment({
        facilityId: currentFacility.id,
        facilityName: currentFacility.name,
        facilityAddress: currentFacility.address,
        doctorId: currentDoctor?.id || 'doc-general',
        doctorName: currentDoctor?.name || 'Assigned Duty Physician',
        doctorSpecialty: currentDoctor?.specialty || currentDepartment?.name || 'General Medicine',
        departmentName: currentDepartment?.name || 'Outpatient Clinic',
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot,
        type: appointmentType,
        status: 'CONFIRMED',
        patientName,
        patientPhone,
        patientEmail,
        reasonForVisit: reasonForVisit || 'General Clinical Consultation',
      });

      setCreatedAppointmentResult(newApt);
    } else {
      // Create Queue Token
      const newToken = createQueueToken({
        facilityId: currentFacility.id,
        facilityName: currentFacility.name,
        facilityAddress: currentFacility.address,
        doctorId: currentDoctor?.id,
        doctorName: currentDoctor?.name,
        departmentId: currentDepartment?.id || 'dept-general',
        departmentName: currentDepartment?.name || 'General OPD',
        status: 'WAITING',
        priority: priorityLevel,
        patientName,
        patientPhone,
        estimatedWaitMin: currentDepartment?.currentWaitMin || currentFacility.currentAvgWaitMin || 15,
        notes: reasonForVisit,
      });

      setCreatedTokenResult(newToken);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              {bookingMode === 'APPOINTMENT' ? <CalendarDays className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {bookingMode === 'APPOINTMENT' ? 'Schedule Doctor Appointment' : 'Generate Digital Queue Token'}
              </h2>
              <p className="text-xs text-slate-500">
                {bookingMode === 'APPOINTMENT' ? 'Reserve an exact time slot with confirmation' : 'Skip the wait room with live priority queue pass'}
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View: Token or Appointment Confirmation */}
        {createdTokenResult ? (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Digital Token Issued Successfully!</h3>
              <p className="text-xs text-slate-600">Your live queue pass is ready. Track wait updates in real time.</p>
            </div>

            <TokenTicket token={createdTokenResult} />

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={closeBookingModal}
                className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md"
              >
                Done & View My Visits
              </button>
            </div>
          </div>
        ) : createdAppointmentResult ? (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-600">A confirmation SMS and calendar invite have been sent.</p>
            </div>

            <div className="bg-slate-50 border border-teal-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500">APPOINTMENT REFERENCE</span>
                <span className="font-mono font-black text-teal-700 text-base">{createdAppointmentResult.appointmentNumber}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400">Doctor</p>
                  <p className="font-bold text-slate-900">{createdAppointmentResult.doctorName}</p>
                  <p className="text-[11px] text-teal-600 font-medium">{createdAppointmentResult.doctorSpecialty}</p>
                </div>

                <div>
                  <p className="text-slate-400">Date & Slot</p>
                  <p className="font-bold text-slate-900">{createdAppointmentResult.appointmentDate}</p>
                  <p className="text-[11px] text-slate-700 font-semibold">{createdAppointmentResult.timeSlot}</p>
                </div>

                <div>
                  <p className="text-slate-400">Facility</p>
                  <p className="font-bold text-slate-900">{createdAppointmentResult.facilityName}</p>
                  <p className="text-[11px] text-slate-500">{createdAppointmentResult.facilityAddress}</p>
                </div>

                <div>
                  <p className="text-slate-400">Patient</p>
                  <p className="font-bold text-slate-900">{createdAppointmentResult.patientName}</p>
                  <p className="text-[11px] text-slate-500">{createdAppointmentResult.patientPhone}</p>
                </div>
              </div>

              <div className="bg-teal-50 text-teal-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Please arrive 10 minutes prior to your consultation slot with any previous health records.</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={closeBookingModal}
                className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setBookingMode('APPOINTMENT')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  bookingMode === 'TOKEN'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Ticket className="w-4 h-4 text-amber-500" />
                <span>Fast Walk-in Token</span>
              </button>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Section 1: Facility & Department Selection */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Facility & Department</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Healthcare Facility</label>
                  <select
                    value={selectedFacilityId}
                    onChange={(e) => handleFacilityChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    {facilities.map(fac => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name} ({fac.distanceKm} km away)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Specialty</label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    {currentDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} (~{dept.currentWaitMin}m wait)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctor Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Doctor / Specialist</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="">Any Available Duty Physician</option>
                  {currentDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialty} (${doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Mode Specific Options */}
            {bookingMode === 'APPOINTMENT' ? (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Date & Time Slot</h3>

                {/* Consultation Type */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAppointmentType('IN_PERSON')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      appointmentType === 'IN_PERSON'
                        ? 'border-teal-600 bg-teal-50 text-teal-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>In-Person Visit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentType('VIDEO_CONSULTATION')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      appointmentType === 'VIDEO_CONSULTATION'
                        ? 'border-teal-600 bg-teal-50 text-teal-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-4 h-4 text-teal-600" />
                    <span>Video Telehealth</span>
                  </button>
                </div>

                {/* Date Picker Chips */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Preferred Date</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Today, Oct 2', 'Tomorrow, Oct 3', 'Monday, Oct 5'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        className={`py-2 px-2 text-xs rounded-xl font-bold border transition-all cursor-pointer ${
                          selectedDate === d
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Available Slots</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-1.5 text-[11px] rounded-lg font-semibold transition-all cursor-pointer text-center ${
                          selectedTimeSlot === slot
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
                        }`}
                      >
                        {slot.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* TOKEN PRIORITY SECTION */
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Priority Category</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Standard', value: 'STANDARD', desc: 'General walk-in' },
                    { label: 'Senior Citizen', value: 'SENIOR_CITIZEN', desc: 'Age 60+ Fast-track' },
                    { label: 'Pediatric', value: 'PEDIATRIC', desc: 'Infants & Kids' },
                    { label: 'ER Triage', value: 'EMERGENCY_TRIAGE', desc: 'Urgent attention' },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriorityLevel(p.value as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        priorityLevel === p.value
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <p className="font-bold text-xs">{p.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Estimated live queue wait: <strong>~{currentDepartment?.currentWaitMin || 15} mins</strong></span>
                  </div>
                  <span className="font-bold text-emerald-700 text-[11px]">Instant Token Allocation</span>
                </div>
              </div>
            )}

            {/* Section 3: Patient Information */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Patient Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Alex Henderson"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone (for SMS updates)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit / Symptoms</label>
                <input
                  type="text"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder="e.g. Fever, chest checkup, routine consultation"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeBookingModal}
                className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-102 active:scale-98 ${
                  bookingMode === 'APPOINTMENT'
                    ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
                    : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                }`}
              >
                {bookingMode === 'APPOINTMENT' ? (
                  <>
                    <CalendarDays className="w-4 h-4" />
                    <span>Confirm Appointment</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Generate Instant Queue Token</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
