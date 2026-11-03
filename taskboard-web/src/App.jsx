import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

// รายการสถานะทั้งหมด สไตล์ตาม UI ในรูปตัวอย่าง (Image 1)
const STATUS_CONFIG = {
  accepted: {
    id: 'accepted',
    label: 'Accepted',
    thaiLabel: 'ได้ Offer / ผ่านการคัดเลือก',
    pillClass: 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    columnBorder: 'border-t-emerald-500',
    columnBg: 'bg-emerald-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 01.8 1.6L14.25 7l2.55 3.4A1 1 0 0116 12H4v5a1 1 0 11-2 0V3z" clipRule="evenodd" />
      </svg>
    ),
  },
  applied: {
    id: 'applied',
    label: 'Applied',
    thaiLabel: 'ยื่นใบสมัครแล้ว',
    pillClass: 'bg-sky-400 text-white shadow-xs hover:bg-sky-500',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    columnBorder: 'border-t-sky-500',
    columnBg: 'bg-sky-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    ),
  },
  interviewing: {
    id: 'interviewing',
    label: 'Interviewing',
    thaiLabel: 'นัดสัมภาษณ์',
    pillClass: 'bg-blue-500 text-white shadow-xs hover:bg-blue-600',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    columnBorder: 'border-t-blue-500',
    columnBg: 'bg-blue-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    ),
  },
  bookmarked: {
    id: 'bookmarked',
    label: 'Bookmarked',
    thaiLabel: 'เล็งไว้ / บันทึกไว้',
    pillClass: 'bg-purple-400 text-white shadow-xs hover:bg-purple-500',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    columnBorder: 'border-t-purple-500',
    columnBg: 'bg-purple-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
    ),
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    thaiLabel: 'ไม่ผ่าน / ปฏิเสธ',
    pillClass: 'bg-rose-400 text-white shadow-xs hover:bg-rose-500',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    columnBorder: 'border-t-rose-500',
    columnBg: 'bg-rose-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
}

// แพลตฟอร์มเริ่มต้นตามที่ผู้ใช้กำหนด
const DEFAULT_PLATFORMS = ['LinkedIn', 'JobsDB', 'JobBKK', 'JobThai']

