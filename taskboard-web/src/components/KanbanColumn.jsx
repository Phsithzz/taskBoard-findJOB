import React from 'react'
import { STATUS_CONFIG } from '../constants/statusConfig'
import { JobCard } from './JobCard'
import { useJobStore } from '../stores/useJobStore'

export const KanbanColumn = ({
  statusKey,
  jobs,
  onDragStart,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver,
}) => {
  const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.applied
  const openCreateModal = useJobStore((state) => state.openCreateModal)

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex flex-col min-w-[260px] flex-1 shrink-0 rounded-[28px] border transition-all duration-150 ${
        statusInfo.columnBorder
      } border-t-4 ${
        isDragOver
          ? 'bg-emerald-50/70 border-dashed border-emerald-400 ring-2 ring-emerald-300'
          : 'bg-slate-50/70 border-slate-200/80'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${statusInfo.pillClass} shadow-xs`}>
            {statusInfo.icon}
          </span>
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>{statusInfo.label}</span>
              <span className="text-[11px] font-semibold text-slate-400">
                ({statusInfo.thaiLabel})
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-black border ${statusInfo.badgeClass}`}>
            {jobs.length}
          </span>

          <button
            type="button"
            title={`เพิ่มงานในสถานะ ${statusInfo.label}`}
            onClick={() => openCreateModal(statusKey)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-white transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-h-[calc(100vh-270px)] min-h-[220px]">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 rounded-2xl border border-dashed border-slate-300/80 text-center p-4 text-xs text-slate-400">
            <span>ยังไม่มีรายการในสถานะนี้</span>
            <button
              type="button"
              onClick={() => openCreateModal(statusKey)}
              className="mt-2 text-emerald-600 font-bold hover:underline cursor-pointer"
            >
              + เพิ่มงานใหม่
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onDragStart={onDragStart} />
          ))
        )}
      </div>
    </div>
  )
}
