'use client';

import React from 'react';
import { Search, SlidersHorizontal, MapPin, Clock, ShieldAlert, Sparkles, X } from 'lucide-react';
import { SearchFilters } from '@/types';

interface SearchFilterBarProps {
  filters: SearchFilters;
  onFilterChange: (newFilters: SearchFilters) => void;
  resultCount: number;
}

const SPECIALTY_OPTIONS = [
  'All Specialties',
  'Cardiology',
  'Pediatrics',
  'Orthopedics',
  'Urgent Care',
  'Emergency Medicine',
  'Neurology',
  'Dermatology',
  'Pathology',
];

const FACILITY_TYPES = [
  { label: 'All Facilities', value: 'ALL' },
  { label: 'Hospitals', value: 'HOSPITAL' },
  { label: 'Urgent Care', value: 'URGENT_CARE' },
  { label: 'Clinics', value: 'CLINIC' },
  { label: 'Specialty Centers', value: 'SPECIALTY_CENTER' },
  { label: 'Diagnostics & Labs', value: 'DIAGNOSTIC_CENTER' },
];

export default function SearchFilterBar({ filters, onFilterChange, resultCount }: SearchFilterBarProps) {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handleSpecialtySelect = (spec: string) => {
    onFilterChange({ ...filters, specialty: spec === 'All Specialties' ? '' : spec });
  };

  const handleTypeSelect = (typeValue: string) => {
    onFilterChange({ ...filters, facilityType: typeValue === 'ALL' ? '' : typeValue });
  };

  const handleDistanceChange = (dist: number) => {
    onFilterChange({ ...filters, maxDistanceKm: dist });
  };

  const clearFilters = () => {
    onFilterChange({
      query: '',
      specialty: '',
      facilityType: '',
      maxDistanceKm: 15,
      onlyOpenNow: false,
      onlyEmergencyER: false,
      sortBy: 'distance',
    });
  };

  const hasActiveFilters = Boolean(
    filters.query || 
    filters.specialty || 
    filters.facilityType || 
    filters.onlyOpenNow || 
    filters.onlyEmergencyER || 
    filters.maxDistanceKm < 15
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-5">
      
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={filters.query}
            onChange={handleQueryChange}
            placeholder="Search hospitals, clinics, doctors, or medical specialties..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
          {filters.query && (
            <button
              onClick={() => onFilterChange({ ...filters, query: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Distance Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Radius:</span>
          <select
            value={filters.maxDistanceKm}
            onChange={(e) => handleDistanceChange(Number(e.target.value))}
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value={2}>Within 2 km</option>
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={15}>All Distances</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="distance">Nearest First</option>
            <option value="wait_time">Shortest Wait Time</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Facility Type Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
        {FACILITY_TYPES.map(type => {
          const isSelected = (filters.facilityType === '' && type.value === 'ALL') || filters.facilityType === type.value;
          return (
            <button
              key={type.value}
              onClick={() => handleTypeSelect(type.value)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Specialty Filter Chips & Quick Toggles */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-1 border-t border-slate-100">
        
        {/* Specialty Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Specialties:</span>
          {SPECIALTY_OPTIONS.map(spec => {
            const isSelected = (filters.specialty === '' && spec === 'All Specialties') || filters.specialty === spec;
            return (
              <button
                key={spec}
                onClick={() => handleSpecialtySelect(spec)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white font-semibold shadow-xs'
                    : 'bg-teal-50/60 text-teal-800 hover:bg-teal-100/70'
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60 transition-colors">
            <input
              type="checkbox"
              checked={filters.onlyOpenNow}
              onChange={(e) => onFilterChange({ ...filters, onlyOpenNow: e.target.checked })}
              className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
            />
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open Now</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60 transition-colors">
            <input
              type="checkbox"
              checked={filters.onlyEmergencyER}
              onChange={(e) => onFilterChange({ ...filters, onlyEmergencyER: e.target.checked })}
              className="rounded-sm border-slate-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
            />
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>24/7 ER Only</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Showing <strong className="text-slate-800">{resultCount}</strong> healthcare facilities matching criteria
        </span>
        <span className="flex items-center gap-1 text-teal-600 font-medium">
          <Sparkles className="w-3.5 h-3.5" /> Live distance & wait times updated
        </span>
      </div>

    </div>
  );
}
