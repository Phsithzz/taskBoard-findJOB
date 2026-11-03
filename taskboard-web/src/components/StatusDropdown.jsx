import React from 'react'
import { STATUS_CONFIG } from '../constants/statusConfig'

export const StatusDropdown = ({ job, onSelectStatus, dropdownRef }) => {
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
        เปลี่ยนสถานะ
      </div>
      <div className="space-y-1 mt-1">
        {Object.values(STATUS_CONFIG).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectStatus(job, s.id)}
            className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
              (job.status || '').toLowerCase() === s.id
                ? `${s.pillClass}`
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {s.icon}
              <span>{s.label}</span>
            </div>
            {(job.status || '').toLowerCase() === s.id && (
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
