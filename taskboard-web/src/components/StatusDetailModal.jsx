import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch,
  FiX,
  FiPlus,
  FiStar,
  FiEdit3,
  FiTrash2,
  FiExternalLink,
  FiCalendar,
  FiMapPin,
  FiChevronDown,
  FiFilter,
  FiArrowRight,
  FiLayers,
} from 'react-icons/fi'
import { FaStar } from 'react-icons/fa6'
import { useJobStore } from '../stores/useJobStore'
import { STATUS_CONFIG, getPlatformLogo } from '../constants/statusConfig'
import { StatusDropdown } from './StatusDropdown'

export const StatusDetailModal = () => {
  const activeStatusView = useJobStore((state) => state.activeStatusView)
  const closeStatusView = useJobStore((state) => state.closeStatusView)
  const jobs = useJobStore((state) => state.jobs)
  const openCreateModal = useJobStore((state) => state.openCreateModal)
  const openEditModal = useJobStore((state) => state.openEditModal)
  const deleteJob = useJobStore((state) => state.deleteJob)
  const toggleStar = useJobStore((state) => state.toggleStar)
  const updateJobStatus = useJobStore((state) => state.updateJobStatus)
  const platforms = useJobStore((state) => state.platforms)
  const activeDropdownId = useJobStore((state) => state.activeDropdownId)
  const setActiveDropdownId = useJobStore((state) => state.setActiveDropdownId)

  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [onlyStarredInModal, setOnlyStarredInModal] = useState(false)
  const [sortBy, setSortBy] = useState('newest') // newest, company, salary

  const dropdownButtonRefs = useRef({})

  // Close on Escape key
  useEffect(() => {
    if (!activeStatusView) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeStatusView()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeStatusView, closeStatusView])

  // Reset filters when status changes
  useEffect(() => {
    setSearch('')
    setPlatformFilter('all')
    setOnlyStarredInModal(false)
    setSortBy('newest')
    setActiveDropdownId(null)
  }, [activeStatusView, setActiveDropdownId])

  const statusInfo = activeStatusView
    ? STATUS_CONFIG[activeStatusView] || STATUS_CONFIG.applied
    : null

  // All jobs in this status
  const statusJobs = useMemo(() => {
    if (!activeStatusView) return []
    return jobs.filter(
      (j) => (j.status || 'applied').toLowerCase() === activeStatusView.toLowerCase()
    )
  }, [jobs, activeStatusView])

  // Filtered & sorted jobs
  const displayedJobs = useMemo(() => {
    return statusJobs
      .filter((job) => {
        if (search.trim()) {
          const q = search.toLowerCase()
          const matchTitle = (job.title || '').toLowerCase().includes(q)
          const matchCompany = (job.company || '').toLowerCase().includes(q)
          const matchNotes = (job.notes || '').toLowerCase().includes(q)
          const matchDesc = (job.desc || '').toLowerCase().includes(q)
          const matchLocation = (job.location || '').toLowerCase().includes(q)
          const matchPlatform = (job.platform || '').toLowerCase().includes(q)
          if (!matchTitle && !matchCompany && !matchNotes && !matchDesc && !matchLocation && !matchPlatform) {
            return false
          }
        }

        if (platformFilter !== 'all') {
          if ((job.platform || 'LinkedIn') !== platformFilter) return false
        }

        if (onlyStarredInModal && !job.starred) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'company') {
          return (a.company || '').localeCompare(b.company || '')
        }
        if (sortBy === 'starred') {
          return (b.starred ? 1 : 0) - (a.starred ? 1 : 0)
        }
        // newest first (default)
        return (b.created_at || b.due || '').localeCompare(a.created_at || a.due || '')
      })
  }, [statusJobs, search, platformFilter, onlyStarredInModal, sortBy])

  if (!activeStatusView || !statusInfo) return null

  const starredCount = statusJobs.filter((j) => j.starred).length

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/75 backdrop-blur-xs font-sans overflow-y-auto"
        onClick={() => {
          setActiveDropdownId(null)
          closeStatusView()
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border-[3px] border-black bg-[#FBFBFA] shadow-[10px_10px_0px_#000000] overflow-hidden"
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 sm:p-5 border-b-[3px] border-black ${statusInfo.headerBg}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0 opacity-75">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full border-2 border-black bg-black inline-block"></span>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-2 rounded-xl bg-black text-[#C6FF33] border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 text-sm">
                  {statusInfo.icon}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-xl font-black font-mono uppercase tracking-wider text-black truncate">
                      {statusInfo.label}
                    </h2>
                    <span className="rounded-lg px-2.5 py-0.5 text-xs font-mono font-black border-2 border-black bg-black text-[#C6FF33] shadow-[1.5px_1.5px_0px_#000]">
                      {statusJobs.length} งานทั้งหมด
                    </span>
                    {starredCount > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-mono font-black border-2 border-black bg-amber-300 text-black shadow-[1.5px_1.5px_0px_#000]">
                        ⭐ {starredCount} งานสำคัญ
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-black/80 truncate">
                    {statusInfo.thaiLabel} • มุมมองขยายแบบตารางการ์ดใหญ่
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  closeStatusView()
                  openCreateModal(activeStatusView)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C6FF33] text-black border-2 border-black font-mono font-black text-xs shadow-[2px_2px_0px_#000] hover:bg-black hover:text-[#C6FF33] transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden sm:inline">เพิ่มงานในสถานะนี้</span>
                <span className="sm:hidden">เพิ่ม</span>
              </button>

              <button
                type="button"
                onClick={closeStatusView}
                title="ปิดหน้าต่าง (ESC)"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black border-2 border-black font-black text-sm shadow-[2px_2px_0px_#000] hover:bg-rose-500 hover:text-white transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader / Filter & Search Controls */}
          <div className="p-3.5 sm:p-4 bg-white border-b-2 border-black flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-lg">
              <div className="relative flex items-center bg-[#F9F8F6] rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000000] pl-3 pr-2 py-1.5 w-full focus-within:ring-2 focus-within:ring-[#7D39EB] transition">
                <FiSearch className="w-4 h-4 text-slate-500 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder={`ค้นหาในสถานะ ${statusInfo.label} (ตำแหน่ง, บริษัท, โน้ต...)`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs font-bold text-black placeholder:text-slate-400 outline-none bg-transparent"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="p-1 text-slate-500 hover:text-black cursor-pointer"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
              {/* Starred Filter */}
              <button
                type="button"
                onClick={() => setOnlyStarredInModal(!onlyStarredInModal)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] transition cursor-pointer ${
                  onlyStarredInModal
                    ? 'bg-amber-400 text-black font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FaStar className={`w-3.5 h-3.5 ${onlyStarredInModal ? 'text-black' : 'text-amber-500'}`} />
                <span>ติดดาว</span>
              </button>

              {/* Platform Selector */}
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] font-mono font-bold text-xs text-black outline-none cursor-pointer"
              >
                <option value="all">ทุกแพลตฟอร์ม</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] font-mono font-bold text-xs text-black outline-none cursor-pointer"
              >
                <option value="newest">เรียงตาม: ล่าสุด</option>
                <option value="company">เรียงตาม: ชื่อบริษัท A-Z</option>
                <option value="starred">เรียงตาม: งานที่ติดดาว</option>
              </select>
            </div>
          </div>

          {/* Cards Grid Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F2EE] min-h-[300px]">
            {displayedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center text-3xl mb-4">
                  📂
                </div>
                <h3 className="font-mono font-black text-base uppercase text-black mb-1">
                  {statusJobs.length === 0
                    ? `ยังไม่มีงานในสถานะ ${statusInfo.label}`
                    : 'ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mb-4 font-sans">
                  {statusJobs.length === 0
                    ? `เริ่มเพิ่มใบสมัครงานที่คุณกำลัง ${statusInfo.thaiLabel} เพื่อติดตามความคืบหน้าได้เลย!`
                    : 'ลองปรับคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูงานทั้งหมดในสถานะนี้'}
                </p>
                {statusJobs.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      closeStatusView()
                      openCreateModal(activeStatusView)
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C6FF33] text-black border-2 border-black font-mono font-black text-xs shadow-[3px_3px_0px_#000] hover:bg-black hover:text-[#C6FF33] transition cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>+ เพิ่มงานแรกในสถานะนี้</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('')
                      setPlatformFilter('all')
                      setOnlyStarredInModal(false)
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-black border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000] hover:bg-slate-100 transition cursor-pointer"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedJobs.map((job) => {
                  const companyInitial = (job.company || 'J').charAt(0).toUpperCase()
                  const currentStatus = STATUS_CONFIG[(job.status || 'applied').toLowerCase()] || STATUS_CONFIG.applied
                  const isDropdownOpen = activeDropdownId === `modal-${job.id}`

                  return (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col justify-between rounded-2xl border-[2.5px] border-black bg-white p-5 shadow-[5px_5px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] hover:-translate-y-0.5 transition-all font-sans space-y-3.5"
                    >
                      {/* Top row: Company, Star */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-[#C6FF33] border-2 border-black font-mono font-black text-base shadow-[2px_2px_0px_#000] shrink-0">
                              {companyInitial}
                            </div>

                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-black truncate font-mono tracking-tight leading-tight">
                                {job.company || 'ไม่ระบุบริษัท'}
                              </h4>
                              {job.location && (
                                <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1 mt-0.5">
                                  <FiMapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{job.location}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleStar(job)}
                            title={job.starred ? 'ยกเลิกติดดาว' : 'ติดดาว'}
                            className="p-1.5 transition cursor-pointer shrink-0 rounded-lg hover:bg-slate-100"
                          >
                            {job.starred ? (
                              <FaStar className="w-5 h-5 text-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
                            ) : (
                              <FiStar className="w-5 h-5 text-slate-300 hover:text-amber-500" />
                            )}
                          </button>
                        </div>

                        {/* Job Title */}
                        <div>
                          <h3
                            onClick={() => {
                              closeStatusView()
                              openEditModal(job)
                            }}
                            title={job.title}
                            className="font-black text-black text-base sm:text-lg leading-snug tracking-tight hover:text-[#7D39EB] transition cursor-pointer line-clamp-2"
                          >
                            {job.title || 'ไม่ระบุตำแหน่ง'}
                          </h3>
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                          {/* Status Pill with Dropdown */}
                          <div className="relative inline-block">
                            <button
                              ref={(el) => (dropdownButtonRefs.current[`modal-${job.id}`] = el)}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveDropdownId(isDropdownOpen ? null : `modal-${job.id}`)
                              }}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold transition cursor-pointer ${currentStatus.pillClass}`}
                            >
                              {currentStatus.icon}
                              <span className="uppercase text-[10px]">{currentStatus.label}</span>
                              <FiChevronDown className="w-3 h-3 ml-0.5" />
                            </button>

                            {isDropdownOpen && (
                              <StatusDropdown
                                job={job}
                                anchorRef={{ current: dropdownButtonRefs.current[`modal-${job.id}`] }}
                                onClose={() => setActiveDropdownId(null)}
                                onSelectStatus={updateJobStatus}
                              />
                            )}
                          </div>

                          {/* Platform badge */}
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-black text-[#C6FF33] font-bold px-2.5 py-1 border border-black text-[10px]">
                            {getPlatformLogo(job.platform || 'LinkedIn') && (
                              <img
                                src={getPlatformLogo(job.platform || 'LinkedIn')}
                                alt=""
                                className="w-3.5 h-3.5 rounded-xs object-contain"
                              />
                            )}
                            <span>{job.platform || 'LinkedIn'}</span>
                          </span>

                          {/* Work Type badge */}
                          {job.work_type && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-[#C6FF33] text-black font-black px-2.5 py-1 border border-black shadow-[1px_1px_0px_#000] text-[10px]">
                              <span>🏠</span>
                              <span>{job.work_type}</span>
                            </span>
                          )}
                        </div>

                        {/* Salary */}
                        {job.salary && (
                          <div className="text-xs font-mono font-black text-black bg-amber-100 border border-black rounded-lg px-3 py-1 inline-block shadow-[1.5px_1.5px_0px_#000]">
                            💰 เงินเดือน: {job.salary}
                          </div>
                        )}

                        {/* Notes */}
                        {job.notes && (
                          <div className="rounded-xl bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-800 line-clamp-3">
                            <span className="font-mono font-black text-black">📝 NOTE: </span>
                            {job.notes}
                          </div>
                        )}

                        {/* Job description snippet if present */}
                        {job.desc && !job.notes && (
                          <div className="rounded-xl bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-600 line-clamp-2">
                            <span className="font-mono font-bold text-slate-800">รายละเอียด: </span>
                            {job.desc}
                          </div>
                        )}
                      </div>

                      {/* Bottom Footer & Action Buttons */}
                      <div className="flex items-center justify-between border-t border-black/15 pt-3 text-xs font-mono text-slate-500 mt-2">
                        <span className="flex items-center gap-1.5 font-semibold truncate">
                          <FiCalendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.due || (job.created_at ? job.created_at : 'TODAY')}</span>
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          {job.job_url && (
                            <a
                              href={job.job_url}
                              target="_blank"
                              rel="noreferrer"
                              title="เปิดลิงก์ประกาศรับสมัครงาน"
                              className="p-1.5 rounded-lg border border-black/20 hover:border-black hover:bg-slate-100 text-black transition"
                            >
                              <FiExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              closeStatusView()
                              openEditModal(job)
                            }}
                            title="แก้ไขข้อมูลงาน"
                            className="p-1.5 rounded-lg border border-black/20 hover:border-black hover:bg-slate-100 text-black transition cursor-pointer"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteJob(job.id, job.company)}
                            title="ลบการสมัครงานนี้"
                            className="p-1.5 rounded-lg border border-black/20 hover:border-black hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              closeStatusView()
                              openEditModal(job)
                            }}
                            title="ดูรายละเอียดฉบับเต็ม"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black text-[#C6FF33] border border-black font-mono font-black text-xs hover:bg-[#C6FF33] hover:text-black transition cursor-pointer shadow-[1.5px_1.5px_0px_#000] ml-1"
                          >
                            <span>ดูเต็ม</span>
                            <FiArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
