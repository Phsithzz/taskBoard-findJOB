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
  const openCreateModal = useJobStore((state) => state.openCreateModal)

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
    <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        <div className="relative flex items-center bg-white rounded-full border border-slate-200/90 shadow-2xs pl-4 pr-1.5 py-1 flex-1 max-w-md focus-within:border-slate-800 transition">
          <input
            type="text"
            placeholder="Search saved jobs, company, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
          />

          <div className="flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}

            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('all')
              setSelectedPlatformFilter('all')
            }}
            className={`rounded-full px-3.5 py-1.5 transition cursor-pointer ${
              selectedStatusFilter === 'all' && selectedPlatformFilter === 'all' && !onlyStarred
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
            }`}
          >
            All Jobs
          </button>

          <button
            type="button"
            onClick={toggleOnlyStarred}
            className={`rounded-full px-3.5 py-1.5 flex items-center gap-1 transition cursor-pointer ${
              onlyStarred
                ? 'bg-amber-400 text-amber-950 font-bold shadow-xs'
                : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
            }`}
          >
            <span>★</span>
            <span>Starred</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative" ref={statusMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsStatusMenuOpen(!isStatusMenuOpen)
              setIsPlatformMenuOpen(false)
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            {currentStatusObj && (
              <span className={`w-2 h-2 rounded-full ${currentStatusObj.pillClass}`}></span>
            )}
            <span>Status: {currentStatusLabel}</span>
            <svg className="w-3 h-3 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isStatusMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-40 w-56 rounded-2xl border border-slate-150 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedStatusFilter('all')
                  setIsStatusMenuOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition ${
                  selectedStatusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Statuses (ทั้งหมด)</span>
                {selectedStatusFilter === 'all' && <span>✓</span>}
              </button>

              <div className="my-1.5 border-t border-slate-100" />

              {Object.values(STATUS_CONFIG).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedStatusFilter(s.id)
                    setIsStatusMenuOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition ${
                    selectedStatusFilter === s.id
                      ? `${s.pillClass}`
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {s.icon}
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
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <span>App: {selectedPlatformFilter === 'all' ? 'All Platforms' : selectedPlatformFilter}</span>
            <svg className="w-3 h-3 text-slate-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isPlatformMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-40 w-48 rounded-2xl border border-slate-150 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedPlatformFilter('all')
                  setIsPlatformMenuOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition ${
                  selectedPlatformFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Platforms (ทุกแอป)</span>
                {selectedPlatformFilter === 'all' && <span>✓</span>}
              </button>

              <div className="my-1.5 border-t border-slate-100" />

              {platforms.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setSelectedPlatformFilter(p)
                    setIsPlatformMenuOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition ${
                    selectedPlatformFilter === p
                      ? 'bg-slate-900 text-white'
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
          onClick={() => openCreateModal('applied')}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
        >
          <span>+ Add Job</span>
        </button>
      </div>
    </div>
  )
}
