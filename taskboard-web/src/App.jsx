import  { useEffect } from 'react'
import { useJobStore } from './stores/useJobStore'
import { Navbar } from './components/Navbar'
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
      className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white"
    >
      <Navbar />

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <FilterBar />
        <KanbanBoard />
      </main>

      <JobModal />
    </div>
  )
}
