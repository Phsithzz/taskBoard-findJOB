import React from 'react'
import { FiMaximize2 } from 'react-icons/fi'
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
  const openStatusView = useJobStore((state) => state.openStatusView)

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex flex-col min-w-[270px] flex-1 shrink-0 rounded-2xl border-[2.5px] border-black shadow-[5px_5px_0px_#000000] overflow-hidden transition-all duration-150 ${
        isDragOver
          ? 'bg-[#C6FF33]/30 border-black ring-4 ring-[#7D39EB]'
          : 'bg-[#F9F8F6]'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-3.5 border-b-[2.5px] border-black ${statusInfo.headerBg}`}>
        <div
          onClick={() => openStatusView(statusKey)}
          title={`คลิกเพื่อดูงานทั้งหมดในสถานะ ${statusInfo.label} แบบตารางขยายใหญ่ (${jobs.length} งาน)`}
          className="flex items-center gap-2 min-w-0 cursor-pointer group hover:opacity-85 transition select-none"
        >
          <div className="flex items-center gap-1 opacity-60 shrink-0">
            <span className="w-2 h-2 rounded-full border border-black bg-white inline-block"></span>
            <span className="w-2 h-2 rounded-full border border-black bg-white inline-block"></span>
            <span className="w-2 h-2 rounded-full border border-black bg-black inline-block"></span>
          </div>

          <div className="flex flex-col items-start ml-1 leading-tight min-w-0">
            <span className="font-mono font-black text-xs uppercase tracking-wider text-black truncate group-hover:underline">
              {statusInfo.label}
            </span>
            <span className="text-[10px] font-bold text-black/80 truncate">
              {statusInfo.thaiLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Expand View Button */}
          <button
            type="button"
            title={`ขยายดูงานทั้งหมดในสถานะ ${statusInfo.label} (${jobs.length} งาน)`}
            onClick={() => openStatusView(statusKey)}
            className="flex h-6 px-1.5 items-center justify-center gap-1 rounded-md bg-white text-black border-2 border-black font-mono font-bold text-[10px] shadow-[1.5px_1.5px_0px_#000] hover:bg-[#C6FF33] transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            <FiMaximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">ขยาย</span>
          </button>

          {/* Job Count Badge */}
          <button
            type="button"
            onClick={() => openStatusView(statusKey)}
            title={`คลิกเพื่อดูรายการงานทั้งหมด ${jobs.length} งาน`}
            className="rounded-md px-2 py-0.5 text-xs font-mono font-black border-2 border-black bg-black text-[#C6FF33] shadow-[1px_1px_0px_#000] hover:bg-[#C6FF33] hover:text-black transition cursor-pointer"
          >
            {jobs.length}
          </button>

          {/* Quick Add Button */}
          <button
            type="button"
            title={`เพิ่มงานในสถานะ ${statusInfo.label}`}
            onClick={() => openCreateModal(statusKey)}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black border-2 border-black font-black shadow-[1.5px_1.5px_0px_#000] hover:bg-[#C6FF33] transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            +
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto max-h-[calc(100vh-270px)] min-h-[220px]">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed border-slate-300 text-center p-4 text-xs font-mono text-slate-500">
            <span className="font-bold">NO JOBS IN THIS QUEUE</span>
            <button
              type="button"
              onClick={() => openCreateModal(statusKey)}
              className="mt-2 text-black font-black underline hover:text-[#7D39EB] cursor-pointer uppercase"
            >
              + ADD APPLICATION
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onDragStart={onDragStart} />
          ))
        )}
      </div>

      {/* Bottom quick expand bar if column has multiple jobs */}
      {jobs.length > 2 && (
        <div className="p-2 border-t-2 border-black/10 bg-white/60">
          <button
            type="button"
            onClick={() => openStatusView(statusKey)}
            className="w-full py-1 px-2 rounded-lg border border-black/30 hover:border-black bg-white hover:bg-[#C6FF33] text-black font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[1px_1px_0px_#000] transition cursor-pointer"
          >
            <FiMaximize2 className="w-3 h-3" />
            <span>ขยายดูทั้งหมด ({jobs.length} รายการ)</span>
          </button>
        </div>
      )}
    </div>
  )
}
