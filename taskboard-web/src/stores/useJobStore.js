import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-toastify'
import confetti from 'canvas-confetti'
import { jobApi } from '../services/api'
import { DEFAULT_PLATFORMS } from '../constants/statusConfig'

export const useJobStore = create((set, get) => ({
  jobs: [],
  loading: true,
  error: null,

  platforms: (() => {
    try {
      const saved = localStorage.getItem('taskboard_platforms')
      return saved ? JSON.parse(saved) : DEFAULT_PLATFORMS
    } catch {
      return DEFAULT_PLATFORMS
    }
  })(),

  searchQuery: '',
  selectedPlatformFilter: 'all',
  selectedStatusFilter: 'all',
  onlyStarred: false,

  isModalOpen: false,
  editingJob: null,
  activeDropdownId: null,
  dragOverColumn: null,

  fetchJobs: async (signal) => {
    try {
      set({ loading: true, error: null })
      const res = await jobApi.getAll(signal)
      set({ jobs: res.data || [], loading: false })
    } catch (err) {
      if (axios.isCancel(err)) return
      const msg = err.response?.data?.error || err.message || 'ไม่สามารถโหลดข้อมูลการสมัครงานได้'
      set({ error: msg, loading: false })
      toast.error(msg)
    }
  },

  addJob: async (formData) => {
    try {
      set({ error: null })
      const res = await jobApi.create(formData)
      set((state) => ({ jobs: [res.data, ...state.jobs], isModalOpen: false }))
      toast.success(`🎉 บันทึกการสมัครงาน "${formData.title}" เรียบร้อย!`)
      return true
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'บันทึกข้อมูลไม่สำเร็จ'
      set({ error: msg })
      toast.error(msg)
      return false
    }
  },

  updateJob: async (id, formData) => {
    try {
      set({ error: null })
      const res = await jobApi.update(id, formData)
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...res.data } : j)),
        isModalOpen: false,
        editingJob: null,
      }))
      toast.success('✨ อัปเดตข้อมูลการสมัครงานเรียบร้อย!')
      return true
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'บันทึกข้อมูลไม่สำเร็จ'
      set({ error: msg })
      toast.error(msg)
      return false
    }
  },

  updateJobStatus: async (job, newStatus) => {
    set({ activeDropdownId: null })
    if (job.status === newStatus) return

    try {
      const updated = { ...job, status: newStatus }
      const res = await jobApi.update(job.id, updated)
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === job.id ? { ...j, ...res.data } : j)),
      }))

      if (newStatus === 'accepted') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#50bfa0', '#34d399', '#6ee7b7', '#10b981', '#fbbf24'],
        })
        toast.success(`🏆 ยินดีด้วย! คุณผ่านการคัดเลือกที่ "${job.company}" แล้ว!`)
      } else {
        toast.info(`📋 ย้ายไปยังสถานะ "${newStatus.toUpperCase()}"`)
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'เปลี่ยนสถานะไม่สำเร็จ'
      set({ error: msg })
      toast.error(msg)
    }
  },

  toggleStar: async (job) => {
    try {
      const updated = { ...job, starred: !job.starred }
      const res = await jobApi.update(job.id, updated)
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === job.id ? { ...j, ...res.data } : j)),
      }))
      if (updated.starred) {
        toast.info(`⭐ ติดดาว "${job.company}" ในรายการสำคัญแล้ว`)
      }
    } catch {
      toast.error('ไม่สามารถอัปเดตสถานะดาวได้')
    }
  },

  deleteJob: async (jobId, companyName) => {
    if (!window.confirm(`คุณแน่ใจว่าต้องการลบการสมัครงานที่ "${companyName}" หรือไม่?`)) return
    try {
      await jobApi.delete(jobId)
      set((state) => ({ jobs: state.jobs.filter((j) => j.id !== jobId) }))
      toast.warn(`🗑️ ลบข้อมูลการสมัครงานที่ "${companyName}" เรียบร้อย`)
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'ลบข้อมูลไม่สำเร็จ'
      set({ error: msg })
      toast.error(msg)
    }
  },

  addCustomPlatform: (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const { platforms } = get()
    if (!platforms.includes(trimmed)) {
      const updated = [...platforms, trimmed]
      set({ platforms: updated })
      localStorage.setItem('taskboard_platforms', JSON.stringify(updated))
      toast.success(`เพิ่มแพลตฟอร์ม "${trimmed}" เรียบร้อย`)
    }
  },

  openCreateModal: (defaultStatus = 'applied') => {
    set({
      editingJob: null,
      isModalOpen: true,
      error: null,
    })
  },

  openEditModal: (job) => {
    set({
      editingJob: job,
      isModalOpen: true,
      error: null,
    })
  },

  closeModal: () => {
    set({ isModalOpen: false, editingJob: null })
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedPlatformFilter: (p) => set({ selectedPlatformFilter: p }),
  setSelectedStatusFilter: (s) => set({ selectedStatusFilter: s }),
  toggleOnlyStarred: () => set((state) => ({ onlyStarred: !state.onlyStarred })),
  setActiveDropdownId: (id) => set({ activeDropdownId: id }),
  setDragOverColumn: (colId) => set({ dragOverColumn: colId }),
  clearError: () => set({ error: null }),
}))
