import React from 'react'
import { useJobStore } from '../stores/useJobStore'

export const Sidebar = () => {
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
    <aside className="w-full lg:w-72 bg-[#1E2026] text-white rounded-[32px] p-6 flex flex-col justify-between shrink-0 shadow-xl border border-slate-800">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center pb-5 border-b border-slate-800/80">
          <div className="relative mb-3 group">
            <img
              src="/profile.jpg"
              alt="Profile"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-700/60 shadow-lg"
            />
            <div className="hidden w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white font-bold text-2xl items-center justify-center ring-4 ring-slate-700">
              P
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#1E2026]"></span>
          </div>

          <h2 className="text-lg font-extrabold text-white tracking-tight">
            Hi, Phoosith!
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Your dream job is waiting for you!
          </p>
        </div>

        <nav className="space-y-1.5">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 rounded-2xl bg-white/10 text-white font-bold text-xs transition cursor-pointer backdrop-blur-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">💼</span>
              <span>Kanban Board</span>
            </div>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
              {total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => openCreateModal('applied')}
            className="flex w-full items-center justify-between px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-xs transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">➕</span>
              <span>Add Application</span>
            </div>
          </button>
        </nav>

        <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Progress Rate</span>
            <span className="text-[11px] text-slate-400">Response</span>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={238}
                  strokeDashoffset={238 - (238 * (activeProgressRate || 10)) / 100}
                  strokeLinecap="round"
                  className="text-emerald-400 transition-all duration-500"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-white">{activeProgressRate}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/5 text-[10px] text-center">
            <div>
              <span className="block font-bold text-sky-400">{appliedCount}</span>
              <span className="text-slate-400 text-[9px]">Applied</span>
            </div>
            <div>
              <span className="block font-bold text-blue-400">{interviewCount}</span>
              <span className="text-slate-400 text-[9px]">Interview</span>
            </div>
            <div>
              <span className="block font-bold text-emerald-400">{acceptedCount}</span>
              <span className="text-slate-400 text-[9px]">Offers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => openCreateModal('applied')}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 px-4 py-3 text-xs font-bold text-slate-900 shadow-lg shadow-emerald-500/20 active:scale-98 transition cursor-pointer"
        >
          <span>+ New Job Application</span>
        </button>
      </div>
    </aside>
  )
}