const App = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Platforms State (รองรับการเพิ่ม custom platform เอง)
  const [platforms, setPlatforms] = useState(() => {
    const saved = localStorage.getItem('taskboard_platforms')
    return saved ? JSON.parse(saved) : DEFAULT_PLATFORMS
  })
  const [newPlatformInput, setNewPlatformInput] = useState('')
  const [showAddPlatform, setShowAddPlatform] = useState(false)

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState('all')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all')
  const [onlyStarred, setOnlyStarred] = useState(false)

  // Dropdown Status Popup บน Card แต่ละใบ
  const [activeDropdownCardId, setActiveDropdownCardId] = useState(null)
  const dropdownRef = useRef(null)

  // Modal State สำหรับ Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    platform: 'LinkedIn',
    work_type: 'Remote',
    salary: '',
    location: '',
    job_url: '',
    status: 'applied',
    due: '',
    desc: '',
    notes: '',
    starred: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Drag & Drop State
  const [draggedJobId, setDraggedJobId] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  // 1. ดึงข้อมูลงานจาก Go Backend
  const fetchTasks = async (signal) => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`${apiUrl}/tasks`, { signal })
      setTasks(res.data || [])
    } catch (err) {
      if (axios.isCancel(err)) return
      setError(err.response?.data?.error || err.message || 'ไม่สามารถโหลดข้อมูลการสมัครงานได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchTasks(controller.signal)
    return () => controller.abort()
  }, [apiUrl])

  // ปิด Status Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdownCardId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // บันทึก custom platforms ลง localStorage
  const handleAddNewPlatform = () => {
    const trimmed = newPlatformInput.trim()
    if (!trimmed) return
    if (!platforms.includes(trimmed)) {
      const updated = [...platforms, trimmed]
      setPlatforms(updated)
      localStorage.setItem('taskboard_platforms', JSON.stringify(updated))
    }
    setFormData((prev) => ({ ...prev, platform: trimmed }))
    setNewPlatformInput('')
    setShowAddPlatform(false)
  }

  // 2. ฟังก์ชันเปิด Modal สร้างงานใหม่ หรือแก้ไข
  const openCreateModal = (defaultStatus = 'applied') => {
    setEditingJob(null)
    setFormData({
      title: '',
      company: '',
      platform: platforms[0] || 'LinkedIn',
      work_type: 'Remote',
      salary: '',
      location: '',
      job_url: '',
      status: defaultStatus,
      due: '',
      desc: '',
      notes: '',
      starred: false,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title || '',
      company: job.company || '',
      platform: job.platform || 'LinkedIn',
      work_type: job.work_type || 'Remote',
      salary: job.salary || '',
      location: job.location || '',
      job_url: job.job_url || '',
      status: (job.status || 'applied').toLowerCase(),
      due: job.due || '',
      desc: job.desc || '',
      notes: job.notes || '',
      starred: !!job.starred,
    })
    setIsModalOpen(true)
  }

  // 3. ฟังก์ชัน Submit Form (Create หรือ Update)
  const handleSubmitJob = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.company.trim()) return

    try {
      setIsSubmitting(true)
      setError(null)

      if (editingJob) {
        // UPDATE
        const res = await axios.put(`${apiUrl}/tasks/${editingJob.id}`, formData)
        setTasks((prev) => prev.map((j) => (j.id === editingJob.id ? { ...j, ...res.data } : j)))
      } else {
        // CREATE
        const res = await axios.post(`${apiUrl}/tasks`, formData)
        setTasks((prev) => [res.data, ...prev])
      }
      setIsModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'บันทึกข้อมูลไม่สำเร็จ')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. ฟังก์ชันเปลี่ยน Status อย่างรวดเร็ว (จาก Dropdown บน Card หรือ Drag&Drop)
  const handleQuickStatusChange = async (job, newStatus) => {
    setActiveDropdownCardId(null)
    if (job.status === newStatus) return

    try {
      const updated = { ...job, status: newStatus }
      const res = await axios.put(`${apiUrl}/tasks/${job.id}`, updated)
      setTasks((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...res.data } : j)))
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'เปลี่ยนสถานะไม่สำเร็จ')
    }
  }

  // 5. Toggle Starred
  const handleToggleStar = async (job) => {
    try {
      const updated = { ...job, starred: !job.starred }
      const res = await axios.put(`${apiUrl}/tasks/${job.id}`, updated)
      setTasks((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...res.data } : j)))
    } catch (err) {
      setError('ไม่สามารถอัปเดตสถานะดาวได้')
    }
  }

  // 6. ฟังก์ชันลบงาน (Delete)
  const handleDeleteJob = async (jobId, companyName) => {
    if (!window.confirm(`คุณแน่ใจว่าต้องการลบการสมัครงานที่ "${companyName}" หรือไม่?`)) return
    try {
      await axios.delete(`${apiUrl}/tasks/${jobId}`)
      setTasks((prev) => prev.filter((j) => j.id !== jobId))
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'ลบข้อมูลไม่สำเร็จ')
    }
  }

  // การกรองงานตาม Search / Filter
  const filteredTasks = tasks.filter((j) => {
    const matchSearch =
      (j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchPlatform = selectedPlatformFilter === 'all' || j.platform === selectedPlatformFilter
    const matchStatus = selectedStatusFilter === 'all' || (j.status || '').toLowerCase() === selectedStatusFilter
    const matchStar = !onlyStarred || j.starred
    return matchSearch && matchPlatform && matchStatus && matchStar
  })

  // สถิติสรุป
  const stats = {
    total: tasks.length,
    interviewing: tasks.filter((t) => (t.status || '').toLowerCase() === 'interviewing').length,
    accepted: tasks.filter((t) => (t.status || '').toLowerCase() === 'accepted').length,
    applied: tasks.filter((t) => (t.status || '').toLowerCase() === 'applied').length,
  }

  // Drag & Drop
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id)
    setDraggedJobId(id)
  }
  const handleDragOver = (e, statusId) => {
    e.preventDefault()
    setDragOverColumn(statusId)
  }
  const handleDrop = (e, targetStatus) => {
    e.preventDefault()
    setDragOverColumn(null)
    const id = e.dataTransfer.getData('text/plain') || draggedJobId
    setDraggedJobId(null)
    const target = tasks.find((t) => String(t.id) === String(id))
    if (target && target.status !== targetStatus) {
      handleQuickStatusChange(target, targetStatus)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fe] text-slate-800 font-sans">
      {/* Top Header Bar ตามรูปภาพที่ 1 & 4 */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-sm font-black text-base tracking-wider">
                JH
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight">JobHunt Tracker</span>
                <span className="hidden sm:inline-block ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  2026
                </span>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500 border-l border-slate-200 pl-4">
              <span>
                ยื่นแล้ว: <strong className="text-slate-800 font-semibold">{stats.total}</strong>
              </span>
              <span>•</span>
              <span>
                นัดสัมภาษณ์: <strong className="text-blue-600 font-semibold">{stats.interviewing}</strong>
              </span>
              <span>•</span>
              <span>
                Offers: <strong className="text-emerald-600 font-semibold">{stats.accepted}</strong>
              </span>
            </div>
          </div>

          {/* Action & User Profile Avatar (ดึงจาก portfolio) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => openCreateModal('applied')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ New Job Application</span>
            </button>

            {/* Profile Avatar */}
            <div className="relative group cursor-pointer">
              <img
                src="/profile.jpg"
                alt="Phoosith Profile"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-xs"
              />
              <div className="hidden h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-xs items-center justify-center ring-2 ring-indigo-300">
                P
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar ตามตัวอย่างในรูปที่ 1 */}
        <div className="border-t border-slate-100 bg-white/70 backdrop-blur-xs px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <svg className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="ค้นหาตำแหน่ง, บริษัท, หรือคำสัมภาษณ์..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-9 pr-3 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Platform & Status Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">ตัวกรอง:</span>

              {/* Platform Selector */}
              <select
                value={selectedPlatformFilter}
                onChange={(e) => setSelectedPlatformFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1.5 text-slate-600 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">ทุกแอป / แพลตฟอร์ม</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Status Selector */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1.5 text-slate-600 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">ทุกสถานะ</option>
                {Object.values(STATUS_CONFIG).map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label} ({st.thaiLabel})
                  </option>
                ))}
              </select>

              {/* Starred Filter */}
              <button
                onClick={() => setOnlyStarred(!onlyStarred)}
                className={`flex items-center space-x-1 rounded-lg border px-2.5 py-1.5 transition ${
                  onlyStarred ? 'border-amber-300 bg-amber-50 text-amber-700 font-semibold' : 'border-slate-200 bg-slate-50/60 text-slate-600'
                }`}
              >
                <span>★</span>
                <span>ติดดาว</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Board Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-3">
            <svg className="h-8 w-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-xs text-slate-500 font-medium">กำลังโหลดกระดานสมัครงาน...</span>
          </div>
        ) : (
          /* Kanban Columns View (5 Columns) */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 items-start">
            {Object.values(STATUS_CONFIG).map((col) => {
              const columnJobs = filteredTasks.filter(
                (j) => (j.status || 'applied').toLowerCase() === col.id
              )
              const isOver = dragOverColumn === col.id

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={() => setDragOverColumn(null)}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/60 p-3.5 transition-all ${
                    col.columnBorder
                  } border-t-4 ${isOver ? 'ring-2 ring-indigo-400 bg-indigo-50/30' : ''}`}
                >
                  {/* Column Header */}
                  <div className="mb-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-800 text-xs tracking-tight">{col.label}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({columnJobs.length})</span>
                    </div>

                    <button
                      onClick={() => openCreateModal(col.id)}
                      title={`เพิ่มงานใน ${col.label}`}
                      className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-indigo-600 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-3 min-h-[300px]">
                    {columnJobs.length === 0 ? (
                      <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 p-4 text-center text-[11px] text-slate-400">
                        ลากใบสมัครมาวางที่นี่
                      </div>
                    ) : (
                      columnJobs.map((job) => {
                        const statusObj = STATUS_CONFIG[(job.status || 'applied').toLowerCase()] || STATUS_CONFIG.applied

                        return (
                          <div
                            key={job.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, job.id)}
                            className="group relative rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition hover:shadow-md cursor-grab active:cursor-grabbing hover:border-slate-300"
                          >
                            {/* Card Top: Position & Status Pill (เหมือนรูปตัวอย่างที่ 1) */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-slate-900 text-sm leading-snug tracking-tight">
                                  {job.title || 'ไม่ระบุตำแหน่ง'}
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                                  <span>{job.company || 'ไม่ระบุบริษัท'}</span>
                                  {job.location && (
                                    <span className="text-[10px] text-slate-400 font-normal">({job.location})</span>
                                  )}
                                </p>
                              </div>

                              {/* Status Dropdown Trigger Pill */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveDropdownCardId(activeDropdownCardId === job.id ? null : job.id)
                                  }}
                                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${statusObj.pillClass} cursor-pointer`}
                                >
                                  {statusObj.icon}
                                  <span>{statusObj.label}</span>
                                  <svg className="w-2.5 h-2.5 ml-0.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {/* Dropdown Menu ตามรูปตัวอย่างที่ 1 */}
                                {activeDropdownCardId === job.id && (
                                  <div
                                    ref={dropdownRef}
                                    className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100"
                                  >
                                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                                      เปลี่ยนสถานะ
                                    </div>
                                    <div className="space-y-1 mt-1">
                                      {Object.values(STATUS_CONFIG).map((s) => (
                                        <button
                                          key={s.id}
                                          type="button"
                                          onClick={() => handleQuickStatusChange(job, s.id)}
                                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
                                            (job.status || '').toLowerCase() === s.id
                                              ? `${s.pillClass}`
                                              : 'text-slate-600 hover:bg-slate-50'
                                          }`}
                                        >
                                          <div className="flex items-center gap-1.5">
                                            {s.icon}
                                            <span>{s.label}</span>
                                          </div>
                                          {(job.status || '').toLowerCase() === s.id && (
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Tags: Platform & WorkType (Remote / Hybrid) */}
                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              {/* Platform Badge */}
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                {job.platform || 'LinkedIn'}
                              </span>

                              {/* Work Type Badge */}
                              {job.work_type && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                                  <span>🏠</span>
                                  <span>{job.work_type}</span>
                                </span>
                              )}

                              {/* Salary Badge */}
                              {job.salary && (
                                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                  💰 {job.salary}
                                </span>
                              )}
                            </div>

                            {/* Notes Snippet (เหมือนในรูป 1) */}
                            {job.notes && (
                              <div className="mt-2.5 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 line-clamp-2">
                                <span className="font-semibold text-slate-500">Notes:</span> {job.notes}
                              </div>
                            )}

                            {/* Card Footer: Saved Date & Action Buttons (Star, Edit, Delete, Link) */}
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
                              <span>
                                {job.due ? `สัมภาษณ์: ${job.due}` : `บันทึกเมื่อ ${job.created_at || 'ไม่ระบุ'}`}
                              </span>

                              <div className="flex items-center space-x-1.5">
                                {/* Job Link */}
                                {job.job_url && (
                                  <a
                                    href={job.job_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="เปิดลิงก์ประกาศงาน"
                                    className="p-1 hover:text-indigo-600 transition"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}

                                {/* Star Button */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleStar(job)}
                                  title="ติดดาว"
                                  className={`p-1 transition ${job.starred ? 'text-amber-500' : 'hover:text-amber-500'}`}
                                >
                                  ★
                                </button>

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => openEditModal(job)}
                                  title="แก้ไข"
                                  className="p-1 hover:text-indigo-600 transition"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteJob(job.id, job.company)}
                                  title="ลบ"
                                  className="p-1 hover:text-rose-600 transition"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal เพิ่ม / แก้ไข การสมัครงาน */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingJob ? 'แก้ไขข้อมูลการสมัครงาน' : 'เพิ่มใบสมัครงานใหม่'}
                </h3>
                <p className="text-xs text-slate-500">บันทึกรายละเอียดเพื่อติดตามความคืบหน้า</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="mt-4 space-y-4">
              {/* Row 1: Position & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ตำแหน่งที่สมัคร *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น Junior Go Backend Developer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อบริษัท *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น Agoda, SCB TechX, LINE MAN"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 2: Platform (แอปที่ใช้สมัคร พร้อมตัวเลือกเพิ่มประเภทใหม่) & Work Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      สมัครผ่านแพลตฟอร์ม / แอป
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddPlatform(!showAddPlatform)}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline"
                    >
                      {showAddPlatform ? 'ปิด' : '+ เพิ่มแอปอื่น'}
                    </button>
                  </div>

                  {showAddPlatform ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="พิมพ์ชื่อแอปใหม่..."
                        value={newPlatformInput}
                        onChange={(e) => setNewPlatformInput(e.target.value)}
                        className="flex-1 rounded-xl border border-indigo-300 px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewPlatform}
                        className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.platform}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowAddPlatform(true)
                        } else {
                          setFormData({ ...formData, platform: e.target.value })
                        }
                      }}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white focus:border-indigo-500 focus:outline-none"
                    >
                      {platforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                      <option value="custom">+ เพิ่มแอปอื่นที่ไม่มีในนี้...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    รูปแบบการทำงาน
                  </label>
                  <select
                    value={formData.work_type}
                    onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Remote">Remote 100%</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Salary & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ช่วงเงินเดือนที่ระบุ / คาดหวัง
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 30,000 - 45,000"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ทำเล / สถานที่ตั้ง
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น BTS เพลินจิต, สีลม"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Status & Due/Interview Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    สถานะการสมัคร
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    {Object.values(STATUS_CONFIG).map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label} ({st.thaiLabel})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    วันนัดสัมภาษณ์ / กำหนดการ
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 15 Nov เวลา 14:00"
                    value={formData.due}
                    onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Job URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ลิงก์ประกาศรับสมัครงาน
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/jobs/..."
                  value={formData.job_url}
                  onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Row 6: Notes (คำถามสัมภาษณ์ & จุดสังเกต) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  โน้ตสัมภาษณ์ / รายละเอียดสำคัญ
                </label>
                <textarea
                  rows={3}
                  placeholder="จดคำถามที่โดนถาม, Tech Stack ที่เขาเน้น, หรือสิ่งที่ต้องเตรียมตัว..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* Starred Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="starredCheckbox"
                  checked={formData.starred}
                  onChange={(e) => setFormData({ ...formData, starred: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="starredCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                  ⭐ ติดดาวบริษัทนี้เป็นพิเศษ (Favorite / High Priority)
                </label>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.company.trim()}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
                >
                  {isSubmitting ? 'กำลังบันทึก...' : editingJob ? 'บันทึกการแก้ไข' : 'เพิ่มใบสมัคร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
