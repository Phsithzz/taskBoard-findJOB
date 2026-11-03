import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useJobStore } from './stores/useJobStore'
import { Sidebar } from './components/Sidebar'
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
      className="min-h-screen bg-gradient-to-br from-[#D8F3E5] via-[#EBF7F1] to-[#D5EFE2] font-sans text-slate-800 p-3 sm:p-6 lg:p-8 flex items-center justify-center selection:bg-emerald-500 selection:text-white"
    >
      <div className="w-full max-w-[1800px] min-h-[92vh] flex flex-col lg:flex-row gap-6">
        <Sidebar />

        <main className="flex-1 rounded-[32px] bg-white/85 backdrop-blur-md border border-white/80 p-5 sm:p-7 shadow-2xl flex flex-col space-y-6 overflow-hidden">
          <FilterBar />
          <div className="flex-1 overflow-x-auto">
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
