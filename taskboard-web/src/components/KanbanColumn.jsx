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
      className={`flex flex-col min-w-[270px] flex-1 shrink-0 rounded-2xl border-[2.5px] border-black shadow-[5px_5px_0px_#000000] overflow-hidden transition-all duration-150 ${
        isDragOver
          ? 'bg-[#C6FF33]/30 border-black ring-4 ring-[#7D39EB]'
          : 'bg-[#F9F8F6]'
      }`}
    >
      <div className={`flex items-center justify-between p-3.5 border-b-[2.5px] border-black ${statusInfo.headerBg}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 opacity-60">
            <span className="w-2 h-2 rounded-full border border-black bg-white inline-block"></span>
            <span className="w-2 h-2 rounded-full border border-black bg-white inline-block"></span>
            <span className="w-2 h-2 rounded-full border border-black bg-black inline-block"></span>
          </div>

          <h2 className="font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ml-1">
            <span>{statusInfo.label}</span>
            <span className="text-[10px] font-bold opacity-75">
              ({statusInfo.thaiLabel})
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md px-2 py-0.5 text-xs font-mono font-black border-2 border-black bg-black text-[#C6FF33] shadow-[1px_1px_0px_#000]">
            {jobs.length}
          </span>

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
    </div>
  )
}
