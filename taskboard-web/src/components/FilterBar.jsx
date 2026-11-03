import React, { useState, useRef, useEffect } from 'react'
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

  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false)
  const statusMenuRef = useRef(null)
  const platformMenuRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) {
        setIsStatusMenuOpen(false)
      }
      if (platformMenuRef.current && !platformMenuRef.current.contains(e.target)) {
        setIsPlatformMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const currentStatusObj = STATUS_CONFIG[selectedStatusFilter]
  const currentStatusLabel = currentStatusObj ? currentStatusObj.label : 'All Statuses'

  return (
    <div className="border-t border-slate-100 bg-white/70 backdrop-blur-xs px-4 py-2.5 sm:px-6 lg:px-8 rounded-xl shadow-2xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search saved jobs, company, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-9 pr-3 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-slate-400 font-medium">Filters:</span>

          <div className="relative" ref={statusMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsStatusMenuOpen(!isStatusMenuOpen)
                setIsPlatformMenuOpen(false)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              {currentStatusObj && (
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              )}
              <span>{currentStatusLabel}</span>
              <svg className="w-3 h-3 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isStatusMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-40 w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatusFilter('all')
                    setIsStatusMenuOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition ${
                    selectedStatusFilter === 'all'
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Statuses (ทั้งหมด)</span>
                  {selectedStatusFilter === 'all' && <span>✓</span>}
                </button>

                <div className="my-1 border-t border-slate-100" />

                {Object.values(STATUS_CONFIG).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedStatusFilter(s.id)
                      setIsStatusMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition ${
                      selectedStatusFilter === s.id
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${s.pillClass}`}>
                        {s.icon}
                      </span>
                      <span>{s.label}</span>
                    </div>
                    {selectedStatusFilter === s.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={platformMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsPlatformMenuOpen(!isPlatformMenuOpen)
                setIsStatusMenuOpen(false)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <span>{selectedPlatformFilter === 'all' ? 'All Platforms' : selectedPlatformFilter}</span>
              <svg className="w-3 h-3 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isPlatformMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-40 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatformFilter('all')
                    setIsPlatformMenuOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition ${
                    selectedPlatformFilter === 'all'
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Platforms (ทุกแอป)</span>
                  {selectedPlatformFilter === 'all' && <span>✓</span>}
                </button>

                <div className="my-1 border-t border-slate-100" />

                {platforms.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPlatformFilter(p)
                      setIsPlatformMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition ${
                      selectedPlatformFilter === p
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p}</span>
                    {selectedPlatformFilter === p && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleOnlyStarred}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition cursor-pointer shadow-2xs ${
              onlyStarred
                ? 'border-amber-300 bg-amber-50 text-amber-700 font-semibold'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className={onlyStarred ? 'text-amber-500' : 'text-slate-400'}>
              {onlyStarred ? '★' : '☆'}
            </span>
            <span>Starred</span>
          </button>
        </div>
      </div>
    </div>
  )
}
