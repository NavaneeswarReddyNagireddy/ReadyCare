'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Facility, Appointment, QueueToken, Doctor, Department } from '@/types';
import { MOCK_FACILITIES, INITIAL_APPOINTMENTS, INITIAL_ACTIVE_TOKENS, INITIAL_HOSPITAL_QUEUES, HospitalQueueState } from '@/data/mockData';

export interface TurnAlert {
  id: string;
  type: 'YOUR_TURN' | 'NEXT_PATIENT' | 'VISIT_FINISHED';
  title: string;
  message: string;
  tokenNumber: string;
  facilityName: string;
  roomNumber?: string;
  doctorName?: string;
}

interface HealthcareContextType {
  facilities: Facility[];
  appointments: Appointment[];
  queueTokens: QueueToken[];
  activeToken: QueueToken | null;
  
  // Hospital Queue State & Action Simulation
  hospitalQueues: Record<string, HospitalQueueState>;
  selectedQueueFacility: Facility | null;
  openHospitalQueueModal: (facility: Facility) => void;
  closeHospitalQueueModal: () => void;
  advanceHospitalQueue: (facilityId: string) => void;
  activeTurnAlert: TurnAlert | null;
  dismissTurnAlert: () => void;
  
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
  const [hospitalQueues, setHospitalQueues] = useState<Record<string, HospitalQueueState>>(INITIAL_HOSPITAL_QUEUES);

