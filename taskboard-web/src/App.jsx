import { useEffect, useState } from 'react'
import axios from 'axios'

// สถานะและข้อมูลของแต่ละ Column ใน Kanban Board
const COLUMNS = [
  {
    id: 'planned',
    title: 'วางแผนไว้',
    subtitle: 'Planned',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    headerBorder: 'border-t-blue-500',
    bgDrop: 'hover:bg-blue-50/40',
  },
  {
    id: 'pending',
    title: 'กำลังดำเนินการ',
    subtitle: 'In Progress',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    headerBorder: 'border-t-amber-500',
    bgDrop: 'hover:bg-amber-50/40',
  },
  {
    id: 'completed',
    title: 'เสร็จสิ้น',
    subtitle: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    headerBorder: 'border-t-emerald-500',
    bgDrop: 'hover:bg-emerald-50/40',
  },
]

const App = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State สำหรับฟอร์มเพิ่มงานใหม่
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [due, setDue] = useState('')
  const [newStatus, setNewStatus] = useState('planned')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // State สำหรับ Edit Modal
  const [editingTask, setEditingTask] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // State สำหรับ Card ที่กำลังลบ/อัปเดตสถานะ
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // Drag & Drop State
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  // 1. ดึงรายการงานตอนโหลดหน้าเว็บ
  useEffect(() => {
    const controller = new AbortController()

    const fetchTasks = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`${apiUrl}/tasks`, {
          signal: controller.signal,
        })
        setTasks(response.data)
      } catch (err) {
        if (axios.isCancel(err)) return
        setError(err.response?.data?.error || err.message || 'Failed to fetch tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()

    return () => {
      controller.abort()
    }
  }, [apiUrl])

  // 2. ฟังก์ชันเพิ่มงานใหม่ (Create)
  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await axios.post(`${apiUrl}/tasks`, {
        title: title.trim(),
        desc: desc.trim(),
        due: due.trim(),
        status: newStatus,
      })

      setTasks((prev) => [response.data, ...prev])

      // เคลียร์ฟอร์ม
      setTitle('')
      setDesc('')
      setDue('')
      setNewStatus('planned')
      setShowAddForm(false)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add task')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. ฟังก์ชันอัปเดตสถานะงาน (Update Status) เช่น เลื่อนสถานะ หรือ Drag & Drop
  const updateTaskStatus = async (task, targetStatus) => {
    if (task.status === targetStatus) return

    try {
      setActionLoadingId(task.id)
      setError(null)

      const updatedData = {
        title: task.title,
        desc: task.desc,
        due: task.due,
        status: targetStatus,
      }

      const response = await axios.put(`${apiUrl}/tasks/${task.id}`, updatedData)

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, ...response.data } : t))
      )
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update task status')
    } finally {
      setActionLoadingId(null)
    }
  }

  // 4. ฟังก์ชันบันทึกการแก้ไขงานทั้งหมด (Update Full Task) จาก Modal
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingTask || !editingTask.title.trim()) return

    try {
      setIsUpdating(true)
      setError(null)

      const response = await axios.put(`${apiUrl}/tasks/${editingTask.id}`, {
        title: editingTask.title.trim(),
        desc: editingTask.desc.trim(),
        due: editingTask.due.trim(),
        status: editingTask.status,
      })

      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...response.data } : t))
      )
      setEditingTask(null)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save task updates')
    } finally {
      setIsUpdating(false)
    }
  }

  // 5. ฟังก์ชันลบงาน (Delete)
  const deleteTask = async (taskId, taskTitle) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${taskTitle}"?`)) {
      return
    }

    try {
      setActionLoadingId(taskId)
      setError(null)

      await axios.delete(`${apiUrl}/tasks/${taskId}`)

      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete task')
    } finally {
      setActionLoadingId(null)
    }
  }

  // ดึงรายการงานตามสถานะของแต่ละ Column
  const getTasksByStatus = (statusId) => {
    return tasks.filter((t) => {
      const s = (t.status || 'planned').toLowerCase()
      if (statusId === 'planned') return s === 'planned' || s === 'plan'
      if (statusId === 'pending') return s === 'pending' || s === 'in progress'
      if (statusId === 'completed') return s === 'completed' || s === 'done'
      return s === statusId
    })
  }

  // Drag & Drop Handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId)
    setDraggedTaskId(taskId)
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId)
    }
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault()
    setDragOverColumn(null)
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    setDraggedTaskId(null)

    if (!taskId) return
    const task = tasks.find((t) => String(t.id) === String(taskId))
    if (task && task.status !== targetStatus) {
      await updateTaskStatus(task, targetStatus)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm font-bold text-lg">
              TB
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">TaskBoard Kanban</h1>
              <p className="text-xs text-slate-500">Full-Stack Go + React + MongoDB</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showAddForm ? 'ปิดฟอร์ม' : 'เพิ่มงานใหม่'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 flex items-start justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-xs">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-sm">
              ✕
            </button>
          </div>
        )}

        {/* Collapsible Add Task Form */}
        {showAddForm && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">สร้างงานใหม่เข้าสู่บอร์ด</h2>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={addTask} className="mt-4">
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-medium text-slate-600 mb-1">ชื่องาน *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ออกแบบระบบ Database, ทำหน้าบ้าน"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">รายละเอียดงาน</label>
                  <input
                    type="text"
                    placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">กำหนดส่ง</label>
                  <input
                    type="text"
                    placeholder="เช่น 15 Nov หรือ 2026-11-15"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-slate-600">เริ่มต้นที่สถานะ:</span>
                  <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                    {COLUMNS.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setNewStatus(col.id)}
                        className={`rounded-md px-2.5 py-1 font-medium transition ${
                          newStatus === col.id ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {col.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim()}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกงาน'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-sm font-medium text-slate-500">กำลังเชื่อมต่อฐานข้อมูล MongoDB...</span>
            </div>
          </div>
        )}

        {/* Kanban Board Columns Grid */}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-3">
            {COLUMNS.map((column) => {
              const columnTasks = getTasksByStatus(column.id)
              const isOver = dragOverColumn === column.id

              return (
                <div
                  key={column.id}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition ${
                    column.headerBorder
                  } border-t-4 ${isOver ? 'ring-2 ring-blue-400 bg-blue-50/30' : ''}`}
                >
                  {/* Column Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-bold text-slate-800">{column.title}</h2>
                      <span className="text-xs text-slate-400 font-normal">({column.subtitle})</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${column.badgeClass}`}>
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Task Cards Container */}
                  <div className="flex-1 space-y-3 min-h-[350px]">
                    {columnTasks.length === 0 ? (
                      <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                        ลากการ์ดมาวางที่นี่ หรือเพิ่มงานใหม่
                      </div>
                    ) : (
                      columnTasks.map((t) => {
                        const isActionLoading = actionLoadingId === t.id

                        return (
                          <div
                            key={t.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, t.id)}
                            className={`group relative rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:shadow-md cursor-grab active:cursor-grabbing ${
                              isActionLoading ? 'opacity-50 pointer-events-none' : ''
                            }`}
                          >
                            {/* Card Header & ID */}
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[11px] font-mono text-slate-400">
                                #{String(t.id).slice(-6)}
                              </span>

                              {/* Action Buttons: Edit & Delete */}
                              <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                                <button
                                  onClick={() => setEditingTask({ ...t })}
                                  title="แก้ไขงาน"
                                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteTask(t.id, t.title)}
                                  title="ลบงาน"
                                  className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Card Title & Desc */}
                            <h3 className="mt-1 text-sm font-semibold text-slate-800 leading-snug">{t.title}</h3>
                            {t.desc && <p className="mt-1 text-xs text-slate-600 line-clamp-3">{t.desc}</p>}

                            {/* Card Footer: Due Date & Quick Move */}
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                              {t.due ? (
                                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{t.due}</span>
                                </div>
                              ) : (
                                <span></span>
                              )}

                              {/* Quick Move Status Selector */}
                              <select
                                value={column.id}
                                onChange={(e) => updateTaskStatus(t, e.target.value)}
                                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                <option value="planned">ย้ายไป: วางแผนไว้</option>
                                <option value="pending">ย้ายไป: กำลังทำ</option>
                                <option value="completed">ย้ายไป: เสร็จสิ้น</option>
                              </select>
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

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">แก้ไขข้อมูลงาน</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่องาน *</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">รายละเอียดงาน</label>
                <textarea
                  rows={3}
                  value={editingTask.desc}
                  onChange={(e) => setEditingTask({ ...editingTask, desc: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">กำหนดส่ง</label>
                  <input
                    type="text"
                    placeholder="เช่น 15 Nov"
                    value={editingTask.due}
                    onChange={(e) => setEditingTask({ ...editingTask, due: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">สถานะ</label>
                  <select
                    value={editingTask.status || 'planned'}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="planned">วางแผนไว้ (Planned)</option>
                    <option value="pending">กำลังดำเนินการ (In Progress)</option>
                    <option value="completed">เสร็จสิ้น (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !editingTask.title.trim()}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isUpdating ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
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
