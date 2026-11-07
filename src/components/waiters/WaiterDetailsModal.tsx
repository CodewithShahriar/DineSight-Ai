import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  Star,
  CheckCircle2,
  HeartPulse,
  Globe,
  FileCheck,
  TrendingUp,
  LayoutGrid,
  Quote,
  Printer,
  Sparkles,
  DollarSign,
  AlertCircle,
  Briefcase,
  IdCard,
} from 'lucide-react'
import { Waiter, WaiterStatus } from '../../types'

interface WaiterDetailsModalProps {
  waiter: Waiter | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus?: (waiterId: string, status: WaiterStatus) => void
  onOpenReassign?: (waiter: Waiter) => void
}

export const WaiterDetailsModal: React.FC<WaiterDetailsModalProps> = ({
  waiter,
  isOpen,
  onClose,
  onUpdateStatus,
  onOpenReassign,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'duty' | 'skills'>('profile')

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !waiter) return null

  const details = waiter.details
  const isAvailable = waiter.status === 'active'

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-charcoal-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-warm-200 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & Staff Hero Card */}
        <div className="relative shrink-0 bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 text-white p-5 sm:p-6 border-b border-charcoal-800">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors cursor-pointer"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar with Status Ring */}
            <div className="relative shrink-0">
              <img
                src={waiter.avatar}
                alt={waiter.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-forest-500/60 shadow-lg"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-charcoal-900 ${
                  waiter.status === 'active'
                    ? 'bg-emerald-500 animate-pulse'
                    : waiter.status === 'busy'
                    ? 'bg-amber-500'
                    : waiter.status === 'on_break'
                    ? 'bg-sky-500'
                    : 'bg-charcoal-500'
                }`}
                title={`Status: ${waiter.status}`}
              />
            </div>

            {/* Staff Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold font-display text-white tracking-tight">
                  {waiter.name}
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-forest-900/90 text-forest-200 border border-forest-700/50">
                  {waiter.employeeId}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Tenure: {details?.tenure || '2+ Years'}
                </span>
              </div>

              <p className="text-xs text-charcoal-300 font-medium mt-1">
                {waiter.role} • <span className="text-forest-400">{waiter.zone}</span>
              </p>

              {/* Status Select & Joined Date */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-charcoal-400">
                <span className="flex items-center text-charcoal-300">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-forest-400" />
                  Joined: <strong className="ml-1 text-white">{details?.joinedDate || '2023'}</strong>
                </span>

                <div className="flex items-center space-x-1.5 ml-auto sm:ml-0">
                  <span className="text-[11px] text-charcoal-400">Status:</span>
                  <select
                    value={waiter.status}
                    onChange={(e) =>
                      onUpdateStatus?.(waiter.id, e.target.value as WaiterStatus)
                    }
                    className="text-xs font-mono font-bold px-2 py-1 rounded bg-charcoal-800 text-white border border-charcoal-700 focus:outline-none cursor-pointer"
                  >
                    <option value="active">● AVAILABLE (ON FLOOR)</option>
                    <option value="busy">● BUSY WITH PARTY</option>
                    <option value="on_break">● ON BREAK</option>
                    <option value="off_duty">● OFF DUTY</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stat Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-charcoal-800/80 text-center">
            <div className="bg-charcoal-800/60 p-2 rounded-xl border border-charcoal-700/50">
              <span className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider block">
                Lifetime Tables
              </span>
              <span className="font-mono text-base font-bold text-white">
                {details?.lifetimeTablesServed ? details.lifetimeTablesServed.toLocaleString() : '2,000+'}
              </span>
              <span className="text-[10px] text-forest-400 block font-semibold mt-0.5">
                {waiter.tablesServedToday} served today
              </span>
            </div>

            <div className="bg-charcoal-800/60 p-2 rounded-xl border border-charcoal-700/50">
              <span className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider block">
                Today's Tips
              </span>
              <span className="font-mono text-base font-bold text-emerald-400">
                ${details?.tipsEarnedToday ? details.tipsEarnedToday.toFixed(2) : '120.00'}
              </span>
              <span className="text-[10px] text-charcoal-400 block font-semibold mt-0.5">
                Staff Gratuity
              </span>
            </div>

            <div className="bg-charcoal-800/60 p-2 rounded-xl border border-charcoal-700/50">
              <span className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider block">
                Guest Rating
              </span>
              <div className="flex items-center justify-center font-mono text-base font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                {waiter.rating}
              </div>
              <span className="text-[10px] text-amber-300/80 block font-semibold mt-0.5">
                {details?.satisfactionRate || 99}% Positive
              </span>
            </div>

            <div className="bg-charcoal-800/60 p-2 rounded-xl border border-charcoal-700/50">
              <span className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider block">
                Response SLA
              </span>
              <span className="font-mono text-base font-bold text-forest-300">
                {waiter.avgResponseTimeSec}s
              </span>
              <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">
                {waiter.complianceRate}% Compliance
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="shrink-0 flex items-center border-b border-warm-200 bg-warm-50/80 px-5 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-forest-700 text-forest-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-forest-700" />
            <span>Personal & Emergency Info</span>
          </button>

          <button
            onClick={() => setActiveTab('duty')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'duty'
                ? 'border-forest-700 text-forest-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-forest-700" />
            <span>Shift, Section & Tables</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'skills'
                ? 'border-forest-700 text-forest-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-forest-700" />
            <span>Skills, Certifications & Notes</span>
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-warm-50/40">
          {/* TAB 1: PERSONAL & EMERGENCY INFO */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Contact Information */}
              <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
                  Direct Contact & Residence
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-charcoal-400 font-semibold block">Official Email</span>
                    <a
                      href={`mailto:${details?.email || 'staff@thegrandbistro.com'}`}
                      className="text-forest-700 font-semibold hover:underline flex items-center mt-0.5"
                    >
                      <Mail className="w-3.5 h-3.5 mr-1 text-charcoal-400" />
                      {details?.email || `${waiter.name.toLowerCase().replace(' ', '.')}@thegrandbistro.com`}
                    </a>
                  </div>

                  <div>
                    <span className="text-[11px] text-charcoal-400 font-semibold block">Primary Phone</span>
                    <a
                      href={`tel:${waiter.phone}`}
                      className="text-charcoal-800 font-semibold hover:underline flex items-center mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 mr-1 text-charcoal-400" />
                      {waiter.phone}
                    </a>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-charcoal-400 font-semibold block">Residential Address</span>
                    <p className="text-charcoal-700 font-medium flex items-center mt-0.5">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500 shrink-0" />
                      {details?.address || 'London, United Kingdom'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact & Medical */}
              <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center">
                    <HeartPulse className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                    Emergency Contact & Medical Details
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Blood Group: {details?.bloodGroup || 'O+'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                  <div>
                    <span className="text-[11px] text-charcoal-500 font-semibold block">Contact Person</span>
                    <p className="font-bold text-charcoal-900 mt-0.5">
                      {details?.emergencyContact.name || 'Next of Kin'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-charcoal-500 font-semibold block">Relationship</span>
                    <p className="font-medium text-charcoal-800 mt-0.5">
                      {details?.emergencyContact.relation || 'Family Member'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-charcoal-500 font-semibold block">Emergency Hotline</span>
                    <a
                      href={`tel:${details?.emergencyContact.phone}`}
                      className="font-mono font-bold text-rose-700 hover:underline mt-0.5 block"
                    >
                      {details?.emergencyContact.phone || waiter.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Employment Verification & Legal Dossier */}
              <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center">
                  <IdCard className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
                  HR & Employment Dossier
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-charcoal-400 font-semibold block">Date of Birth</span>
                    <p className="font-semibold text-charcoal-800 mt-0.5">
                      {details?.dateOfBirth || 'June 14, 1994 (30 yrs)'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-charcoal-400 font-semibold block">Work Permit</span>
                    <span className="inline-flex items-center text-emerald-800 font-semibold mt-0.5">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      {details?.workPermitStatus.split('•')[0] || 'Verified'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-charcoal-400 font-semibold block">Contract Type</span>
                    <p className="font-semibold text-charcoal-800 mt-0.5">
                      {details?.contractType || 'Full-Time (40h)'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-charcoal-400 font-semibold block">Tax / NI Number</span>
                    <p className="font-mono text-charcoal-700 font-semibold mt-0.5">
                      {details?.taxId || 'GB-NI-892401'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHIFT, SECTION & TABLES */}
          {activeTab === 'duty' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Shift Schedule */}
              <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
                  Rostered Shift Window & Sector
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-warm-50 p-3 rounded-lg border border-warm-150">
                    <span className="text-[11px] text-charcoal-400 font-bold uppercase">Today's Shift Hours</span>
                    <p className="text-sm font-bold text-charcoal-900 font-mono mt-1">{waiter.shift}</p>
                    <span className="text-[11px] text-forest-700 font-medium block mt-1">
                      Scheduled Break: 3:15 PM – 3:45 PM
                    </span>
                  </div>

                  <div className="bg-warm-50 p-3 rounded-lg border border-warm-150">
                    <span className="text-[11px] text-charcoal-400 font-bold uppercase">Primary Dining Zone</span>
                    <p className="text-sm font-bold text-charcoal-900 mt-1">{waiter.zone}</p>
                    <span className="text-[11px] text-charcoal-500 font-medium block mt-1">
                      Coverage: {waiter.assignedTables.length} Active Tables Allocated
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Assigned Tables */}
              <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center">
                    <LayoutGrid className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
                    Currently Assigned Tables
                  </h4>
                  <button
                    onClick={() => onOpenReassign?.(waiter)}
                    className="text-xs font-bold text-forest-800 hover:text-forest-950 underline cursor-pointer"
                  >
                    Modify Table Assignments →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {waiter.assignedTableIds && waiter.assignedTableIds.length > 0 ? (
                    waiter.assignedTableIds.map((tblId) => (
                      <div
                        key={tblId}
                        className="p-3 rounded-xl border border-forest-300 bg-forest-50/70 text-center"
                      >
                        <span className="font-mono text-sm font-bold text-forest-950 block">
                          Table {tblId}
                        </span>
                        <span className="text-[10px] font-semibold text-forest-700 inline-flex items-center mt-1">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-forest-600" /> In Service
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-4 text-center text-xs text-charcoal-400 italic bg-warm-50 rounded-xl">
                      No tables currently assigned (Standby for auto-dispatch)
                    </div>
                  )}
                </div>
              </div>

              {/* SLA & Service Speed Breakdown */}
              <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
                  Speed of Service & Floor SLAs
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                  <div className="p-2 rounded-lg bg-warm-50">
                    <span className="text-[10px] text-charcoal-400 font-bold block">Avg Table Greet</span>
                    <span className="font-mono font-bold text-charcoal-900 text-sm mt-0.5 block">
                      {waiter.avgResponseTimeSec} sec
                    </span>
                    <span className="text-[10px] text-emerald-700">Under 90s SLA</span>
                  </div>

                  <div className="p-2 rounded-lg bg-warm-50">
                    <span className="text-[10px] text-charcoal-400 font-bold block">Order Input Time</span>
                    <span className="font-mono font-bold text-charcoal-900 text-sm mt-0.5 block">
                      1.8 mins
                    </span>
                    <span className="text-[10px] text-emerald-700">Top 10% Floor</span>
                  </div>

                  <div className="p-2 rounded-lg bg-warm-50">
                    <span className="text-[10px] text-charcoal-400 font-bold block">Table Turnover</span>
                    <span className="font-mono font-bold text-charcoal-900 text-sm mt-0.5 block">
                      44 mins
                    </span>
                    <span className="text-[10px] text-forest-700">Optimal Pace</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS, CERTIFICATIONS & NOTES */}
          {activeTab === 'skills' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Spoken Languages */}
              <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center">
                  <Globe className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
                  Languages Spoken & Guest Welcome
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {details?.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-forest-50 text-forest-900 border border-forest-200 flex items-center"
                    >
                      <Globe className="w-3 h-3 mr-1 text-forest-600" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center">
                  <FileCheck className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
                  Professional Certifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {details?.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-warm-200 bg-warm-50/60 flex items-center space-x-2 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-charcoal-800">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges & Commendations */}
              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  Badges & Floor Honors
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {details?.badges?.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1.5 text-amber-500" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Management Supervisor Note */}
              {details?.supervisorNotes && (
                <div className="bg-white p-4 rounded-xl border border-warm-200 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center">
                    <Quote className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
                    Manager Appraisal & Confidential Note
                  </h4>
                  <div className="p-3 rounded-lg bg-warm-50 border-l-4 border-forest-600 text-xs italic text-charcoal-700 leading-relaxed">
                    "{details.supervisorNotes}"
                  </div>
                  <span className="text-[10px] text-charcoal-400 block text-right font-medium">
                    Appraised by General Manager • DineSight Ops Review
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 p-4 border-t border-warm-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl border border-warm-300 hover:bg-warm-100 text-charcoal-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Printer className="w-3.5 h-3.5 text-charcoal-600" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={() => {
                onClose()
                onOpenReassign?.(waiter)
              }}
              className="px-3.5 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-forest-700" />
              <span>Reassign Tables</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer w-full sm:w-auto"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
