import React from 'react'
import { useJobStore } from '../stores/useJobStore'

export const Navbar = () => {
  const jobs = useJobStore((state) => state.jobs)
  const openCreateModal = useJobStore((state) => state.openCreateModal)

  const stats = {
    total: jobs.length,
    interviewing: jobs.filter((t) => (t.status || '').toLowerCase() === 'interviewing').length,
    accepted: jobs.filter((t) => (t.status || '').toLowerCase() === 'accepted').length,
  }

  return (
    <nav className="border-b border-slate-200/80 bg-white sticky top-0 z-30 shadow-2xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-sm font-black text-base tracking-wider">
              JH
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">JobHunt Tracker</span>
              <span className="hidden sm:inline-block ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                2026
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500 border-l border-slate-200 pl-4">
            <span>
              ยื่นแล้ว: <strong className="text-slate-800 font-semibold">{stats.total}</strong>
            </span>
            <span>•</span>
            <span>
              นัดสัมภาษณ์: <strong className="text-blue-600 font-semibold">{stats.interviewing}</strong>
            </span>
            <span>•</span>
            <span>
              Offers: <strong className="text-emerald-600 font-semibold">{stats.accepted}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => openCreateModal('applied')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ New Job Application</span>
          </button>

          <div className="relative group cursor-pointer" title="Phoosith Profile">
            <img
              src="/profile.jpg"
              alt="Profile"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-xs"
            />
            <div className="hidden h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-xs items-center justify-center ring-2 ring-indigo-300">
              P
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
