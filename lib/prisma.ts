import { HospitalProfile, DoctorProfile, PatientProfile, User, Role, UserRole } from '@/types';

export interface UserRecord extends User {
  password?: string;
  updatedAt?: string;
}

/**
 * Geocodes an address or city text string into realistic map coordinates.
 */
export function geocodeAddress(address: string): { latitude: number; longitude: number } {
  const addr = address.toLowerCase();
  if (addr.includes('east') || addr.includes('oakridge')) return { latitude: 37.7680, longitude: -122.4080 };
  if (addr.includes('biotech') || addr.includes('innovation') || addr.includes('apex')) return { latitude: 37.7850, longitude: -122.4020 };
  if (addr.includes('bay') || addr.includes('harbor') || addr.includes('water')) return { latitude: 37.7950, longitude: -122.3950 };
  if (addr.includes('north') || addr.includes('trauma') || addr.includes('heights')) return { latitude: 37.7600, longitude: -122.4350 };
  if (addr.includes('west') || addr.includes('sunset')) return { latitude: 37.7710, longitude: -122.4450 };
  if (addr.includes('south') || addr.includes('mission')) return { latitude: 37.7520, longitude: -122.4150 };
  if (addr.includes('downtown') || addr.includes('metro') || addr.includes('central')) return { latitude: 37.7749, longitude: -122.4194 };
  
  // Deterministic pseudo-random offset around center [37.7749, -122.4194]
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 100) - 50) * 0.0006;
  const lngOffset = ((Math.abs(hash >> 3) % 100) - 50) * 0.0006;
  return {
    latitude: Number((37.7749 + latOffset).toFixed(5)),
    longitude: Number((-122.4194 + lngOffset).toFixed(5)),
  };
}

