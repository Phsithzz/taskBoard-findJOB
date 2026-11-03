import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipLoader } from 'react-spinners'
import { useJobStore } from '../stores/useJobStore'
import { STATUS_CONFIG } from '../constants/statusConfig'

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
  const [validationError, setValidationError] = useState('')

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
    setValidationError('')
  }, [editingJob, isModalOpen, platforms])

  if (!isModalOpen) return null

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
    if (!form.title.trim()) {
      setValidationError('กรุณาระบุตำแหน่งงาน (Job Title)')
      return
    }
    if (!form.company.trim()) {
      setValidationError('กรุณาระบุชื่อบริษัท (Company Name)')
      return
    }

    setSubmitting(true)
    setValidationError('')

    if (editingJob) {
      await updateJob(editingJob.id, form)
    } else {
      await addJob(form)
    }
    setSubmitting(false)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-150 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center gap-1 hover:text-slate-900 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              <span className="text-slate-300">/</span>
              <span>Job List</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold">
                {editingJob ? 'Edit Job' : 'Create Job'}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="rounded-xl bg-[#FF5A1F] hover:bg-[#E04F1B] px-5 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {submitting ? (
                  <ClipLoader size={13} color="#ffffff" />
                ) : (
                  <>
                    <span>{editingJob ? 'Update Job' : 'Publish Now'}</span>
                    <svg className="w-3.5 h-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
            {validationError && (
              <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>{validationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingJob ? 'Edit Job Application' : 'Create Job'}
                </h1>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Developer"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Job Platform (Source App)
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomPlatform(!isAddingCustomPlatform)}
                      className="text-xs font-semibold text-[#FF5A1F] hover:underline cursor-pointer"
                    >
                      {isAddingCustomPlatform ? 'Cancel' : '+ เพิ่มแอป/เว็บอื่น'}
                    </button>
                  </div>

                  {isAddingCustomPlatform ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="พิมพ์ชื่อแอป เช่น Fastwork, Indeed, Email โดยตรง"
                        value={customPlatformInput}
                        onChange={(e) => setCustomPlatformInput(e.target.value)}
                        className="flex-1 rounded-xl border border-indigo-300 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleCustomPlatformAdd}
                        className="rounded-xl bg-[#FF5A1F] px-4 py-2 text-xs font-bold text-white hover:brightness-95 transition cursor-pointer"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((p) => {
                        const isSelected = form.platform === p
                        return (
                          <button
                            type="button"
                            key={p}
                            onClick={() => setForm({ ...form, platform: p })}
                            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium border transition cursor-pointer ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Employment Type
                  </label>
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700">
                    {['Remote', 'Hybrid', 'Onsite'].map((type) => {
                      const isSelected = form.work_type === type
                      return (
                        <label
                          key={type}
                          onClick={() => setForm({ ...form, work_type: type })}
                          className="flex items-center gap-2 cursor-pointer select-none group"
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
                              isSelected
                                ? 'border-[#FF5A1F] bg-[#FF5A1F]'
                                : 'border-slate-300 group-hover:border-slate-400'
                            }`}
                          >
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          <span className={isSelected ? 'font-bold text-slate-900' : 'text-slate-600'}>
                            {type}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Deadline / Interview Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={form.due}
                        onChange={(e) => setForm({ ...form, due: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white cursor-pointer font-medium"
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label} ({config.thaiLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Rate Amount / Salary (THB)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-[11px] font-bold text-slate-400">
                        THB
                      </span>
                      <input
                        type="text"
                        placeholder="เช่น 35,000 - 55,000"
                        value={form.salary}
                        onChange={(e) => setForm({ ...form, salary: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 py-2 pl-12 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 rounded-xl bg-slate-100 px-3 py-2">
                      /Month
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Job Description & Notes
                  </label>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden focus-within:border-indigo-500 transition">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-3 py-2 text-xs text-slate-600">
                      <span className="font-bold px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">B</span>
                      <span className="italic px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">i</span>
                      <span className="underline px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">U</span>
                      <span className="border-l border-slate-200 h-4 mx-1"></span>
                      <span className="px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">≡</span>
                      <span className="px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">⁝≡</span>
                      <span className="border-l border-slate-200 h-4 mx-1"></span>
                      <span className="text-[11px] text-slate-400">Interview questions & notes</span>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="รายละเอียดงาน, สิ่งที่ต้องเตรียมตัวตอบคำถามสัมภาษณ์, ข้อมูลโปรเจกต์..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full p-3.5 text-xs text-slate-800 outline-none resize-none bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                    <h2 className="font-bold text-slate-900 text-sm tracking-tight">
                      Employer Details
                    </h2>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Company Info
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm shrink-0">
                        🏢
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Agoda, SCB TechX"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Branch / Work Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangkok, BTS Asoke"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Contact Person / HR
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Khun Somchai (Lead Talent Acquisition)"
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Job Posting URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.job_url}
                      onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span>📍</span>
                      <span>Address & Workplace Preview</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {form.location ? `${form.location} • ประเทศไทย` : 'กรอกที่อยู่หรือย่านของออฟฟิศ เพื่อบันทึกการเดินทาง'}
                    </p>
                  </div>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.starred}
                      onChange={(e) => setForm({ ...form, starred: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400 h-4 w-4 border-slate-300"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-amber-900 block">⭐ Priority Target Company</span>
                      <span className="text-[10px] text-amber-700">ปักหมุดเป็นบริษัทที่ต้องการเข้าทำงานเป็นอันดับต้นๆ</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
