import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS_HEADER = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const DatePicker = ({ value, onChange, placeholder = 'วว/ดด/ปปปป' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const parseInitialDate = () => {
    if (!value) return new Date()
    if (value.includes('/')) {
      const [d, m, y] = value.split('/')
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10))
    }
    if (value.includes('-')) {
      const [y, m, d] = value.split('-')
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10))
    }
    return new Date()
  }

  const initialDate = parseInitialDate()
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())
  const [tempSelected, setTempSelected] = useState(value || '')

  useEffect(() => {
    if (value) {
      setTempSelected(value)
      const d = parseInitialDate()
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear())
        setViewMonth(d.getMonth())
      }
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const prevMonth = (e) => {
    e.stopPropagation()
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = (e) => {
    e.stopPropagation()
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const getCalendarDays = () => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay()
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const days = []

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        month: viewMonth === 0 ? 11 : viewMonth - 1,
        year: viewMonth === 0 ? viewYear - 1 : viewYear,
      })
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        month: viewMonth,
        year: viewYear,
      })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        month: viewMonth === 11 ? 0 : viewMonth + 1,
        year: viewMonth === 11 ? viewYear + 1 : viewYear,
      })
    }

    return days
  }

  const formatDate = (d, m, y) => {
    const dd = String(d).padStart(2, '0')
    const mm = String(m + 1).padStart(2, '0')
    return `${dd}/${mm}/${y}`
  }

  const handleSelectDay = (dayObj) => {
    const formatted = formatDate(dayObj.day, dayObj.month, dayObj.year)
    setTempSelected(formatted)
  }

  const handleConfirm = (e) => {
    e.stopPropagation()
    if (tempSelected) {
      onChange(tempSelected)
    }
    setIsOpen(false)
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    setTempSelected(value || '')
    setIsOpen(false)
  }

  const calendarDays = getCalendarDays()

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-lg border-2 border-black bg-white px-3 py-2 text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] cursor-pointer hover:bg-slate-50 transition select-none"
      >
        <span className={value ? 'text-black font-black' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <FiCalendar className="w-4 h-4 text-black shrink-0" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-full mt-2 z-50 w-72 rounded-2xl border-[2.5px] border-black bg-white p-4 shadow-[6px_6px_0px_#000000] font-sans"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-slate-100 transition cursor-pointer shadow-[1px_1px_0px_#000]"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono font-black text-xs uppercase tracking-wider text-black">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-slate-100 transition cursor-pointer shadow-[1px_1px_0px_#000]"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono font-black text-[10px] text-slate-500 mb-1.5 uppercase">
              {DAYS_HEADER.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
              {calendarDays.map((dObj, idx) => {
                const formatted = formatDate(dObj.day, dObj.month, dObj.year)
                const isSelected = tempSelected === formatted

                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectDay(dObj)}
                    className={`h-7 w-7 mx-auto flex items-center justify-center rounded-lg font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#C6FF33] text-black border-2 border-black font-black shadow-[1.5px_1.5px_0px_#000]'
                        : dObj.isCurrentMonth
                        ? 'text-black hover:bg-slate-100'
                        : 'text-slate-300 hover:text-slate-500'
                    }`}
                  >
                    {dObj.day}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t-2 border-black font-mono">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-1.5 rounded-lg border-2 border-black bg-white text-xs font-black uppercase hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-1.5 rounded-lg border-2 border-black bg-[#C6FF33] text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] hover:bg-[#bbf426] transition cursor-pointer"
              >
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
