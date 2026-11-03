import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { FiBriefcase, FiMapPin, FiUser, FiLink, FiArrowRight } from 'react-icons/fi'
import { useJobStore } from '../stores/useJobStore'
import { STATUS_CONFIG, getPlatformLogo } from '../constants/statusConfig'
import { DatePicker } from './DatePicker'

export const JobModal = () => {
  const isModalOpen = useJobStore((state) => state.isModalOpen)
  const editingJob = useJobStore((state) => state.editingJob)
  const platforms = useJobStore((state) => state.platforms)
  const addCustomPlatform = useJobStore((state) => state.addCustomPlatform)
  const addJob = useJobStore((state) => state.addJob)
  const updateJob = useJobStore((state) => state.updateJob)
  const closeModal = useJobStore((state) => state.closeModal)

  const [form, setForm] = useState({
    title: '',
    company: '',
    platform: 'LinkedIn',
    work_type: 'Remote',
    salary: '',
    location: '',
    status: 'applied',
    due: '',
    job_url: '',
    notes: '',
    desc: '',
    starred: false,
  })

  const [isAddingCustomPlatform, setIsAddingCustomPlatform] = useState(false)
  const [customPlatformInput, setCustomPlatformInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isModalOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, closeModal])

  useEffect(() => {
    if (editingJob) {
      setForm({
        title: editingJob.title || '',
        company: editingJob.company || '',
        platform: editingJob.platform || 'LinkedIn',
        work_type: editingJob.work_type || 'Remote',
        salary: editingJob.salary || '',
        location: editingJob.location || '',
        status: editingJob.status || 'applied',
        due: editingJob.due || '',
        job_url: editingJob.job_url || editingJob.url || '',
        notes: editingJob.notes || '',
        desc: editingJob.desc || '',
        starred: !!editingJob.starred,
      })
    } else {
      setForm({
        title: '',
        company: '',
        platform: platforms[0] || 'LinkedIn',
        work_type: 'Remote',
        salary: '',
        location: '',
        status: 'applied',
        due: '',
        job_url: '',
        notes: '',
        desc: '',
        starred: false,
      })
    }
    setIsAddingCustomPlatform(false)
    setCustomPlatformInput('')
    setErrors({})
  }, [editingJob, isModalOpen, platforms])

  const handleCustomPlatformAdd = (e) => {
    e.preventDefault()
    const trimmed = customPlatformInput.trim()
    if (!trimmed) return
    addCustomPlatform(trimmed)
    setForm((prev) => ({ ...prev, platform: trimmed }))
    setCustomPlatformInput('')
    setIsAddingCustomPlatform(false)
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    const newErrors = {}
    if (!form.title.trim()) {
      newErrors.title = 'กรุณาระบุตำแหน่งงาน (Job Title)'
    }
    if (!form.company.trim()) {
      newErrors.company = 'กรุณาระบุชื่อบริษัท (Company Name)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const errorMsg = newErrors.title || newErrors.company
      toast.error(errorMsg, {
        position: 'bottom-right',
        autoClose: 3500,
        theme: 'dark',
      })
      return
    }

    setSubmitting(true)
    setErrors({})

    if (editingJob) {
      await updateJob(editingJob.id, form)
    } else {
      await addJob(form)
    }
    setSubmitting(false)
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-[95vw] max-w-6xl xl:max-w-7xl h-[88vh] max-h-[920px] flex flex-col rounded-2xl bg-white border-[3px] border-black shadow-[12px_12px_0px_#000000] overflow-hidden my-auto cursor-default font-sans"
          >
            <div className="flex-none flex items-center justify-between px-5 py-3 border-b-[2.5px] border-black bg-black text-white font-mono">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF8080] border border-black inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFF080] border border-black inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-[#C6FF33] border border-black inline-block"></span>
                </div>

                <span className="text-xs font-black uppercase tracking-wider text-[#C6FF33]">
                  {editingJob ? '// EDIT_APPLICATION' : '// CREATE_APPLICATION'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border-2 border-white px-3 py-1 text-xs font-bold text-white hover:bg-white hover:text-black transition cursor-pointer"
                >
                  DRAFT
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="rounded-lg bg-[#C6FF33] text-black border-2 border-black px-4 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#C6FF33] hover:bg-[#bbf426] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? (
                    <ClipLoader size={12} color="#000000" />
                  ) : (
                    <>
                      <span>{editingJob ? 'UPDATE' : 'PUBLISH'}</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-5 sm:p-6 overflow-y-auto font-sans">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
                <div className="lg:col-span-7 flex flex-col h-full space-y-3.5">
                  <h1 className="text-xl font-black text-black tracking-tight uppercase font-mono">
                    {editingJob ? 'EDIT APPLICATION' : 'CREATE JOB RECORD'}
                  </h1>

                  <div>
                    <label className="block text-xs font-black text-black uppercase tracking-wider mb-1 font-mono">
                      Job Title <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Frontend Developer"
                      value={form.title}
                      onChange={(e) => {
                        setForm({ ...form, title: e.target.value })
                        if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
                      }}
                      className={`w-full rounded-lg border-2 px-3.5 py-2 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000] transition ${
                        errors.title
                          ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-400'
                          : 'border-black focus:ring-2 focus:ring-[#7D39EB]'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1 font-mono">
                        <span>⚠️</span>
                        <span>{errors.title}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1 font-mono">
                        <label className="block text-xs font-black text-black uppercase tracking-wider">
                          Source Platform
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAddingCustomPlatform(!isAddingCustomPlatform)}
                          className="text-[11px] font-black text-[#7D39EB] underline hover:text-black cursor-pointer"
                        >
                          {isAddingCustomPlatform ? 'Cancel' : '+ ADD OTHER'}
                        </button>
                      </div>

                      {isAddingCustomPlatform ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="เช่น Fastwork, Indeed"
                            value={customPlatformInput}
                            onChange={(e) => setCustomPlatformInput(e.target.value)}
                            className="flex-1 rounded-lg border-2 border-black px-2.5 py-1.5 text-xs font-bold outline-none shadow-[2px_2px_0px_#000]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleCustomPlatformAdd}
                            className="rounded-lg bg-[#C6FF33] text-black border-2 border-black px-3 py-1.5 text-xs font-black hover:bg-[#bbf426] transition cursor-pointer shadow-[2px_2px_0px_#000]"
                          >
                            ADD
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {platforms.map((p) => {
                            const isSelected = form.platform === p
                            const logo = getPlatformLogo(p)
                            return (
                              <button
                                type="button"
                                key={p}
                                onClick={() => setForm({ ...form, platform: p })}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black border-2 border-black uppercase font-mono transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#C6FF33] text-black shadow-[2px_2px_0px_#000]'
                                    : 'bg-white text-black hover:bg-slate-100 shadow-[1px_1px_0px_#000]'
                                }`}
                              >
                                {logo && (
                                  <img
                                    src={logo}
                                    alt={p}
                                    className="w-3.5 h-3.5 rounded-xs object-contain shrink-0"
                                  />
                                )}
                                <span>{p}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-mono">
                        Work Arrangement
                      </label>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-black font-bold pt-1">
                        {['Remote', 'Hybrid', 'Onsite'].map((type) => {
                          const isSelected = form.work_type === type
                          return (
                            <label
                              key={type}
                              onClick={() => setForm({ ...form, work_type: type })}
                              className="flex items-center gap-1.5 cursor-pointer select-none group"
                            >
                              <span
                                className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 border-black transition ${
                                  isSelected ? 'bg-black text-[#C6FF33]' : 'bg-white'
                                }`}
                              >
                                {isSelected && <span className="h-2 w-2 bg-[#C6FF33]" />}
                              </span>
                              <span className={isSelected ? 'font-black underline' : 'font-bold'}>
                                {type}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black uppercase tracking-wider mb-1 font-mono">
                      Application Status
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                        const isSelected = form.status === key
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => setForm({ ...form, status: key })}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2 border-black transition cursor-pointer text-center leading-tight ${
                              isSelected
                                ? `${config.pillClass} ring-2 ring-black scale-[1.02] shadow-[2px_2px_0px_#000]`
                                : `${config.pillClass} opacity-80 hover:opacity-100 shadow-[1px_1px_0px_#000]`
                            }`}
                          >
                            <div className="flex items-center gap-1 font-mono font-black text-[11px] uppercase">
                              <span>{config.icon}</span>
                              <span className="truncate">{config.label}</span>
                            </div>
                            <span className="text-[9.5px] font-bold opacity-80 mt-0.5 truncate">
                              {config.thaiLabel}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-1 font-mono">
                        Deadline / Interview Date
                      </label>
                      <DatePicker
                        value={form.due}
                        onChange={(val) => setForm({ ...form, due: val })}
                        placeholder="วว/ดด/ปปปป"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-1 font-mono">
                        Compensation Rate (THB)
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-[11px] font-black text-slate-500 font-mono">
                            THB
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. 35k - 55k"
                            value={form.salary}
                            onChange={(e) => setForm({ ...form, salary: e.target.value })}
                            className="w-full rounded-lg border-2 border-black py-2 pl-11 pr-2 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000] font-mono"
                          />
                        </div>
                        <span className="text-[11px] font-black text-black rounded-lg bg-black text-white px-2.5 py-2 border-2 border-black font-mono">
                          /MO
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-[140px]">
                    <label className="block text-xs font-black text-black uppercase tracking-wider mb-1 font-mono">
                      Description & Notes
                    </label>
                    <div className="flex-1 flex flex-col rounded-xl border-2 border-black overflow-hidden shadow-[2px_2px_0px_#000]">
                      <div className="flex-none flex items-center gap-2 border-b-2 border-black bg-slate-100 px-3 py-1.5 text-xs font-black">
                        <span className="px-1.5 py-0.5 hover:bg-black hover:text-white rounded cursor-pointer font-bold">B</span>
                        <span className="px-1.5 py-0.5 hover:bg-black hover:text-white rounded cursor-pointer italic font-serif">I</span>
                        <span className="px-1.5 py-0.5 hover:bg-black hover:text-white rounded cursor-pointer underline">U</span>
                        <span className="border-l border-black h-3 mx-1"></span>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Interview Prep / Notes</span>
                      </div>
                      <textarea
                        rows={4}
                        placeholder="รายละเอียดงาน, สิ่งที่ต้องเตรียมตัวตอบคำถามสัมภาษณ์, ข้อมูลโปรเจกต์..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="flex-1 w-full p-3 text-xs font-medium text-black outline-none resize-none bg-white font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col">
                  <div className="rounded-xl border-2 border-black bg-slate-50 p-5 space-y-4 shadow-[4px_4px_0px_#000000]">
                    <div className="flex items-center justify-between border-b-2 border-black pb-2.5 font-mono">
                      <h2 className="font-black text-black text-xs uppercase">
                        Employer Details
                      </h2>
                      <span className="text-[10px] font-black text-slate-500 uppercase">
                        Company Info
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1 font-mono">
                        Company <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-[#C6FF33] border-2 border-black font-black text-sm shadow-[1.5px_1.5px_0px_#000] shrink-0">
                          <FiBriefcase className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Agoda, SCB TechX"
                          value={form.company}
                          onChange={(e) => {
                            setForm({ ...form, company: e.target.value })
                            if (errors.company) setErrors((prev) => ({ ...prev, company: '' }))
                          }}
                          className={`flex-1 rounded-lg border-2 bg-white px-3 py-1.5 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000] transition ${
                            errors.company
                              ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-400'
                              : 'border-black focus:ring-2 focus:ring-[#7D39EB]'
                          }`}
                        />
                      </div>
                      {errors.company && (
                        <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1 font-mono">
                          <span>⚠️</span>
                          <span>{errors.company}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1 font-mono">
                        Work Location / Branch
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="e.g. Bangkok, BTS Asoke"
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          className="w-full rounded-lg border-2 border-black bg-white px-3 py-1.5 pl-8 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
                        />
                        <FiMapPin className="w-3.5 h-3.5 absolute left-2.5 text-slate-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1 font-mono">
                        Contact Person / HR
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="e.g. Khun Somchai (HR Lead)"
                          value={form.desc}
                          onChange={(e) => setForm({ ...form, desc: e.target.value })}
                          className="w-full rounded-lg border-2 border-black bg-white px-3 py-1.5 pl-8 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
                        />
                        <FiUser className="w-3.5 h-3.5 absolute left-2.5 text-slate-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1 font-mono">
                        Job Posting Link
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="url"
                          placeholder="https://..."
                          value={form.job_url}
                          onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                          className="w-full rounded-lg border-2 border-black bg-white px-3 py-1.5 pl-8 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000] font-mono"
                        />
                        <FiLink className="w-3.5 h-3.5 absolute left-2.5 text-slate-500" />
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#C6FF33]/40 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.starred}
                        onChange={(e) => setForm({ ...form, starred: e.target.checked })}
                        className="h-4 w-4 border-2 border-black rounded accent-black"
                      />
                      <div className="text-xs">
                        <span className="font-black text-black block uppercase font-mono">⭐ PRIORITY TARGET</span>
                        <span className="text-[10px] font-bold text-slate-700">ปักหมุดเป็นบริษัทเป้าหมายสำคัญ</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
