import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useJobStore } from '../stores/useJobStore'
import { STATUS_CONFIG } from '../constants/statusConfig'
import { StatusDropdown } from './StatusDropdown'

export const JobCard = ({ job, onDragStart }) => {
  const activeDropdownId = useJobStore((state) => state.activeDropdownId)
  const setActiveDropdownId = useJobStore((state) => state.setActiveDropdownId)
  const updateJobStatus = useJobStore((state) => state.updateJobStatus)
  const toggleStar = useJobStore((state) => state.toggleStar)
  const openEditModal = useJobStore((state) => state.openEditModal)
  const deleteJob = useJobStore((state) => state.deleteJob)

  const dropdownRef = useRef(null)
  const statusObj = STATUS_CONFIG[(job.status || 'applied').toLowerCase()] || STATUS_CONFIG.applied
  const isDropdownOpen = activeDropdownId === job.id

  const companyInitial = (job.company || 'J').charAt(0).toUpperCase()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, transition: { duration: 0.12 } }}
      whileTap={{ scale: 0.98 }}
      draggable
      onDragStart={(e) => onDragStart(e, job.id)}
      className="group relative rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-[#C6FF33] border-2 border-black font-mono font-black text-sm shadow-[2px_2px_0px_#000] shrink-0">
            {companyInitial}
          </div>

          <div>
            <h3 className="font-black text-black text-sm leading-snug tracking-tight">
              {job.title || 'ไม่ระบุตำแหน่ง'}
            </h3>
            <p className="text-xs font-bold text-slate-600 mt-0.5 flex items-center gap-1.5 font-mono">
              <span>{job.company || 'ไม่ระบุบริษัท'}</span>
              {job.location && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-[11px] text-slate-500 font-semibold">{job.location}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setActiveDropdownId(isDropdownOpen ? null : job.id)
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black transition cursor-pointer ${statusObj.pillClass}`}
          >
            {statusObj.icon}
            <span className="uppercase">{statusObj.label}</span>
            <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <StatusDropdown
              job={job}
              onSelectStatus={updateJobStatus}
              dropdownRef={dropdownRef}
            />
          )}
        </div>
      </div>

      {job.salary && (
        <div className="mt-2 text-xs font-mono font-black text-black bg-slate-100 border border-black rounded px-2 py-0.5 inline-block shadow-[1px_1px_0px_#000]">
          💰 {job.salary}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
        <span className="inline-flex items-center rounded bg-black text-[#C6FF33] font-bold px-2 py-0.5 border border-black">
          {job.platform || 'LinkedIn'}
        </span>

        {job.work_type && (
          <span className="inline-flex items-center gap-1 rounded bg-[#C6FF33] text-black font-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            <span>🏠</span>
            <span>{job.work_type}</span>
          </span>
        )}

        {job.due && (
          <span className="inline-flex items-center rounded bg-[#D7BAFF] text-black font-bold px-2 py-0.5 border border-black">
            📅 {job.due}
          </span>
        )}
      </div>

      {job.notes && (
        <div className="mt-2.5 rounded-lg bg-slate-50 border border-slate-300 p-2 text-[11px] text-slate-800 line-clamp-2 font-mono">
          <span className="font-black text-black">NOTE:</span> {job.notes}
        </div>
      )}

      <div className="mt-3.5 flex items-center justify-between border-t-2 border-black/10 pt-2.5 text-[10px] font-mono text-slate-500">
        <span>{job.created_at ? `DATE: ${job.created_at}` : 'TODAY'}</span>

        <div className="flex items-center space-x-1.5">
          {job.job_url && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noreferrer"
              title="ลิงก์ประกาศงาน"
              className="p-1 hover:text-black transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          <button
            type="button"
            onClick={() => toggleStar(job)}
            title="ติดดาว"
            className={`p-1 transition cursor-pointer text-sm ${job.starred ? 'text-amber-500 font-bold' : 'hover:text-amber-500 text-slate-400'}`}
          >
            ★
          </button>

          <button
            type="button"
            onClick={() => openEditModal(job)}
            title="แก้ไข"
            className="p-1 hover:text-black transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => deleteJob(job.id, job.company)}
            title="ลบ"
            className="p-1 hover:text-rose-600 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => openEditModal(job)}
            title="ดูรายละเอียด"
            className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-[#C6FF33] border border-black font-mono font-black text-xs hover:bg-[#C6FF33] hover:text-black transition cursor-pointer shadow-[1.5px_1.5px_0px_#000] ml-0.5"
          >
            →
          </button>
        </div>
      </div>
    </motion.div>
  )
}
