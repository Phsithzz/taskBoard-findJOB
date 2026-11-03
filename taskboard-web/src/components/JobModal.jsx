import React, { useState, useEffect } from 'react'
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
    url: '',
    notes: '',
    starred: false,
  })

  const [isAddingCustomPlatform, setIsAddingCustomPlatform] = useState(false)
  const [customPlatformInput, setCustomPlatformInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Populate form when modal opens or editingJob changes
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
        url: editingJob.url || '',
        notes: editingJob.notes || '',
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
        url: '',
        notes: '',
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
    e.preventDefault()
    if (!form.title.trim()) {
      setValidationError('กรุณาระบุตำแหน่งงาน (Position Title)')
      return
    }
    if (!form.company.trim()) {
      setValidationError('กรุณาระบุชื่อบริษัท (Company Name)')
      return
    }

    setSubmitting(true)
    setValidationError('')

    let success = false
    if (editingJob) {
      success = await updateJob(editingJob.id, form)
    } else {
      success = await addJob(form)
    }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm">
              {editingJob ? '✏️' : '💼'}
            </span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {editingJob ? 'แก้ไขข้อมูลการสมัครงาน' : 'เพิ่มการสมัครงานใหม่'}
              </h3>
              <p className="text-xs text-slate-400">บันทึกประวัติและขั้นตอนการสมัครงาน</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 text-sm">
          {validationError && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              ⚠️ {validationError}
            </div>
          )}

          {/* Position & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ตำแหน่งงาน (Title) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น Frontend Developer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อบริษัท (Company) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น Agoda, SCB TechX"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Platform Selector with Custom Platform Addition */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                สมัครจากแพลตฟอร์มไหน? (Platform)
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCustomPlatform(!isAddingCustomPlatform)}
                className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                {isAddingCustomPlatform ? 'ยกเลิก' : '+ เพิ่มแอป/เว็บอื่น'}
              </button>
            </div>

            {isAddingCustomPlatform ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="พิมพ์ชื่อ เช่น Fastwork, Indeed, Email โดยตรง"
                  value={customPlatformInput}
                  onChange={(e) => setCustomPlatformInput(e.target.value)}
                  className="flex-1 rounded-lg border border-indigo-300 px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCustomPlatformAdd}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
                >
                  เพิ่ม
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const isSelected = form.platform === platform
                  return (
                    <button
                      type="button"
                      key={platform}
                      onClick={() => setForm({ ...form, platform })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {platform}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Status & Work Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะปัจจุบัน (Status)
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label} ({config.thaiLabel})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รูปแบบการทำงาน (Work Type)
              </label>
              <select
                value={form.work_type}
                onChange={(e) => setForm({ ...form, work_type: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
              >
                <option value="Remote">Remote 🏠</option>
                <option value="Hybrid">Hybrid 🏢/🏠</option>
                <option value="Onsite">Onsite 🏢</option>
              </select>
            </div>
          </div>

          {/* Salary & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เงินเดือน / ค่าตอบแทน (Salary)
              </label>
              <input
                type="text"
                placeholder="เช่น 35k - 45k, ต่อรองได้"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานที่ทำงาน (Location)
              </label>
              <input
                type="text"
                placeholder="เช่น สาทร, BTS อโศก, นนทบุรี"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Job URL & Interview Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ลิงก์ประกาศงาน (Job URL)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันนัดสัมภาษณ์ / วันที่เกี่ยวข้อง
              </label>
              <input
                type="date"
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              บันทึกช่วยจำ (Notes / รายละเอียดการสัมภาษณ์)
            </label>
            <textarea
              rows={3}
              placeholder="เช่น เตรียมตัวพรีเซนต์โปรเจกต์ React+Go, ตอบคำถามเรื่อง Microservices, HR ชื่อคุณเอ๋"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Starred Checkbox */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.starred}
              onChange={(e) => setForm({ ...form, starred: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300"
            />
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              ⭐ ติดดาวไว้เป็นบริษัทสำคัญอันดับแรก (Priority / Starred)
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {submitting && (
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              <span>{editingJob ? 'บันทึกการแก้ไข' : 'เพิ่มการสมัครงาน'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
