export type FacilityType = 'HOSPITAL' | 'CLINIC' | 'URGENT_CARE' | 'DIAGNOSTIC_CENTER' | 'SPECIALTY_CENTER';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export type AppointmentType = 'IN_PERSON' | 'VIDEO_CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY_TRIAGE';

export type TokenStatus = 'WAITING' | 'CALLED' | 'IN_CONSULTATION' | 'SERVED' | 'SKIPPED' | 'CANCELLED';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  age?: number;
  occupation?: string;
  bloodGroup?: string;
  phone?: string;
  isProfileComplete: boolean;
  createdAt?: string;
}

export type PriorityLevel = 'STANDARD' | 'SENIOR_CITIZEN' | 'PEDIATRIC' | 'EMERGENCY_TRIAGE';

export interface Doctor {
  id: string;
  name: string;
  avatarUrl: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  isAvailableToday: boolean;
  nextAvailableSlot: string;
  availableDays: string[];
  departmentId: string;
  departmentName: string;
  facilityId: string;
  facilityName: string;
  bio: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  iconName: string;
  doctorCount: number;
  currentWaitMin: number;
}

export interface Facility {
  id: string;
  name: string;
  slug: string;
  type: FacilityType;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website: string;
  distanceKm: number; // Mock distance in km
  driveTimeMin: number;
  walkTimeMin: number;
  isOpen24Hours: boolean;
  isOpenNow: boolean;
  hasEmergencyER: boolean;
  operatingHours: string;
  rating: number;
  reviewCount: number;
  currentAvgWaitMin: number;
  activeQueueCount: number;
  imageUrl: string;
  departments: Department[];
  doctors: Doctor[];
  featuredSpecialties: string[];
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  facilityId: string;
  facilityName: string;
  facilityAddress: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  departmentName: string;
  appointmentDate: string;
  timeSlot: string;
  type: AppointmentType;
  status: AppointmentStatus;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  reasonForVisit: string;
  notes?: string;
  createdAt: string;
}

export interface QueueToken {
  id: string;
  tokenNumber: string; // e.g., "TK-104"
  facilityId: string;
  facilityName: string;
  facilityAddress: string;
  doctorId?: string;
  doctorName?: string;
  departmentId: string;
  departmentName: string;
  status: TokenStatus;
  priority: PriorityLevel;
  patientName: string;
  patientPhone: string;
  issueTime: string;
  positionInQueue: number;
  currentlyServingNumber: string;
  estimatedWaitMin: number;
  qrCodeRef: string;
  notes?: string;
}

export interface SearchFilters {
  query: string;
  specialty: string;
  facilityType: string;
  maxDistanceKm: number;
  onlyOpenNow: boolean;
  onlyEmergencyER: boolean;
  sortBy: 'distance' | 'wait_time' | 'rating';
}
