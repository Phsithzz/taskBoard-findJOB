import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State สำหรับฟอร์มเพิ่มงานใหม่
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [due, setDue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ดึงรายการงานตอนโหลดหน้าเว็บ
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

  // ฟังก์ชันเพิ่มงานใหม่
  const addTask = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // ส่งข้อมูลเป็น Object ตามโครงสร้างที่ Go Backend ต้องการ
      const response = await axios.post(`${apiUrl}/tasks`, {
        title: title.trim(),
        desc: desc.trim(),
        due: due.trim(),
      })

      // อัปเดต Task ใหม่เข้าไปใน state ทันที โดยไม่ต้อง fetch ใหม่ทั้งก้อน
      setTasks((prev) => [response.data, ...prev])

      // เคลียร์ฟอร์ม
      setTitle('')
      setDesc('')
      setDue('')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">TaskBoard</h1>
            <p className="mt-1 text-sm text-slate-500">จัดการงานและติดตามสถานะโปรเจกต์ของคุณ</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </span>
        </header>

        {/* ฟอร์มสร้าง Task ใหม่ */}
        <form onSubmit={addTask} className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">เพิ่มงานใหม่</h2>
          <div className="grid gap-3 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <input
                type="text"
                placeholder="ชื่องาน * (เช่น ออกแบบหน้าเว็บ)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="รายละเอียดงาน"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="text"
                placeholder="กำหนดส่ง (เช่น 10 Nov)"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition"
            >
              {isSubmitting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  กำลังเพิ่ม...
                </>
              ) : (
                'เพิ่มงาน'
              )}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex h-48 items-center justify-center">
            <div className="flex items-center space-x-2 text-slate-500">
              <svg className="h-5 w-5 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-sm font-medium">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700 mb-6">
            <p className="font-semibold text-sm">เกิดข้อผิดพลาด:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-sm text-slate-500">ยังไม่มีงานในระบบ ลองเพิ่มงานแรกของคุณด้านบนได้เลย!</p>
          </div>
        )}

        {/* Task Cards */}
        {!loading && tasks.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">#{String(t.id).slice(-6)}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        t.status?.toLowerCase() === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                          : t.status?.toLowerCase() === 'pending'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                          : 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10'
                      }`}
                    >
                      {t.status || 'planned'}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-800">{t.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{t.desc || 'ไม่มีรายละเอียด'}</p>
                </div>

                {t.due && (
                  <div className="mt-4 flex items-center border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="font-medium text-slate-400 mr-1.5">กำหนดส่ง:</span>
                    <span>{t.due}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
