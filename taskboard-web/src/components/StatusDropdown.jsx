import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { STATUS_CONFIG } from '../constants/statusConfig'

export const StatusDropdown = ({ job, onSelectStatus, dropdownRef }) => {
  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.12 }}
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border-[2.5px] border-black bg-white p-3.5 shadow-[6px_6px_0px_#000000] font-sans"
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

      <div className="space-y-2">
        {Object.values(STATUS_CONFIG).map((s) => {
          const isSelected = (job.status || '').toLowerCase() === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectStatus(job, s.id)}
              className={`flex w-full items-center justify-between px-3 py-2 rounded-lg font-mono font-bold text-xs uppercase transition-all duration-100 cursor-pointer ${
                s.pillClass
              } ${isSelected ? 'ring-2 ring-black scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              <div className="flex items-center gap-2">
                <span className="shrink-0">{s.icon}</span>
                <span className="tracking-tight">{s.label}</span>
              </div>

              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
