import React from 'react';
import Link from 'next/link';
import { HeartPulse, Shield, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Ready<span className="text-teal-400">Care</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Real-time healthcare discovery and intelligent patient dispatch platform. Connect with verified hospitals, book top medical specialists, and avoid waiting rooms with live digital queue tokens.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 bg-slate-800 text-teal-400 text-xs px-2.5 py-1 rounded-full border border-teal-500/20">
                <Shield className="w-3.5 h-3.5" /> HIPAA Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-800 text-teal-400 text-xs px-2.5 py-1 rounded-full border border-teal-500/20">
                <Award className="w-3.5 h-3.5" /> NABH & JCI Accredited
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Find Care</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/?type=HOSPITAL" className="hover:text-teal-400 transition-colors">Hospitals & Trauma Centers</Link></li>
              <li><Link href="/?type=URGENT_CARE" className="hover:text-teal-400 transition-colors">Urgent Care Walk-in</Link></li>
              <li><Link href="/?type=SPECIALTY_CENTER" className="hover:text-teal-400 transition-colors">Cardiology & Specialized</Link></li>
              <li><Link href="/?type=DIAGNOSTIC_CENTER" className="hover:text-teal-400 transition-colors">Pathology & Diagnostics</Link></li>
              <li><Link href="/?specialty=Pediatrics" className="hover:text-teal-400 transition-colors">Pediatric Care</Link></li>
            </ul>
          </div>

          {/* Patient Services */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Patient Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/booking" className="hover:text-teal-400 transition-colors">Book Doctor Appointment</Link></li>
              <li><Link href="/booking?mode=token" className="hover:text-teal-400 transition-colors">Digital Queue Tokens</Link></li>
              <li><Link href="/my-appointments" className="hover:text-teal-400 transition-colors">Track Active Queue</Link></li>
              <li><Link href="/my-appointments" className="hover:text-teal-400 transition-colors">Past Medical Visits</Link></li>
              <li><span className="text-slate-500">Tele-consultation (Beta)</span></li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">24/7 Emergency</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-3">
                <p className="text-xs text-red-300 font-semibold mb-1">National Emergency Hotline</p>
                <p className="text-xl font-black text-red-400 tracking-wide">911</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>ReadyCare Line: (555) 911-CARE</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@readycare.health</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ReadyCare Health Access Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Medical Disclaimer</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
