'use client';

import React, { useState } from 'react';
import { 
  Ticket, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Printer, 
  X, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Phone
} from 'lucide-react';
import { QueueToken } from '@/types';
import { useHealthcare } from '@/context/HealthcareContext';

interface TokenTicketProps {
  token: QueueToken;
  onClose?: () => void;
}

export default function TokenTicket({ token, onClose }: TokenTicketProps) {
  const { cancelQueueToken } = useHealthcare();
  const [copied, setCopied] = useState(false);
  const [savedToWallet, setSavedToWallet] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`ReadyCare Token #${token.tokenNumber} at ${token.facilityName}. Status: ${token.status}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current':
      case 'CALLED':
        return 'bg-amber-500 text-white animate-pulse';
      case 'Visited':
      case 'SERVED':
        return 'bg-emerald-600 text-white';
      case 'Cancelled':
      case 'CANCELLED':
        return 'bg-slate-400 text-white';
      default:
        return 'bg-teal-600 text-white';
    }
  };

  return (
    <div className="bg-gradient-to-b from-teal-900 to-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-teal-500/30 max-w-md w-full relative overflow-hidden mx-auto">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-teal-800/60 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white shadow-xs">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              ReadyCare <span className="text-teal-400">Digital Token</span>
            </span>
            <p className="text-[10px] text-teal-300">Live Walk-in Queue Pass</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full ${getStatusColor(token.status)}`}>
            {token.status === 'Current' ? '🔔 NOW CALLING' : token.status}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Token Large Display */}
      <div className="py-6 text-center space-y-2 relative z-10">
        <p className="text-xs font-bold text-teal-300 uppercase tracking-widest">YOUR QUEUE TOKEN NUMBER</p>
        <div className="text-5xl sm:text-6xl font-black text-white tracking-wider font-mono drop-shadow-md py-1">
          {token.tokenNumber}
        </div>
        
        {/* Priority Badge */}
        {token.priority !== 'STANDARD' && (
          <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full">
            Priority: {token.priority.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Real-time Queue Progress Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3 relative z-10">
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-200">Currently Calling:</span>
          </div>
          <span className="font-mono font-black text-amber-300 text-sm">{token.currentlyServingNumber}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
          <div className="bg-black/20 rounded-xl p-2.5">
            <p className="text-[10px] text-slate-300">Patients Ahead</p>
            <p className="text-xl font-extrabold text-white">{token.positionInQueue === 0 ? 'YOU ARE NEXT' : `${token.positionInQueue} Ahead`}</p>
          </div>

          <div className="bg-black/20 rounded-xl p-2.5">
            <p className="text-[10px] text-slate-300">Est. Wait Time</p>
            <p className="text-xl font-extrabold text-teal-300">~{token.estimatedWaitMin} mins</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 text-center italic">
          💡 Please arrive at the waiting area 5 minutes before your estimated time.
        </p>
      </div>

      {/* Facility & Patient Meta */}
      <div className="py-4 space-y-2.5 text-xs border-b border-teal-800/60 relative z-10">
        <div className="flex justify-between">
          <span className="text-slate-400">Facility:</span>
          <span className="font-bold text-white text-right max-w-[220px] truncate">{token.facilityName}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Department:</span>
          <span className="font-semibold text-teal-300">{token.departmentName}</span>
        </div>

        {token.doctorName && (
          <div className="flex justify-between">
            <span className="text-slate-400">Attending Doctor:</span>
            <span className="font-semibold text-white">{token.doctorName}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-slate-400">Patient:</span>
          <span className="font-semibold text-white">{token.patientName}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Issued At:</span>
          <span className="font-semibold text-slate-300">{token.issueTime}</span>
        </div>
      </div>

      {/* Simulated QR Code Pass */}
      <div className="pt-4 flex flex-col items-center justify-center text-center space-y-2 relative z-10">
        <div className="bg-white p-3 rounded-2xl shadow-lg inline-block">
          <div className="w-28 h-28 bg-slate-900 rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden">
            {/* Custom stylized QR code graphics representation */}
            <div className="grid grid-cols-5 gap-1 w-full h-full opacity-90">
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-300 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-teal-400 rounded-xs" />
              <div className="bg-white rounded-xs" />
              <div className="bg-white rounded-xs" />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">Scan at hospital check-in kiosk: {token.qrCodeRef}</p>
      </div>

      {/* Card Actions */}
      <div className="mt-5 pt-3 border-t border-teal-800/60 flex items-center justify-between gap-2 relative z-10">
        <button
          onClick={handleShare}
          className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Copied!' : 'Share Pass'}</span>
        </button>

        <button
          onClick={() => setSavedToWallet(true)}
          className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-500 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{savedToWallet ? 'Saved to Wallet' : 'Save to Wallet'}</span>
        </button>

        {token.status === 'Waiting' && (
          <button
            onClick={() => cancelQueueToken(token.id)}
            className="py-2 px-3 bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Cancel Token"
          >
            Cancel
          </button>
        )}
      </div>

    </div>
  );
}
