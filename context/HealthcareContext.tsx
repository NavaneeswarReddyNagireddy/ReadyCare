'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Facility, Appointment, QueueToken, Doctor, Department } from '@/types';
import { MOCK_FACILITIES, INITIAL_APPOINTMENTS, INITIAL_ACTIVE_TOKENS } from '@/data/mockData';

interface HealthcareContextType {
  facilities: Facility[];
  appointments: Appointment[];
  queueTokens: QueueToken[];
  activeToken: QueueToken | null;
  // Booking modal state
  isBookingOpen: boolean;
  bookingFacility: Facility | null;
  bookingDoctor: Doctor | null;
  bookingDepartment: Department | null;
  bookingInitialMode: 'APPOINTMENT' | 'TOKEN';
  openBookingModal: (params?: {
    facility?: Facility;
    doctor?: Doctor;
    department?: Department;
    mode?: 'APPOINTMENT' | 'TOKEN';
  }) => void;
  closeBookingModal: () => void;
  // Facility details modal state
  selectedFacility: Facility | null;
  openFacilityDetails: (facility: Facility) => void;
  closeFacilityDetails: () => void;
  // Token drawer state
  isTokenDrawerOpen: boolean;
  openTokenDrawer: () => void;
  closeTokenDrawer: () => void;
  // Action handlers
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>) => Appointment;
  createQueueToken: (tokenData: Omit<QueueToken, 'id' | 'tokenNumber' | 'issueTime' | 'positionInQueue' | 'currentlyServingNumber' | 'qrCodeRef'>) => QueueToken;
  cancelAppointment: (id: string) => void;
  cancelQueueToken: (id: string) => void;
  // Success / Token ticket modal
  latestCreatedToken: QueueToken | null;
  latestCreatedAppointment: Appointment | null;
  clearLatestCreated: () => void;
}

const HealthcareContext = createContext<HealthcareContextType | undefined>(undefined);

export function HealthcareProvider({ children }: { children: React.ReactNode }) {
  const [facilities] = useState<Facility[]>(MOCK_FACILITIES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [queueTokens, setQueueTokens] = useState<QueueToken[]>(INITIAL_ACTIVE_TOKENS);
  
  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingFacility, setBookingFacility] = useState<Facility | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDepartment, setBookingDepartment] = useState<Department | null>(null);
  const [bookingInitialMode, setBookingInitialMode] = useState<'APPOINTMENT' | 'TOKEN'>('APPOINTMENT');

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isTokenDrawerOpen, setIsTokenDrawerOpen] = useState(false);

  const [latestCreatedToken, setLatestCreatedToken] = useState<QueueToken | null>(null);
  const [latestCreatedAppointment, setLatestCreatedAppointment] = useState<Appointment | null>(null);

  // Active token helper
  const activeToken = queueTokens.find(t => t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'IN_CONSULTATION') || null;

  // Real-time queue simulation ticker (every 45s advances wait or serving number)
  useEffect(() => {
    const timer = setInterval(() => {
      setQueueTokens(prev =>
        prev.map(token => {
          if (token.status === 'WAITING' && token.positionInQueue > 1) {
            return {
              ...token,
              positionInQueue: token.positionInQueue - 1,
              estimatedWaitMin: Math.max(2, token.estimatedWaitMin - 4),
            };
          } else if (token.status === 'WAITING' && token.positionInQueue === 1) {
            return {
              ...token,
              status: 'CALLED',
              positionInQueue: 0,
              estimatedWaitMin: 0,
              currentlyServingNumber: token.tokenNumber,
            };
          }
          return token;
        })
      );
    }, 35000);

    return () => clearInterval(timer);
  }, []);

  const openBookingModal = (params?: {
    facility?: Facility;
    doctor?: Doctor;
    department?: Department;
    mode?: 'APPOINTMENT' | 'TOKEN';
  }) => {
    setBookingFacility(params?.facility || MOCK_FACILITIES[0]);
    setBookingDoctor(params?.doctor || null);
    setBookingDepartment(params?.department || null);
    setBookingInitialMode(params?.mode || 'APPOINTMENT');
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
  };

  const openFacilityDetails = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const closeFacilityDetails = () => {
    setSelectedFacility(null);
  };

  const openTokenDrawer = () => setIsTokenDrawerOpen(true);
  const closeTokenDrawer = () => setIsTokenDrawerOpen(false);

  const createAppointment = (appointmentData: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>): Appointment => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      appointmentNumber: `APT-2026-${randomNum}`,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setLatestCreatedAppointment(newAppointment);
    return newAppointment;
  };

  const createQueueToken = (tokenData: Omit<QueueToken, 'id' | 'tokenNumber' | 'issueTime' | 'positionInQueue' | 'currentlyServingNumber' | 'qrCodeRef'>): QueueToken => {
    const prefixLetter = tokenData.departmentName?.includes('Emergency') ? 'ER' : 'TK';
    const randomToken = `${prefixLetter}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newToken: QueueToken = {
      ...tokenData,
      id: `tok-${Date.now()}`,
      tokenNumber: randomToken,
      issueTime: formattedTime,
      positionInQueue: Math.floor(2 + Math.random() * 4),
      currentlyServingNumber: `${prefixLetter}-${Math.floor(100 + Math.random() * 900)}`,
      qrCodeRef: `READYCARE-${randomToken}-${Date.now().toString(36).toUpperCase()}`,
    };

    setQueueTokens(prev => [newToken, ...prev]);
    setLatestCreatedToken(newToken);
    return newToken;
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
  };

  const cancelQueueToken = (id: string) => {
    setQueueTokens(prev => prev.map(t => t.id === id ? { ...t, status: 'CANCELLED' } : t));
  };

  const clearLatestCreated = () => {
    setLatestCreatedToken(null);
    setLatestCreatedAppointment(null);
  };

  return (
    <HealthcareContext.Provider
      value={{
        facilities,
        appointments,
        queueTokens,
        activeToken,
        isBookingOpen,
        bookingFacility,
        bookingDoctor,
        bookingDepartment,
        bookingInitialMode,
        openBookingModal,
        closeBookingModal,
        selectedFacility,
        openFacilityDetails,
        closeFacilityDetails,
        isTokenDrawerOpen,
        openTokenDrawer,
        closeTokenDrawer,
        createAppointment,
        createQueueToken,
        cancelAppointment,
        cancelQueueToken,
        latestCreatedToken,
        latestCreatedAppointment,
        clearLatestCreated,
      }}
    >
      {children}
    </HealthcareContext.Provider>
  );
}

export function useHealthcare() {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error('useHealthcare must be used within a HealthcareProvider');
  }
  return context;
}
