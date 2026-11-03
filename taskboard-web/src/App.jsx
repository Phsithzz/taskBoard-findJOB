import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useJobStore } from './stores/useJobStore'
import { TopBar } from './components/TopBar'
import { FilterBar } from './components/FilterBar'
import { KanbanBoard } from './components/KanbanBoard'
import { JobModal } from './components/JobModal'

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
      className="min-h-screen bg-gradient-to-br from-[#D8F3E5] via-[#EBF7F1] to-[#D5EFE2] font-sans text-slate-800 p-3 sm:p-5 lg:p-7 selection:bg-emerald-500 selection:text-white"
    >
      <div className="w-full max-w-[1850px] mx-auto flex flex-col gap-5">
        <TopBar />

        <main className="rounded-[32px] bg-white/85 backdrop-blur-md border border-white/80 p-5 sm:p-6 shadow-2xl flex flex-col space-y-5 overflow-hidden">
          <FilterBar />
          <div className="w-full overflow-x-auto">
            <KanbanBoard />
          </div>
        </main>
      </div>

      <JobModal />
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
        theme="colored"
      />
    </div>
  )
}
