import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useJobStore } from './stores/useJobStore'
import { TopBar } from './components/TopBar'
import { FilterBar } from './components/FilterBar'
import { KanbanBoard } from './components/KanbanBoard'
import { JobModal } from './components/JobModal'
import { UnlockModal } from './components/UnlockModal'

export default function App() {
  const fetchJobs = useJobStore((state) => state.fetchJobs)
  const setActiveDropdownId = useJobStore((state) => state.setActiveDropdownId)

  useEffect(() => {
    const controller = new AbortController()
    fetchJobs(controller.signal)
    return () => controller.abort()
  }, [fetchJobs])

  return (
    <div
      onClick={() => setActiveDropdownId(null)}
      className="min-h-screen bg-[#7D39EB] font-sans text-slate-900 flex flex-col selection:bg-[#C6FF33] selection:text-black"
    >
      <div className="w-full bg-[#C6FF33] text-black font-mono font-black text-[11px] uppercase tracking-widest py-1.5 px-4 sm:px-8 border-b-2 border-black flex items-center justify-between overflow-hidden select-none">
        <div className="flex items-center gap-6">
          <span>● LIVE JOB APPLICATION TRACKER</span>
          <span className="hidden sm:inline">● FULL-STACK GO & REACT PIPELINE</span>
          <span className="hidden md:inline">● CLEAN ARCHITECTURE & ZUSTAND</span>
          <span>● PRODUCTION READY</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[10px]">
          <span className="bg-black text-[#C6FF33] px-2 py-0.5 rounded font-black">
            JOBHUNT // 2026
          </span>
          <span className="font-bold">GO • GIN • REACT • MONGODB</span>
        </div>
      </div>

      <div className="w-full max-w-[1850px] mx-auto p-3 sm:p-5 lg:p-7 flex flex-col gap-6 flex-1">
        <TopBar />

        <main className="rounded-2xl bg-white border-[2.5px] border-black shadow-[8px_8px_0px_#000000] p-5 sm:p-7 flex flex-col space-y-6 overflow-hidden">
          <FilterBar />
          <div className="w-full overflow-x-auto">
            <KanbanBoard />
          </div>
        </main>
      </div>

      <JobModal />
      <UnlockModal />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}
