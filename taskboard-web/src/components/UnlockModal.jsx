import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLock, FiEye, FiEyeOff, FiX, FiAlertTriangle, FiShield } from 'react-icons/fi'
import { useJobStore } from '../stores/useJobStore'

export const UnlockModal = () => {
  const isUnlockModalOpen = useJobStore((state) => state.isUnlockModalOpen)
  const closeUnlockModal = useJobStore((state) => state.closeUnlockModal)
  const unlockPersonal = useJobStore((state) => state.unlockPersonal)
  const isLockedOut = useJobStore((state) => state.isLockedOut)
  const lockoutRemaining = useJobStore((state) => state.lockoutRemaining)
  const attemptsRemaining = useJobStore((state) => state.attemptsRemaining)

  const [pin, setPin] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  if (!isUnlockModalOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pin.trim() || isLockedOut || loading) return

    setLoading(true)
    setLocalError('')

    const result = await unlockPersonal(pin.trim())
    setLoading(false)

    if (result.success) {
      setPin('')
      setLocalError('')
    } else if (result.locked) {
      setLocalError(`ระบบถูกล็อคเป็นเวลา ${result.retryMinutes} นาที เนื่องจากกรอกรหัสผิดครบ 3 ครั้ง`)
    } else {
      setLocalError(`PIN ไม่ถูกต้อง (เหลือโอกาสอีก ${result.attemptsLeft} ครั้ง)`)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-md bg-white border-[3px] border-black rounded-2xl shadow-[10px_10px_0px_#000000] overflow-hidden flex flex-col font-sans"
        >
          <div className="bg-black text-white px-5 py-4 border-b-2 border-black flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-[#C6FF33] text-black">
                <FiLock className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-black font-mono tracking-wider uppercase">
                  SECURITY GATE // ACCESS
                </h2>
                <p className="text-[10px] text-slate-300 font-mono">
                  VERIFY IDENTITY TO ACCESS PERSONAL BOARD
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeUnlockModal}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {isLockedOut ? (
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 flex items-start gap-3">
                <FiAlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs font-mono">
                  <p className="font-black uppercase tracking-wider text-rose-900">
                    ACCESS TEMPORARILY LOCKED
                  </p>
                  <p className="mt-1">
                    มีการกรอก PIN ผิดติดต่อกัน 3 ครั้ง ระบบได้ทำการระงับการเข้าถึงเป็นเวลา 1 ชั่วโมง
                    (เหลือเวลาอีกประมาณ {lockoutRemaining} นาที)
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#7D39EB]/10 border-2 border-[#7D39EB]/30">
                  <FiShield className="w-5 h-5 text-[#7D39EB] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">โหมดส่วนตัว (Personal Mode)</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      กรุณากรอกรหัส PIN ประจำตัวของคุณ ข้อมูลจะไม่ถูกบันทึกลงในเบราว์เซอร์เพื่อความปลอดภัยสูงสุด
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <label className="text-slate-800">SECURITY PIN</label>
                    <span className="text-[10px] text-slate-500">
                      เหลือโอกาส: <strong className={attemptsRemaining <= 1 ? 'text-rose-600 font-black' : 'text-slate-900'}>{attemptsRemaining}/3 ครั้ง</strong>
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value)
                        setLocalError('')
                      }}
                      placeholder="กรอกรหัสลับของคุณ..."
                      autoFocus
                      disabled={loading || isLockedOut}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 border-2 border-black font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#7D39EB] focus:bg-white shadow-[3px_3px_0px_#000000] disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black p-1"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>

                  {localError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-1 font-mono"
                    >
                      ⚠️ {localError}
                    </motion.p>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                  <span>ℹ️</span>
                  <span>หากกรอกผิดครบ 3 ครั้ง ระบบจะบล็อก IP นี้เป็นเวลา 1 ชั่วโมงทันที</span>
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={closeUnlockModal}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border-2 border-black font-mono font-bold text-xs uppercase hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                Cancel
              </button>
              {!isLockedOut && (
                <button
                  type="submit"
                  disabled={loading || !pin.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#C6FF33] text-black border-2 border-black font-mono font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#bbf426] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <FiLock className="w-3.5 h-3.5" />
                      <span>Unlock Board</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
