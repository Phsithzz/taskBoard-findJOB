import React from 'react'
import { motion } from 'framer-motion'
import { useJobStore } from '../stores/useJobStore'

export const TopBar = () => {
  const jobs = useJobStore((state) => state.jobs)
  const openCreateModal = useJobStore((state) => state.openCreateModal)

  const total = jobs.length
  const appliedCount = jobs.filter((j) => (j.status || '').toLowerCase() === 'applied').length
  const interviewCount = jobs.filter((j) => (j.status || '').toLowerCase() === 'interviewing').length
  const acceptedCount = jobs.filter((j) => (j.status || '').toLowerCase() === 'accepted').length
  const bookmarkedCount = jobs.filter((j) => (j.status || '').toLowerCase() === 'bookmarked').length

  const activeProgressRate = total > 0 
    ? Math.round(((interviewCount + acceptedCount) / total) * 100) 
    : 0

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-[#1E2026] text-white rounded-[28px] px-5 sm:px-7 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl border border-slate-800"
    >
      <div className="flex items-center gap-3.5">
        <div className="relative group shrink-0">
          <img
            src="/profile.jpg"
            alt="Profile"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/50 shadow-md"
          />
          <div className="hidden w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white font-bold text-sm items-center justify-center ring-2 ring-emerald-500">
            P
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#1E2026]"></span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white tracking-tight">
              Hi, Phoosith!
            </h1>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
              JobHunt 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Your dream job is waiting for you!
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-5 bg-white/5 rounded-2xl px-5 py-2 border border-white/5">
        <div className="flex items-center gap-2.5 pr-4 border-r border-white/10">
          <div className="relative flex items-center justify-center">
            <svg className="w-9 h-9 transform -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="14"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-slate-700"
                fill="transparent"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={88}
                strokeDashoffset={88 - (88 * (activeProgressRate || 10)) / 100}
                strokeLinecap="round"
                className="text-emerald-400 transition-all duration-500"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[10px] font-black text-white">
              {activeProgressRate}%
            </span>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block font-medium">Response Rate</span>
            <span className="text-xs font-bold text-emerald-400">Progress</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-slate-400 text-[11px]">Bookmarked:</span>
            <strong className="text-white font-bold">{bookmarkedCount}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-slate-400 text-[11px]">Applied:</span>
            <strong className="text-white font-bold">{appliedCount}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-slate-400 text-[11px]">Interview:</span>
            <strong className="text-white font-bold">{interviewCount}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400 text-[11px]">Offers:</span>
            <strong className="text-emerald-400 font-black">{acceptedCount}</strong>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => openCreateModal('applied')}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 px-5 py-2.5 text-xs font-extrabold text-slate-900 shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
        >
          <span className="text-sm font-black">+</span>
          <span>New Application</span>
        </button>
      </div>
    </motion.header>
  )
}
