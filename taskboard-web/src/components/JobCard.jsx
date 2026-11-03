import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiEdit3, FiTrash2, FiExternalLink, FiArrowRight, FiChevronDown, FiCalendar } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa6'
import { useJobStore } from '../stores/useJobStore'
import { STATUS_CONFIG, getPlatformLogo } from '../constants/statusConfig'
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
      className="group relative rounded-xl border-2 border-black bg-white p-3.5 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] transition-all cursor-grab active:cursor-grabbing font-sans space-y-2.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-[#C6FF33] border-2 border-black font-mono font-black text-xs shadow-[1.5px_1.5px_0px_#000] shrink-0">
            {companyInitial}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black text-slate-800 truncate font-mono tracking-tight">
              {job.company || 'ไม่ระบุบริษัท'}
            </p>
            {job.location && (
              <p className="text-[10px] text-slate-500 font-medium truncate leading-none">
                {job.location}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleStar(job)}
          title="ติดดาว"
          className="p-1 transition cursor-pointer text-sm shrink-0"
        >
          {job.starred ? (
            <FaStar className="w-4 h-4 text-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
          ) : (
            <FiStar className="w-4 h-4 text-slate-300 hover:text-amber-500" />
          )}
        </button>
      </div>

      <div>
        <h3
          onClick={() => openEditModal(job)}
          title={job.title}
          className="font-black text-black text-sm leading-snug tracking-tight hover:text-[#7D39EB] transition cursor-pointer line-clamp-2"
        >
          {job.title || 'ไม่ระบุตำแหน่ง'}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
        <div className="relative inline-block">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setActiveDropdownId(isDropdownOpen ? null : job.id)
            }}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold transition cursor-pointer ${statusObj.pillClass}`}
          >
            {statusObj.icon}
            <span className="uppercase text-[9.5px]">{statusObj.label}</span>
            <FiChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {isDropdownOpen && (
            <StatusDropdown
              job={job}
              onSelectStatus={updateJobStatus}
              dropdownRef={dropdownRef}
            />
          )}
        </div>

        <span className="inline-flex items-center gap-1 rounded-md bg-black text-[#C6FF33] font-bold px-2 py-0.5 border border-black text-[9.5px]">
          {getPlatformLogo(job.platform || 'LinkedIn') && (
            <img
              src={getPlatformLogo(job.platform || 'LinkedIn')}
              alt=""
              className="w-3 h-3 rounded-xs object-contain"
            />
          )}
          <span>{job.platform || 'LinkedIn'}</span>
        </span>

        {job.work_type && (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#C6FF33] text-black font-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000] text-[9.5px]">
            <span>🏠</span>
            <span>{job.work_type}</span>
          </span>
        )}
      </div>

      {job.salary && (
        <div className="text-[10px] font-mono font-black text-black bg-slate-100 border border-black rounded-md px-2 py-0.5 inline-block shadow-[1px_1px_0px_#000]">
          💰 {job.salary}
        </div>
      )}

      {job.notes && (
        <div className="rounded-lg bg-slate-50 border border-slate-300 p-2 text-[11px] text-slate-800 line-clamp-2">
          <span className="font-mono font-black text-black">NOTE:</span> {job.notes}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-black/10 pt-2 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1 font-semibold truncate">
          <FiCalendar className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{job.due || (job.created_at ? job.created_at : 'TODAY')}</span>
        </span>

        <div className="flex items-center space-x-1 shrink-0">
          {job.job_url && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noreferrer"
              title="ลิงก์ประกาศงาน"
              className="p-1 hover:text-black transition"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            type="button"
            onClick={() => openEditModal(job)}
            title="แก้ไข"
            className="p-1 hover:text-black transition cursor-pointer"
          >
            <FiEdit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => deleteJob(job.id, job.company)}
            title="ลบ"
            className="p-1 hover:text-rose-600 transition cursor-pointer"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => openEditModal(job)}
            title="ดูรายละเอียด"
            className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-black text-[#C6FF33] border border-black font-mono font-black text-xs hover:bg-[#C6FF33] hover:text-black transition cursor-pointer shadow-[1px_1px_0px_#000] ml-0.5"
          >
            <FiArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
