import React, { useRef } from 'react'
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
    <div
      draggable
      onDragStart={(e) => onDragStart(e, job.id)}
      className="group relative rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-extrabold text-sm shadow-xs shrink-0">
            {companyInitial}
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm leading-snug tracking-tight">
              {job.title || 'ไม่ระบุตำแหน่ง'}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>{job.company || 'ไม่ระบุบริษัท'}</span>
              {job.location && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-slate-400 font-medium">{job.location}</span>
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
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer shadow-xs ${statusObj.pillClass}`}
          >
            {statusObj.icon}
            <span>{statusObj.label}</span>
            <svg className="w-3 h-3 ml-0.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
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
        <div className="mt-2 text-xs font-bold text-slate-800">
          💰 {job.salary}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
          {job.platform || 'LinkedIn'}
        </span>

        {job.work_type && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F7EE] px-2.5 py-0.5 text-[10px] font-bold text-[#0E6245]">
            <span>🏠</span>
            <span>{job.work_type}</span>
          </span>
        )}

        {job.due && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
            📅 {job.due}
          </span>
        )}
      </div>

      {job.notes && (
        <div className="mt-2.5 rounded-xl bg-slate-50/80 p-2 text-[11px] text-slate-600 line-clamp-2">
          <span className="font-bold text-slate-500">Notes:</span> {job.notes}
        </div>
      )}

      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
        <span>{job.created_at ? `บันทึกเมื่อ ${job.created_at}` : 'วันนี้'}</span>

        <div className="flex items-center space-x-1.5">
          {job.job_url && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noreferrer"
              title="ลิงก์ประกาศงาน"
              className="p-1 hover:text-slate-900 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          <button
            type="button"
            onClick={() => toggleStar(job)}
            title="ติดดาว"
            className={`p-1 transition cursor-pointer text-sm ${job.starred ? 'text-amber-500 font-bold' : 'hover:text-amber-500 text-slate-300'}`}
          >
            ★
          </button>

          <button
            type="button"
            onClick={() => openEditModal(job)}
            title="แก้ไข"
            className="p-1 hover:text-slate-900 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => deleteJob(job.id, job.company)}
            title="ลบ"
            className="p-1 hover:text-rose-600 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => openEditModal(job)}
            title="ดูรายละเอียด"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer shadow-xs ml-0.5"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
