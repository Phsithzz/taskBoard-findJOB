import React from 'react'
import { STATUS_CONFIG } from '../constants/statusConfig'

export const StatusDropdown = ({ job, onSelectStatus, dropdownRef }) => {
  return (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-2 z-50 w-64 rounded-[28px] border border-slate-100 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-3 px-2 tracking-tight">
        Status
      </h3>

      <div className="space-y-2.5">
        {Object.values(STATUS_CONFIG).map((s) => {
          const isSelected = (job.status || '').toLowerCase() === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectStatus(job, s.id)}
              className={`flex w-full items-center justify-between px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-150 cursor-pointer shadow-xs ${
                s.pillClass
              } ${isSelected ? 'ring-2 ring-slate-800 ring-offset-1 scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="shrink-0">{s.icon}</span>
                <span className="tracking-tight">{s.label}</span>
              </div>

              <svg className="w-3.5 h-3.5 opacity-70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )
        })}
      </div>
    </div>
  )
}