  // Modals & Queue Dashboard
  const [selectedQueueFacility, setSelectedQueueFacility] = useState<Facility | null>(null);
  const [activeTurnAlert, setActiveTurnAlert] = useState<TurnAlert | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingFacility, setBookingFacility] = useState<Facility | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDepartment, setBookingDepartment] = useState<Department | null>(null);
  const [bookingInitialMode, setBookingInitialMode] = useState<'APPOINTMENT' | 'TOKEN'>('APPOINTMENT');

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isTokenDrawerOpen, setIsTokenDrawerOpen] = useState(false);

  const [latestCreatedToken, setLatestCreatedToken] = useState<QueueToken | null>(null);
  const [latestCreatedAppointment, setLatestCreatedAppointment] = useState<Appointment | null>(null);

  // Active user token helper
  const activeToken = queueTokens.find(t => t.status === 'Waiting' || t.status === 'Current') || null;

  const openHospitalQueueModal = (facility: Facility) => {
    setSelectedQueueFacility(facility);
  };

  const closeHospitalQueueModal = () => {
    setSelectedQueueFacility(null);
  };

  const dismissTurnAlert = () => {
    setActiveTurnAlert(null);
  };

  // ADVANCE QUEUE: The 'Next Patient' action simulation
  const advanceHospitalQueue = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId) || facilities[0];
    const currentQueue = hospitalQueues[facilityId] || INITIAL_HOSPITAL_QUEUES['fac-1'];

    const tokens = [...currentQueue.tokensList];
    const currentTokenIndex = tokens.findIndex(t => t.status === 'Current');
    const waitingTokens = tokens.filter(t => t.status === 'Waiting');

    if (waitingTokens.length === 0 && currentTokenIndex === -1) {
      return;
    }

    let finishedTokenNumber = '';
    let nextCalledTokenNumber = '';
    let nextPatientName = '';

    // Mark previous current token as Visited
    if (currentTokenIndex !== -1) {
      finishedTokenNumber = tokens[currentTokenIndex].tokenNumber;
      tokens[currentTokenIndex] = {
        ...tokens[currentTokenIndex],
        status: 'Visited',
        position: 0,
      };
    }

    // Find next waiting token to become Current
    const nextWaitingIndex = tokens.findIndex(t => t.status === 'Waiting');
    if (nextWaitingIndex !== -1) {
      nextCalledTokenNumber = tokens[nextWaitingIndex].tokenNumber;
      nextPatientName = tokens[nextWaitingIndex].patientName;
      tokens[nextWaitingIndex] = {
        ...tokens[nextWaitingIndex],
        status: 'Current',
        position: 0,
      };

      // Decrement position for remaining waiting tokens
      let newPositionCounter = 1;
      tokens.forEach((t, idx) => {
        if (idx > nextWaitingIndex && t.status === 'Waiting') {
          tokens[idx] = {
            ...tokens[idx],
            position: newPositionCounter++,
          };
        }
      });
    }

    const updatedTotalWaiting = tokens.filter(t => t.status === 'Waiting').length;

    const updatedQueueState: HospitalQueueState = {
      ...currentQueue,
      currentlyServing: {
        tokenNumber: nextCalledTokenNumber || 'None (Queue Empty)',
        patientName: nextPatientName || 'No waiting patients',
        doctorName: currentQueue.currentlyServing.doctorName,
        roomNumber: currentQueue.currentlyServing.roomNumber || 'Consultation Suite 204',
        calledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      totalWaiting: updatedTotalWaiting,
      tokensList: tokens,
    };

    setHospitalQueues(prev => ({
      ...prev,
      [facilityId]: updatedQueueState,
    }));

    // Update active user's token state in queueTokens
    setQueueTokens(prev =>
      prev.map(t => {
        if (t.facilityId === facilityId) {
          if (t.tokenNumber === nextCalledTokenNumber) {
            return {
              ...t,
              status: 'Current',
              positionInQueue: 0,
              estimatedWaitMin: 0,
              currentlyServingNumber: nextCalledTokenNumber,
            };
          } else if (t.tokenNumber === finishedTokenNumber) {
            return {
              ...t,
              status: 'Visited',
              positionInQueue: 0,
              estimatedWaitMin: 0,
            };
          } else if (t.status === 'Waiting' && t.positionInQueue > 0) {
            return {
              ...t,
              positionInQueue: Math.max(1, t.positionInQueue - 1),
              estimatedWaitMin: Math.max(3, t.estimatedWaitMin - 4),
              currentlyServingNumber: nextCalledTokenNumber || t.currentlyServingNumber,
            };
          }
        }
        return t;
      })
    );

    // Trigger prominent UI Alert Notification
    const matchingUserToken = queueTokens.find(t => t.facilityId === facilityId && (t.status === 'Waiting' || t.status === 'Current'));
    
    if (matchingUserToken && matchingUserToken.tokenNumber === nextCalledTokenNumber) {
      // User is the one whose turn it is!
      setActiveTurnAlert({
        id: `alert-${Date.now()}`,
        type: 'YOUR_TURN',
        title: '🔔 IT IS YOUR TURN NOW!',
        message: `Token #${nextCalledTokenNumber} (${nextPatientName}): Please proceed immediately to ${updatedQueueState.currentlyServing.roomNumber}.`,
        tokenNumber: nextCalledTokenNumber,
        facilityName: facility.name,
        roomNumber: updatedQueueState.currentlyServing.roomNumber,
        doctorName: updatedQueueState.currentlyServing.doctorName,
      });
    } else if (matchingUserToken && matchingUserToken.tokenNumber === finishedTokenNumber) {
      // User appointment just concluded
      setActiveTurnAlert({
        id: `alert-${Date.now()}`,
        type: 'VISIT_FINISHED',
        title: '✅ Consultation Completed',
        message: `Your visit with ${currentQueue.currentlyServing.doctorName} is marked as Visited. Next patient Token #${nextCalledTokenNumber} is now called.`,
        tokenNumber: finishedTokenNumber,
        facilityName: facility.name,
      });
    } else if (nextCalledTokenNumber) {
      // General next patient alert
      setActiveTurnAlert({
        id: `alert-${Date.now()}`,
        type: 'NEXT_PATIENT',
        title: `📢 Now Calling: Token #${nextCalledTokenNumber}`,
        message: `Patient ${nextPatientName} called to ${updatedQueueState.currentlyServing.roomNumber} (${facility.name}).`,
        tokenNumber: nextCalledTokenNumber,
        facilityName: facility.name,
        roomNumber: updatedQueueState.currentlyServing.roomNumber,
      });
    }
  };

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

    const facilityQueue = hospitalQueues[tokenData.facilityId] || hospitalQueues['fac-1'];
    const newPosition = (facilityQueue?.tokensList.filter(t => t.status === 'Waiting').length || 0) + 1;

    const newToken: QueueToken = {
      ...tokenData,
      id: `tok-${Date.now()}`,
      tokenNumber: randomToken,
      issueTime: formattedTime,
      positionInQueue: newPosition,
      currentlyServingNumber: facilityQueue?.currentlyServing.tokenNumber || 'TK-105',
      qrCodeRef: `READYCARE-${randomToken}-${Date.now().toString(36).toUpperCase()}`,
      status: 'Waiting',
    };

    // Add to active tokens
    setQueueTokens(prev => [newToken, ...prev]);
    setLatestCreatedToken(newToken);

    // Also add to hospital queue list
    if (hospitalQueues[tokenData.facilityId]) {
      setHospitalQueues(prev => {
        const q = prev[tokenData.facilityId];
        return {
          ...prev,
          [tokenData.facilityId]: {
            ...q,
            totalWaiting: q.totalWaiting + 1,
            tokensList: [
              ...q.tokensList,
              {
                id: newToken.id,
                tokenNumber: newToken.tokenNumber,
                patientName: newToken.patientName,
                status: 'Waiting',
                issueTime: newToken.issueTime,
                position: newPosition,
                priority: newToken.priority,
              },
            ],
          },
        };
      });
    }

    return newToken;
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
  };

  const cancelQueueToken = (id: string) => {
    setQueueTokens(prev => prev.map(t => t.id === id ? { ...t, status: 'Cancelled' } : t));
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
        hospitalQueues,
        selectedQueueFacility,
        openHospitalQueueModal,
        closeHospitalQueueModal,
        advanceHospitalQueue,
        activeTurnAlert,
        dismissTurnAlert,
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
