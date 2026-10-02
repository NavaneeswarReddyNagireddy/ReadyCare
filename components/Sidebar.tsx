'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HeartPulse, 
  Search, 
  CalendarDays, 
  Ticket, 
  Activity, 
  ChevronDown, 
  ChevronRight, 
  PhoneCall, 
  Video, 
  History, 
  User, 
  LogOut, 
  ShieldCheck, 
  Building2, 
  Menu, 
  X,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    activeToken, 
    openTokenDrawer, 
    openBookingModal, 
    facilities, 
    openHospitalQueueModal 
  } = useHealthcare();
  const { user, logout } = useAuth();

  // Collapsible 'Patient Services' accordion state (expanded by default or toggled)
  const [patientServicesOpen, setPatientServicesOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const nearestER = facilities.find(f => f.hasEmergencyER) || facilities[0];

  const handleNavClick = (path?: string) => {
    setMobileDrawerOpen(false);
    if (path) router.push(path);
  };

  const isLinkActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Top Bar with Hamburger for small screens */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Ready<span className="text-teal-400">Care</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {activeToken && (
            <button
              onClick={openTokenDrawer}
              className="flex items-center gap-1.5 bg-teal-950 text-teal-300 border border-teal-500/40 text-xs px-2.5 py-1 rounded-full font-bold animate-pulse"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>#{activeToken.tokenNumber}</span>
            </button>
          )}

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Sidebar"
          >
            {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Fixed Left Sidebar Navigation Bar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 text-slate-200 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl ${
        mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top Header / Branding */}
        <div className="p-5 border-b border-slate-800/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setMobileDrawerOpen(false)} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white">
                    Ready<span className="text-teal-400">Care</span>
                  </span>
                  <span className="bg-teal-950 text-teal-400 border border-teal-500/30 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                    Access+
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Smart Queue & Care Hub</p>
              </div>
            </Link>

            {/* Close button on mobile */}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Queue Token Pill in Sidebar */}
          {activeToken ? (
            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                openTokenDrawer();
              }}
              className="w-full text-left bg-gradient-to-r from-teal-950 to-slate-900 border border-teal-500/40 hover:border-teal-400 p-3 rounded-2xl shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  Your Active Token
                </span>
                <span className="font-mono font-black text-white text-xs bg-teal-600 px-2 py-0.5 rounded-md">
                  {activeToken.tokenNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 truncate">
                {activeToken.facilityName}
              </p>
              <p className="text-[10px] text-teal-400 font-semibold mt-0.5">
                {activeToken.positionInQueue === 0 ? '🔔 NOW CALLING YOU' : `• ${activeToken.positionInQueue} ahead (~${activeToken.estimatedWaitMin}m)`}
              </p>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hospital Queue Dispatch Active</span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Links */}
        <div className="p-4 overflow-y-auto flex-1 space-y-6 text-sm">
          
          {/* Main Primary Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3">
              Core Navigation
            </span>

            <Link
              href="/"
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                isLinkActive('/')
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Find Care & Hospitals</span>
            </Link>

            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                openHospitalQueueModal(facilities[0]);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Live Hospital Queue</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-bold">
                Live
              </span>
            </button>

            <Link
              href="/my-appointments"
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                isLinkActive('/my-appointments')
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Passes & Visits</span>
            </Link>
          </div>

          {/* COLLAPSIBLE MENU: 'Patient Services' (Exact Requirement) */}
          <div className="space-y-1 pt-2 border-t border-slate-900">
            
            <button
              type="button"
              onClick={() => setPatientServicesOpen(!patientServicesOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 font-bold transition-all text-left cursor-pointer select-none group"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span className="text-xs uppercase tracking-wider text-slate-200 font-extrabold">Patient Services</span>
              </div>
              <span className="text-slate-400 group-hover:text-white transition-transform duration-200">
                {patientServicesOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </span>
            </button>

            {/* Collapsible Children Links */}
            {patientServicesOpen && (
              <div className="pl-4 pr-1 py-1 space-y-1 animate-fadeIn border-l-2 border-slate-800 ml-3">
                
                {/* 1. Book Doctor Appointment */}
                <Link
                  href="/booking"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-teal-400 hover:bg-slate-900 transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>Book Doctor Appointment</span>
                </Link>

                {/* 2. Digital Queue Tokens */}
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    openBookingModal({ mode: 'TOKEN' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-900 transition-colors text-left cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Digital Queue Tokens</span>
                </button>

                {/* 3. Track Active Queue */}
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    openTokenDrawer();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-teal-400 hover:bg-slate-900 transition-colors text-left cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Track Active Queue</span>
                </button>

                {/* 4. Past Medical Visits */}
                <Link
                  href="/my-appointments"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-teal-400 hover:bg-slate-900 transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Past Medical Visits</span>
                </Link>

                {/* 5. Tele-consultation (Beta) */}
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    openBookingModal({ mode: 'APPOINTMENT' });
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-teal-400 hover:bg-slate-900 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Tele-consultation</span>
                  </div>
                  <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-500/30 font-bold px-1.5 py-0.5 rounded-sm">
                    Beta
                  </span>
                </button>

              </div>
            )}

          </div>

          {/* Quick 24/7 Emergency Hotline Widget */}
          <div className="pt-2">
            <div className="bg-gradient-to-br from-red-950/80 to-slate-900 border border-red-800/50 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-red-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  24/7 Emergency ER
                </span>
                <span className="font-bold text-slate-400 text-[10px]">{nearestER.distanceKm} km</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Nearest Level-1 Trauma: <strong className="text-white">{nearestER.name.split(' ')[0]}</strong>
              </p>
              <a
                href="tel:911"
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 911 Hotline</span>
              </a>
            </div>
          </div>

        </div>

        {/* User Profile & Sign Out Footer */}
        {user && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <Link
                href="/profile-setup"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-white truncate">
                    {user.fullName || user.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user.age ? `${user.age} yrs` : 'Patient'} {user.occupation ? `• ${user.occupation.split(' ')[0]}` : ''}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  logout();
                }}
                className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </aside>
    </>
  );
}
