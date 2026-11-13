import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { STATUS_CONFIG } from '../constants/statusConfig'

export const StatusDropdown = ({ job, anchorRef, onSelectStatus, onClose }) => {
  const dropdownRef = useRef(null)
  const [coords, setCoords] = useState(null)

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (!anchorRef?.current) return
      const rect = anchorRef.current.getBoundingClientRect()

      // If anchor element is offscreen, close
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        onClose?.()
        return
      }

      const dropdownWidth = 250
      const dropdownHeight = 265 // Approximate height with 5 items + header

      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const openUpward = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight

      let top = openUpward ? rect.top - dropdownHeight - 6 : rect.bottom + 6
      if (top < 8) top = 8
      if (top + dropdownHeight > window.innerHeight - 8) {
        top = Math.max(8, window.innerHeight - dropdownHeight - 8)
      }

      // Align horizontally with the button's left edge
      let left = rect.left
      if (left + dropdownWidth > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - dropdownWidth - 12)
      }
      if (left < 12) {
        left = 12
      }

      setCoords({ top, left, openUpward })
    }

    updatePosition()

    const handleScroll = () => updatePosition()
    const handleResize = () => updatePosition()

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [anchorRef, onClose])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose?.()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [anchorRef, onClose])

  if (!coords) return null

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      <motion.div
        ref={dropdownRef}
        initial={{
          opacity: 0,
          scale: 0.95,
          y: coords.openUpward ? 6 : -6,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: coords.openUpward ? 6 : -6,
        }}
        transition={{ duration: 0.12 }}
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
        }}
        onClick={(e) => e.stopPropagation()}
        className="pointer-events-auto w-[250px] rounded-xl border-[2.5px] border-black bg-white p-3 shadow-[6px_6px_0px_#000000] font-sans"
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-black font-mono">
          <h3 className="text-xs font-black uppercase tracking-wider text-black">
            SELECT STATUS
          </h3>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-black bg-black"></span>
            <span className="w-2 h-2 rounded-full border border-black bg-[#C6FF33]"></span>
          </div>
        </div>

        <div className="space-y-1.5">
          {Object.values(STATUS_CONFIG).map((s) => {
            const isSelected = (job.status || '').toLowerCase() === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  onSelectStatus(job, s.id)
                  onClose?.()
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 rounded-lg font-mono font-bold text-xs uppercase transition-all duration-100 cursor-pointer ${
                  s.pillClass
                } ${
                  isSelected
                    ? 'ring-2 ring-black scale-[1.02]'
                    : 'hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{s.icon}</span>
                  <span className="tracking-tight truncate">{s.label}</span>
                </div>

                {isSelected ? (
                  <FiCheck className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <FiArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
