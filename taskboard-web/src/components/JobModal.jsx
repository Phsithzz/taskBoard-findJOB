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
    setValidationError('')
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
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl rounded-2xl bg-white border-[3px] border-black shadow-[10px_10px_0px_#000000] overflow-hidden my-auto cursor-default"
          >
            <div className="flex items-center justify-between px-6 py-3.5 border-b-[2.5px] border-black bg-black text-white font-mono">
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
                  className="rounded-lg border-2 border-white px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white hover:text-black transition cursor-pointer"
                >
                  DRAFT
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="rounded-lg bg-[#C6FF33] text-black border-2 border-black px-4 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_#C6FF33] hover:bg-[#bbf426] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? (
                    <ClipLoader size={12} color="#000000" />
                  ) : (
                    <>
                      <span>{editingJob ? 'UPDATE' : 'PUBLISH'}</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto font-mono">
              {validationError && (
                <div className="mb-6 rounded-xl bg-rose-100 border-2 border-black p-3.5 text-xs font-bold text-black flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                  <span>⚠️</span>
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <h1 className="text-2xl font-black text-black tracking-tight uppercase">
                    {editingJob ? 'EDIT APPLICATION' : 'CREATE JOB RECORD'}
                  </h1>

                  <div>
                    <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                      Job Title <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Frontend Developer"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-lg border-2 border-black px-3.5 py-2.5 text-xs font-bold text-black focus:ring-2 focus:ring-[#7D39EB] outline-none shadow-[2px_2px_0px_#000]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-black text-black uppercase tracking-wider">
                        Source Platform
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomPlatform(!isAddingCustomPlatform)}
                        className="text-xs font-black text-[#7D39EB] underline hover:text-black cursor-pointer"
                      >
                        {isAddingCustomPlatform ? 'Cancel' : '+ ADD OTHER'}
                      </button>
                    </div>

                    {isAddingCustomPlatform ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="เช่น Fastwork, Indeed, Direct Email"
                          value={customPlatformInput}
                          onChange={(e) => setCustomPlatformInput(e.target.value)}
                          className="flex-1 rounded-lg border-2 border-black px-3 py-2 text-xs font-bold outline-none shadow-[2px_2px_0px_#000]"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleCustomPlatformAdd}
                          className="rounded-lg bg-[#C6FF33] text-black border-2 border-black px-4 py-2 text-xs font-black hover:bg-[#bbf426] transition cursor-pointer shadow-[2px_2px_0px_#000]"
                        >
                          ADD
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
                              className={`rounded-lg px-3 py-1.5 text-xs font-black border-2 border-black uppercase transition cursor-pointer ${
                                isSelected
                                  ? 'bg-[#C6FF33] text-black shadow-[2px_2px_0px_#000]'
                                  : 'bg-white text-black hover:bg-slate-100 shadow-[1px_1px_0px_#000]'
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
                    <label className="block text-xs font-black text-black uppercase tracking-wider mb-2.5">
                      Work Arrangement
                    </label>
                    <div className="flex flex-wrap items-center gap-6 text-xs text-black font-bold">
                      {['Remote', 'Hybrid', 'Onsite'].map((type) => {
                        const isSelected = form.work_type === type
                        return (
                          <label
                            key={type}
                            onClick={() => setForm({ ...form, work_type: type })}
                            className="flex items-center gap-2 cursor-pointer select-none group"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                        Deadline / Interview Date
                      </label>
                      <input
                        type="date"
                        value={form.due}
                        onChange={(e) => setForm({ ...form, due: e.target.value })}
                        className="w-full rounded-lg border-2 border-black px-3 py-2 text-xs font-bold text-black outline-none bg-white shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full rounded-lg border-2 border-black px-3 py-2 text-xs font-black text-black outline-none bg-white cursor-pointer shadow-[2px_2px_0px_#000] uppercase"
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
                    <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                      Compensation Rate (THB)
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-[11px] font-black text-slate-500">
                          THB
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. 35,000 - 55,000"
                          value={form.salary}
                          onChange={(e) => setForm({ ...form, salary: e.target.value })}
                          className="w-full rounded-lg border-2 border-black py-2 pl-12 pr-3 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
                        />
                      </div>
                      <span className="text-xs font-black text-black rounded-lg bg-black text-white px-3 py-2 border-2 border-black">
                        /MONTH
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                      Description & Notes
                    </label>
                    <div className="rounded-xl border-2 border-black overflow-hidden shadow-[2px_2px_0px_#000]">
                      <div className="flex items-center gap-2 border-b-2 border-black bg-slate-100 px-3 py-1.5 text-xs font-black">
                        <span className="px-1.5 py-0.5 hover:bg-black hover:text-white rounded cursor-pointer">B</span>
                        <span className="px-1.5 py-0.5 hover:bg-black hover:text-white rounded cursor-pointer">I</span>
                        <span className="px-1.5 py-0.5 hover:bg-black hover:text-white rounded cursor-pointer">U</span>
                        <span className="border-l border-black h-3 mx-1"></span>
                        <span className="text-[10px] text-slate-500 uppercase">Interview Prep / Notes</span>
                      </div>
                      <textarea
                        rows={4}
                        placeholder="รายละเอียดงาน, สิ่งที่ต้องเตรียมตัวตอบคำถามสัมภาษณ์, ข้อมูลโปรเจกต์..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full p-3 text-xs font-bold text-black outline-none resize-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-xl border-2 border-black bg-slate-50 p-5 space-y-4.5 shadow-[4px_4px_0px_#000000]">
                    <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
                      <h2 className="font-black text-black text-sm uppercase">
                        Employer Details
                      </h2>
                      <span className="text-[10px] font-black text-slate-500 uppercase">
                        Company Info
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1.5">
                        Company <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-[#C6FF33] border-2 border-black font-black text-sm shadow-[1.5px_1.5px_0px_#000] shrink-0">
                          🏢
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Agoda, SCB TechX"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="flex-1 rounded-lg border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1.5">
                        Work Location / Branch
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bangkok, BTS Asoke"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1.5">
                        Contact Person / HR
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Khun Somchai (HR Lead)"
                        value={form.desc}
                        onChange={(e) => setForm({ ...form, desc: e.target.value })}
                        className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase mb-1.5">
                        Job Posting Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={form.job_url}
                        onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                        className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 p-3 rounded-lg bg-[#C6FF33]/40 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.starred}
                        onChange={(e) => setForm({ ...form, starred: e.target.checked })}
                        className="h-4 w-4 border-2 border-black rounded accent-black"
                      />
                      <div className="text-xs">
                        <span className="font-black text-black block uppercase">⭐ PRIORITY TARGET</span>
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
