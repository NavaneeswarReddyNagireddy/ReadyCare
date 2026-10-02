'use client';

import React from 'react';
import { Bell, X, CheckCircle2, ArrowRight, Activity, Sparkles, MapPin } from 'lucide-react';
import { useHealthcare } from '@/context/HealthcareContext';

export default function QueueAlertBanner() {
  const { activeTurnAlert, dismissTurnAlert, openTokenDrawer } = useHealthcare();

  if (!activeTurnAlert) return null;

  const isYourTurn = activeTurnAlert.type === 'YOUR_TURN';
  const isFinished = activeTurnAlert.type === 'VISIT_FINISHED';

  return (
    <aside
      aria-label="Queue alert"
      className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-2xl shadow-2xl p-4 sm:p-5 border animate-bounce-short transition-all ${
      isYourTurn
        ? 'bg-gradient-to-r from-teal-900 via-emerald-900 to-teal-950 text-white border-teal-400/60 shadow-teal-500/25 ring-2 ring-teal-400/40'
        : isFinished
        ? 'bg-gradient-to-r from-blue-900 to-slate-900 text-white border-blue-400/50 shadow-blue-500/20'
        : 'bg-gradient-to-r from-amber-900 to-slate-900 text-white border-amber-400/50 shadow-amber-500/20'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
          isYourTurn 
            ? 'bg-emerald-500 text-slate-950 animate-pulse' 
            : isFinished 
            ? 'bg-blue-500 text-white' 
            : 'bg-amber-500 text-slate-950'
        }`}>
          {isYourTurn ? <Bell className="w-5 h-5 animate-spin" /> : isFinished ? <CheckCircle2 className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <span>{activeTurnAlert.title}</span>
            </h3>
            <button
              onClick={dismissTurnAlert}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {activeTurnAlert.message}
          </p>

          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-[11px] text-teal-300 font-bold truncate">
              {activeTurnAlert.facilityName}
            </span>

            {isYourTurn && (
              <button
                onClick={() => {
                  dismissTurnAlert();
                  openTokenDrawer();
                }}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <span>View Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
