'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { HealthcareProvider, useHealthcare } from '@/context/HealthcareContext';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from './AuthGuard';
import Navbar from './Navbar';
import Footer from './Footer';
import BookingModal from './BookingModal';
import FacilityDetailsModal from './FacilityDetailsModal';
import MyTokensDrawer from './MyTokensDrawer';

function ShellModals() {
  const { selectedFacility, closeFacilityDetails } = useHealthcare();

  return (
    <>
      <BookingModal />
      <FacilityDetailsModal facility={selectedFacility} onClose={closeFacilityDetails} />
      <MyTokensDrawer />
    </>
  );
}

function MainAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOrOnboarding = pathname === '/signup' || pathname === '/login' || pathname === '/profile-setup';

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
        {!isAuthOrOnboarding && <Navbar />}
        <main className="flex-1">
          {children}
        </main>
        {!isAuthOrOnboarding && <Footer />}
        {!isAuthOrOnboarding && <ShellModals />}
      </div>
    </AuthGuard>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HealthcareProvider>
        <MainAppLayout>
          {children}
        </MainAppLayout>
      </HealthcareProvider>
    </AuthProvider>
  );
}
