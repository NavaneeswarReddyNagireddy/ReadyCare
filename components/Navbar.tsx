'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  PhoneCall, 
  Ticket, 
  CalendarDays, 
  Search, 
  Menu, 
  X, 
  Clock, 
  Activity,
  MapPin,
  ShieldCheck,
  User,
  LogOut,
  Briefcase,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { activeToken, openTokenDrawer, openBookingModal } = useHealthcare();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Emergency Triage Ribbon */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Emergency Rapid Response: For life-threatening emergencies call <strong>911</strong> immediately</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 opacity-90">
              <ShieldCheck className="w-3.5 h-3.5" /> In-Network Verified Care
            </span>
            <a 
              href="tel:+15559110001" 
              className="bg-white/20 hover:bg-white/30 transition-colors px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
            >
              <PhoneCall className="w-3 h-3" />
              <span>ER Hotline: (555) 911-CARE</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                    Ready<span className="text-teal-600">Care</span>
                  </span>
                  <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-teal-200 uppercase tracking-wider">
                    Access+
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none hidden sm:block">Smart Healthcare & Queue Dispatch</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600">
              <Link 
                href="/" 
                className="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50/60 transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Find Care</span>
              </Link>
              <Link 
                href="/booking" 
                className="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50/60 transition-colors flex items-center gap-1.5"
              >
                <CalendarDays className="w-4 h-4 text-slate-400" />
                <span>Book Appointment</span>
              </Link>
              <button
                onClick={() => openBookingModal({ mode: 'TOKEN' })}
                className="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-amber-500" />
                <span>Get Fast Token</span>
              </button>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Active Queue Token Pill if present */}
            {activeToken && (
              <button
                onClick={openTokenDrawer}
                className="relative flex items-center gap-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 hover:border-teal-400 text-teal-800 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer animate-pulse"
                title="View your active queue status"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                <Ticket className="w-4 h-4 text-teal-600" />
                <span>Token <strong>{activeToken.tokenNumber}</strong></span>
                <span className="hidden lg:inline text-teal-600 font-normal">
                  • {activeToken.positionInQueue === 0 ? 'CALLED NOW' : `${activeToken.positionInQueue} in front (~${activeToken.estimatedWaitMin}m)`}
                </span>
              </button>
            )}

            {/* My Tokens & Appointments Trigger */}
            <button
              onClick={openTokenDrawer}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-teal-600 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">My Visits</span>
            </button>

            {/* User Profile Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs text-slate-800 font-bold transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-bold text-xs text-slate-900 leading-tight truncate max-w-[110px]">
                      {user.fullName || user.email.split('@')[0]}
                    </p>
                    {user.age && user.occupation && (
                      <p className="text-[10px] text-slate-500 leading-none">
                        {user.age} yrs • {user.occupation.split(' ')[0]}
                      </p>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1 animate-fadeIn"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{user.fullName}</span>
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded-md">Verified</span>
                      </div>
                      <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                      {user.age && (
                        <p className="text-slate-600 text-[11px] font-medium pt-1">
                          Age: <strong>{user.age}</strong> • Occupation: <strong>{user.occupation}</strong>
                        </p>
                      )}
                    </div>

                    <Link
                      href="/profile-setup"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold"
                    >
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      <span>Edit Patient Profile</span>
                    </Link>

                    <Link
                      href="/my-appointments"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold"
                    >
                      <Ticket className="w-4 h-4 text-amber-500" />
                      <span>My Visits & Tokens</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {user && (
            <div className="p-3 bg-slate-50 rounded-xl space-y-1 mb-2 border border-slate-200">
              <p className="font-bold text-slate-900">{user.fullName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              {user.age && user.occupation && (
                <p className="text-xs text-teal-700 font-medium">
                  {user.age} yrs old • {user.occupation}
                </p>
              )}
            </div>
          )}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Search className="w-5 h-5 text-teal-600" />
            <span>Find Hospitals & Clinics</span>
          </Link>
          <Link
            href="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <CalendarDays className="w-5 h-5 text-teal-600" />
            <span>Book Scheduled Appointment</span>
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openBookingModal({ mode: 'TOKEN' });
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-left text-sm"
          >
            <Activity className="w-5 h-5 text-amber-500" />
            <span>Get Walk-in Digital Token</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openTokenDrawer();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-teal-700 bg-teal-50 font-semibold text-left text-sm"
          >
            <Ticket className="w-5 h-5 text-teal-600" />
            <span>My Bookings & Live Queue</span>
          </button>
          
          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-left text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-xs text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency ER (911)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
