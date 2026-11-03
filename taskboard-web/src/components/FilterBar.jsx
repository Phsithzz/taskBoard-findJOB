import React from 'react'
import { useJobStore } from '../stores/useJobStore'
import { STATUS_CONFIG } from '../constants/statusConfig'

export const FilterBar = () => {
  const platforms = useJobStore((state) => state.platforms)
  const searchQuery = useJobStore((state) => state.searchQuery)
  const setSearchQuery = useJobStore((state) => state.setSearchQuery)
  const selectedPlatformFilter = useJobStore((state) => state.selectedPlatformFilter)
  const setSelectedPlatformFilter = useJobStore((state) => state.setSelectedPlatformFilter)
  const selectedStatusFilter = useJobStore((state) => state.selectedStatusFilter)
  const setSelectedStatusFilter = useJobStore((state) => state.setSelectedStatusFilter)
  const onlyStarred = useJobStore((state) => state.onlyStarred)
  const toggleOnlyStarred = useJobStore((state) => state.toggleOnlyStarred)

  return (
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
            type="button"
            onClick={toggleOnlyStarred}
            className={`flex items-center space-x-1 rounded-lg border px-2.5 py-1.5 transition cursor-pointer ${
              onlyStarred
                ? 'border-amber-300 bg-amber-50 text-amber-700 font-semibold'
                : 'border-slate-200 bg-slate-50/60 text-slate-600'
            }`}
          >
            <span>★</span>
            <span>ติดดาว</span>
          </button>
        </div>
      </div>
    </div>
  )
}
