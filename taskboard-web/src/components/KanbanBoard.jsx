import React, { useMemo } from 'react'
import { useJobStore } from '../stores/useJobStore'
import { STATUS_CONFIG } from '../constants/statusConfig'
import { KanbanColumn } from './KanbanColumn'

const COLUMN_KEYS = ['bookmarked', 'applied', 'interviewing', 'accepted', 'rejected']

export const KanbanBoard = () => {
  const jobs = useJobStore((state) => state.jobs)
  const loading = useJobStore((state) => state.loading)
  const error = useJobStore((state) => state.error)
  const searchQuery = useJobStore((state) => state.searchQuery)
  const selectedPlatformFilter = useJobStore((state) => state.selectedPlatformFilter)
  const selectedStatusFilter = useJobStore((state) => state.selectedStatusFilter)
  const onlyStarred = useJobStore((state) => state.onlyStarred)
  const dragOverColumn = useJobStore((state) => state.dragOverColumn)
  const setDragOverColumn = useJobStore((state) => state.setDragOverColumn)
  const updateJobStatus = useJobStore((state) => state.updateJobStatus)
  const fetchJobs = useJobStore((state) => state.fetchJobs)

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (job.title || '').toLowerCase().includes(q)
        const matchCompany = (job.company || '').toLowerCase().includes(q)
        const matchNotes = (job.notes || '').toLowerCase().includes(q)
        const matchPlatform = (job.platform || '').toLowerCase().includes(q)
        if (!matchTitle && !matchCompany && !matchNotes && !matchPlatform) {
          return false
        }
      }

      if (selectedPlatformFilter !== 'all') {
        if ((job.platform || 'LinkedIn') !== selectedPlatformFilter) {
          return false
        }
      }

      if (onlyStarred && !job.starred) {
        return false
      }

      return true
    })
  }, [jobs, searchQuery, selectedPlatformFilter, onlyStarred])

  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData('text/plain', jobId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, statusKey) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== statusKey) {
      setDragOverColumn(statusKey)
    }
  }

  const handleDragLeave = (e, statusKey) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    if (dragOverColumn === statusKey) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e, targetStatus) => {
    e.preventDefault()
    setDragOverColumn(null)
    const jobId = e.dataTransfer.getData('text/plain')
    if (!jobId) return

    const jobToMove = jobs.find((j) => j.id === jobId)
    if (jobToMove && jobToMove.status !== targetStatus) {
      updateJobStatus(jobToMove, targetStatus)
    }
  }

  const activeColumns = useMemo(() => {
    if (selectedStatusFilter !== 'all') {
      return COLUMN_KEYS.filter((k) => k === selectedStatusFilter)
    }
    return COLUMN_KEYS
  }, [selectedStatusFilter])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <svg className="w-8 h-8 animate-spin text-indigo-600 mb-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm font-medium">กำลังโหลดข้อมูลการสมัครงาน...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchJobs()}
            className="text-xs font-semibold text-rose-700 underline hover:no-underline cursor-pointer"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 px-1">
        {activeColumns.map((colKey) => {
          const columnJobs = filteredJobs.filter(
            (job) => (job.status || 'applied').toLowerCase() === colKey
          )

          return (
            <KanbanColumn
              key={colKey}
              statusKey={colKey}
              jobs={columnJobs}
              isDragOver={dragOverColumn === colKey}
              onDragStart={handleDragStart}
              onDragOver={(e) => handleDragOver(e, colKey)}
              onDragLeave={(e) => handleDragLeave(e, colKey)}
              onDrop={(e) => handleDrop(e, colKey)}
            />
          )
        })}
      </div>
    </div>
  )
}
