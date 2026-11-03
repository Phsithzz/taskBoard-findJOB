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
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-black text-white border-[2.5px] border-black shadow-[6px_6px_0px_#000000] rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5">
        <div className="relative group shrink-0">
          <img
            src="/photo_v2.jpg"
            alt="Profile"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
            className="w-12 h-12 rounded-xl object-cover border-2 border-[#C6FF33] shadow-[2px_2px_0px_#C6FF33]"
          />
          <div className="hidden w-12 h-12 rounded-xl bg-[#7D39EB] text-[#C6FF33] font-black text-lg items-center justify-center border-2 border-[#C6FF33]">
            P
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#C6FF33] border-2 border-black"></span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-wider uppercase text-white font-mono">
              JOBHUNT // PHOOSITH
            </h1>
            <span className="rounded-md bg-[#C6FF33] text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
              ONLINE
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono hidden sm:block">
            BUILT FOR DEVELOPERS. TRACKING CAREER SUCCESS.
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
        <div className="flex items-center gap-2.5 pr-4 border-r border-white/20">
          <div className="relative flex items-center justify-center">
            <svg className="w-9 h-9 transform -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="14"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-slate-800"
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
                strokeLinecap="square"
                className="text-[#C6FF33] transition-all duration-500"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[10px] font-black text-[#C6FF33] font-mono">
              {activeProgressRate}%
            </span>
          </div>
          <div className="text-left font-mono">
            <span className="text-[9px] text-slate-300 uppercase tracking-wider block font-bold">Offer Rate</span>
            <span className="text-xs font-black text-[#C6FF33]">SUCCESS</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#FFF080]"></span>
            <span className="text-slate-300 text-[10px] uppercase font-bold">Saved:</span>
            <strong className="text-white font-black">{bookmarkedCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="text-slate-300 text-[10px] uppercase font-bold">Applied:</span>
            <strong className="text-white font-black">{appliedCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#D7BAFF]"></span>
            <span className="text-slate-300 text-[10px] uppercase font-bold">Interview:</span>
            <strong className="text-[#D7BAFF] font-black">{interviewCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-[#C6FF33]/40">
            <span className="w-2 h-2 rounded-full bg-[#C6FF33]"></span>
            <span className="text-slate-300 text-[10px] uppercase font-bold">Offers:</span>
            <strong className="text-[#C6FF33] font-black">{acceptedCount}</strong>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => openCreateModal('applied')}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C6FF33] text-black font-black text-xs uppercase px-5 py-2.5 border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#bbf426] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <span className="text-sm font-black">+</span>
          <span>Add Application</span>
          <span className="font-mono">→</span>
        </button>
      </div>
    </motion.header>
  )
}