// In-memory persistent user accounts
let memoryUsers: UserRecord[] = [
  {
    id: 'usr-patient-1',
    email: 'alex.henderson@example.com',
    password: 'password123',
    fullName: 'Alex Henderson',
    role: 'PATIENT',
    age: 34,
    occupation: 'Senior Systems Architect',
    phone: '+1 (555) 892-4112',
    bloodGroup: 'O+',
    isProfileComplete: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    patientProfile: {
      id: 'prof-pat-1',
      userId: 'usr-patient-1',
      name: 'Alex Henderson',
      email: 'alex.henderson@example.com',
      phoneNumber: '+1 (555) 892-4112',
      createdAt: '2026-09-01T10:00:00Z',
    },
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'usr-doctor-1',
    email: 'dr.sarah.jenkins@metrohealth.org',
    password: 'password123',
    fullName: 'Dr. Sarah Jenkins',
    role: 'DOCTOR',
    age: 39,
    occupation: 'Lead Interventional Cardiologist',
    phone: '+1 (555) 234-5678',
    bloodGroup: 'B+',
    hospitalId: 'fac-1',
    hospitalName: 'MetroHealth Grand Medical Center',
    isProfileComplete: true,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    doctorProfile: {
      id: 'prof-doc-1',
      userId: 'usr-doctor-1',
      doctorName: 'Dr. Sarah Jenkins',
      email: 'dr.sarah.jenkins@metrohealth.org',
      workingHospitalName: 'MetroHealth Grand Medical Center',
      specialization: 'Interventional Cardiologist',
      createdAt: '2026-09-01T10:00:00Z',
    },
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'usr-hospital-1',
    email: 'admin@metrohealth.org',
    password: 'password123',
    fullName: 'Dr. Marcus Vance',
    role: 'HOSPITAL',
    hospitalId: 'fac-1',
    hospitalName: 'MetroHealth Grand Medical Center',
    age: 46,
    occupation: 'Chief Medical Officer & Facility Administrator',
    phone: '+1 (555) 911-0001',
    bloodGroup: 'A+',
    isProfileComplete: true,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    hospitalProfile: {
      id: 'prof-hosp-1',
      userId: 'usr-hospital-1',
      hospitalName: 'MetroHealth Grand Medical Center',
      ownerName: 'Dr. Marcus Vance',
      email: 'admin@metrohealth.org',
      phoneNumber: '+1 (555) 911-0001',
      location: 'Downtown Medical District, Metro City',
      specialty: 'Cardiology',
      latitude: 37.7749,
      longitude: -122.4194,
      createdAt: '2026-09-01T10:00:00Z',
    },
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
];

// In-memory persistent storage store for registered hospitals
let memoryHospitalProfiles: HospitalProfile[] = [
  {
    id: 'hosp-prof-1',
    userId: 'usr-hospital-1',
    hospitalName: 'MetroHealth Grand Medical Center',
    ownerName: 'Dr. Marcus Vance',
    email: 'admin@metrohealth.org',
    phoneNumber: '+1 (555) 911-0001',
    location: 'Downtown Medical District, Metro City',
    specialty: 'Cardiology',
    latitude: 37.7749,
    longitude: -122.4194,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'hosp-prof-2',
    userId: 'usr-hospital-2',
    hospitalName: 'St. Jude Community Clinic',
    ownerName: 'Dr. Arthur Pendelton',
    email: 'contact@stjudeclinic.org',
    phoneNumber: '+1 (555) 345-6789',
    location: '142 Oakridge Blvd, Eastside',
    specialty: 'General Hospital',
    latitude: 37.7680,
    longitude: -122.4080,
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'hosp-prof-3',
    userId: 'usr-hospital-3',
    hospitalName: 'Apex Heart & Orthopedic Institute',
    ownerName: 'Dr. Helena Rostova',
    email: 'info@apexorthocare.org',
    phoneNumber: '+1 (555) 456-7890',
    location: '88 Innovation Way, Biotech Park',
    specialty: 'Orthopedics',
    latitude: 37.7850,
    longitude: -122.4020,
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 'hosp-prof-4',
    userId: 'usr-hospital-4',
    hospitalName: 'Bay Area Children’s Hospital',
    ownerName: 'Dr. Chloe Bennett',
    email: 'triage@baychildrens.org',
    phoneNumber: '+1 (555) 567-8901',
    location: '512 Harbor View Road, Bay District',
    specialty: 'Pediatrics',
    latitude: 37.7950,
    longitude: -122.3950,
    createdAt: '2026-09-12T10:00:00Z',
    updatedAt: '2026-09-12T10:00:00Z',
  },
  {
    id: 'hosp-prof-5',
    userId: 'usr-hospital-5',
    hospitalName: 'Northwest 24/7 Trauma Center',
    ownerName: 'Dr. Jason Miller',
    email: 'er@northwesttrauma.org',
    phoneNumber: '+1 (555) 789-0123',
    location: '100 Emergency Way, North Heights',
    specialty: '24/7 Emergency',
    latitude: 37.7600,
    longitude: -122.4350,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
  },
];

export interface HospitalProfileCreateInput {
  hospitalName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  location: string;
  specialty: string;
  latitude?: number;
  longitude?: number;
  user?: any;
}

export const prisma = {
  user: {
    findUnique: async (args: { where: { email?: string; id?: string } }): Promise<UserRecord | null> => {
      if (args.where.email) {
        const lower = args.where.email.toLowerCase().trim();
        return memoryUsers.find((u) => u.email.toLowerCase() === lower) || null;
      }
      if (args.where.id) {
        return memoryUsers.find((u) => u.id === args.where.id) || null;
      }
      return null;
    },
    findMany: async (): Promise<UserRecord[]> => {
      return [...memoryUsers];
    },
    create: async ({ data }: { data: Partial<UserRecord> & { email: string; fullName: string; role: Role | UserRole } }): Promise<UserRecord> => {
      const lower = data.email.toLowerCase().trim();
      const existing = memoryUsers.find((u) => u.email.toLowerCase() === lower);
      if (existing) {
        Object.assign(existing, data);
        existing.updatedAt = new Date().toISOString();
        return existing;
      }
      const newUser: UserRecord = {
        id: data.id || `usr-${Date.now()}`,
        email: lower,
        fullName: data.fullName,
        password: data.password || 'password123',
        role: data.role,
        phone: data.phone,
        hospitalId: data.hospitalId,
        hospitalName: data.hospitalName,
        occupation: data.occupation,
        bloodGroup: data.bloodGroup,
        age: data.age,
        isProfileComplete: data.isProfileComplete ?? true,
        hospitalProfile: data.hospitalProfile,
        doctorProfile: data.doctorProfile,
        patientProfile: data.patientProfile,
        avatarUrl: data.avatarUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryUsers.push(newUser);
      return newUser;
    },
  },
  hospitalProfile: {
    findMany: async (args?: { orderBy?: { createdAt?: 'asc' | 'desc' } }): Promise<HospitalProfile[]> => {
      const sorted = [...memoryHospitalProfiles];
      if (args?.orderBy?.createdAt === 'desc') {
        sorted.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      }
      return sorted;
    },
    create: async ({ data }: { data: HospitalProfileCreateInput }): Promise<HospitalProfile> => {
      const coords = (data.latitude && data.longitude) 
        ? { latitude: data.latitude, longitude: data.longitude }
        : geocodeAddress(data.location);

      const newRec: HospitalProfile = {
        id: `hosp-prof-${Date.now()}`,
        userId: `usr-hosp-${Date.now()}`,
        hospitalName: data.hospitalName,
        ownerName: data.ownerName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        location: data.location,
        specialty: data.specialty,
        latitude: coords.latitude,
        longitude: coords.longitude,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryHospitalProfiles.unshift(newRec);

      // Also ensure user is registered
      const userEmail = data.email.toLowerCase().trim();
      if (!memoryUsers.some((u) => u.email.toLowerCase() === userEmail)) {
        memoryUsers.push({
          id: newRec.userId,
          email: userEmail,
          password: 'password123',
          fullName: data.ownerName,
          phone: data.phoneNumber,
          role: 'HOSPITAL',
          hospitalId: 'fac-1',
          hospitalName: data.hospitalName,
          isProfileComplete: true,
          hospitalProfile: newRec,
          createdAt: newRec.createdAt,
          updatedAt: newRec.updatedAt,
        });
      }

      return newRec;
    },
    count: async (): Promise<number> => {
      return memoryHospitalProfiles.length;
    }
  }
};

export default prisma;
