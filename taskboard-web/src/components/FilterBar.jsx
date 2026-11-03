import React, { useState, useRef, useEffect } from 'react'
import { FiSearch, FiChevronDown, FiStar, FiX, FiPlus, FiArrowRight } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa6'
import { useJobStore } from '../stores/useJobStore'
import { STATUS_CONFIG, getPlatformLogo } from '../constants/statusConfig'

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
    <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b-2 border-black font-sans">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        <div className="relative flex items-center bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] pl-3.5 pr-1.5 py-1 flex-1 max-w-md focus-within:ring-2 focus-within:ring-[#7D39EB] transition">
          <input
            type="text"
            placeholder="Search saved jobs, company, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold text-black placeholder:text-slate-400 outline-none bg-transparent"
          />

          <div className="flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-1 text-xs font-bold text-slate-500 hover:text-black cursor-pointer"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[#C6FF33] border border-black hover:bg-[#C6FF33] hover:text-black transition cursor-pointer"
            >
              <FiSearch className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-black font-mono">
          <button
            type="button"
            onClick={() => {
              setSelectedStatusFilter('all')
              setSelectedPlatformFilter('all')
            }}
            className={`rounded-xl px-4 py-2 border-2 border-black transition cursor-pointer ${
              selectedStatusFilter === 'all' && selectedPlatformFilter === 'all' && !onlyStarred
                ? 'bg-black text-white shadow-[3px_3px_0px_#000000]'
                : 'bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000000]'
            }`}
          >
            ALL JOBS
          </button>

          <button
            type="button"
            onClick={toggleOnlyStarred}
            className={`rounded-xl px-3.5 py-2 flex items-center gap-1.5 border-2 border-black transition cursor-pointer ${
              onlyStarred
                ? 'bg-[#C6FF33] text-black shadow-[3px_3px_0px_#000000]'
                : 'bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000000]'
            }`}
          >
            {onlyStarred ? <FaStar className="w-3 h-3 text-black" /> : <FiStar className="w-3 h-3" />}
            <span>STARRED</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 font-mono">
        <div className="relative" ref={statusMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsStatusMenuOpen(!isStatusMenuOpen)
              setIsPlatformMenuOpen(false)
            }}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-3.5 py-2 text-xs font-black text-black shadow-[3px_3px_0px_#000000] hover:bg-slate-50 transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            {currentStatusObj && (
              <span className="w-2.5 h-2.5 rounded-full border border-black bg-[#C6FF33]"></span>
            )}
            <span className="uppercase">{currentStatusLabel}</span>
            <FiChevronDown className="w-3.5 h-3.5" />
          </button>

          {isStatusMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-40 w-56 rounded-xl border-2 border-black bg-white p-2 shadow-[6px_6px_0px_#000000] animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedStatusFilter('all')
                  setIsStatusMenuOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-black uppercase cursor-pointer transition ${
                  selectedStatusFilter === 'all'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-slate-100'
                }`}
              >
                <span>All Statuses (ทั้งหมด)</span>
                {selectedStatusFilter === 'all' && <span>✓</span>}
              </button>

              <div className="my-1.5 border-t-2 border-black" />

              {Object.values(STATUS_CONFIG).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedStatusFilter(s.id)
                    setIsStatusMenuOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase cursor-pointer transition ${
                    selectedStatusFilter === s.id
                      ? `${s.pillClass}`
                      : 'text-black hover:bg-slate-100'
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
            className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-3.5 py-2 text-xs font-black text-black shadow-[3px_3px_0px_#000000] hover:bg-slate-50 transition cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            <span className="uppercase inline-flex items-center gap-1.5">
              {selectedPlatformFilter !== 'all' && getPlatformLogo(selectedPlatformFilter) && (
                <img
                  src={getPlatformLogo(selectedPlatformFilter)}
                  alt=""
                  className="w-3.5 h-3.5 rounded-xs object-contain"
                />
              )}
              <span>{selectedPlatformFilter === 'all' ? 'PLATFORMS: ALL' : selectedPlatformFilter}</span>
            </span>
            <FiChevronDown className="w-3.5 h-3.5" />
          </button>

          {isPlatformMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-40 w-52 rounded-xl border-2 border-black bg-white p-2 shadow-[6px_6px_0px_#000000] animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedPlatformFilter('all')
                  setIsPlatformMenuOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-black uppercase cursor-pointer transition ${
                  selectedPlatformFilter === 'all'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-slate-100'
                }`}
              >
                <span>All Platforms (ทุกแอป)</span>
                {selectedPlatformFilter === 'all' && <span>✓</span>}
              </button>

              <div className="my-1.5 border-t-2 border-black" />

              {platforms.map((p) => {
                const logo = getPlatformLogo(p)
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPlatformFilter(p)
                      setIsPlatformMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase cursor-pointer transition ${
                      selectedPlatformFilter === p
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-slate-100'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {logo && (
                        <img src={logo} alt="" className="w-4 h-4 rounded-xs object-contain" />
                      )}
                      <span>{p}</span>
                    </span>
                    {selectedPlatformFilter === p && <span>✓</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => openCreateModal('applied')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#C6FF33] text-black border-2 border-black px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#bbf426] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer font-mono"
        >
          <FiPlus className="w-3.5 h-3.5" />
          <span>ADD JOB</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
