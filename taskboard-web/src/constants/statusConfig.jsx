import React from 'react'
import { FaFlag, FaPaperPlane, FaComments, FaBookmark, FaHand } from 'react-icons/fa6'
import linkedinLogo from '../assets/images/linkin.jpg'
import jobsdbLogo from '../assets/images/jobdb.png'
import jobbkkLogo from '../assets/images/jobbkk.png'
import jobthaiLogo from '../assets/images/jobthai.png'

export const STATUS_CONFIG = {
  accepted: {
    id: 'accepted',
    label: 'Accepted',
    thaiLabel: 'ได้ Offer / ผ่านการคัดเลือก',
    pillClass: 'bg-[#C6FF33] text-black border-2 border-black font-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]',
    badgeClass: 'bg-[#C6FF33] text-black border-2 border-black font-black',
    columnBorder: 'border-t-[#C6FF33]',
    columnBg: 'bg-[#C6FF33]/15',
    headerBg: 'bg-[#C6FF33] text-black',
    icon: <FaFlag className="w-3.5 h-3.5 text-black" />,
  },
  applied: {
    id: 'applied',
    label: 'Applied',
    thaiLabel: 'ยื่นใบสมัครแล้ว',
    pillClass: 'bg-[#7DD3FC] text-black border-2 border-black font-bold shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]',
    badgeClass: 'bg-[#7DD3FC] text-black border-2 border-black font-bold',
    columnBorder: 'border-t-[#7DD3FC]',
    columnBg: 'bg-[#7DD3FC]/20',
    headerBg: 'bg-[#7DD3FC] text-black',
    icon: <FaPaperPlane className="w-3.5 h-3.5 text-black" />,
  },
  interviewing: {
    id: 'interviewing',
    label: 'Interviewing',
    thaiLabel: 'นัดสัมภาษณ์',
    pillClass: 'bg-[#D7BAFF] text-black border-2 border-black font-bold shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]',
    badgeClass: 'bg-[#D7BAFF] text-black border-2 border-black font-bold',
    columnBorder: 'border-t-[#7D39EB]',
    columnBg: 'bg-[#D7BAFF]/20',
    headerBg: 'bg-[#D7BAFF] text-black',
    icon: <FaComments className="w-3.5 h-3.5 text-black" />,
  },
  bookmarked: {
    id: 'bookmarked',
    label: 'Bookmarked',
    thaiLabel: 'เล็งไว้ / บันทึกไว้',
    pillClass: 'bg-[#FFF080] text-black border-2 border-black font-bold shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]',
    badgeClass: 'bg-[#FFF080] text-black border-2 border-black font-bold',
    columnBorder: 'border-t-[#FFF080]',
    columnBg: 'bg-[#FFF080]/20',
    headerBg: 'bg-[#FFF080] text-black',
    icon: <FaBookmark className="w-3.5 h-3.5 text-black" />,
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    thaiLabel: 'ไม่ผ่าน / ปฏิเสธ',
    pillClass: 'bg-[#FF8080] text-black border-2 border-black font-bold shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]',
    badgeClass: 'bg-[#FF8080] text-black border-2 border-black font-bold',
    columnBorder: 'border-t-[#FF8080]',
    columnBg: 'bg-[#FF8080]/20',
    headerBg: 'bg-[#FF8080] text-black',
    icon: <FaHand className="w-3.5 h-3.5 text-black" />,
  },
}

export const DEFAULT_PLATFORMS = ['LinkedIn', 'JobsDB', 'JobBKK', 'JobThai']

export const PLATFORM_LOGOS = {
  LinkedIn: linkedinLogo,
  JobsDB: jobsdbLogo,
  JobBKK: jobbkkLogo,
  JobThai: jobthaiLogo,
}

export const getPlatformLogo = (platformName) => {
  if (!platformName) return null
  const lower = platformName.toLowerCase().replace(/\s+/g, '')
  if (lower.includes('link')) return linkedinLogo
  if (lower.includes('jobdb') || lower.includes('jobsdb')) return jobsdbLogo
  if (lower.includes('jobbkk') || lower.includes('bkk')) return jobbkkLogo
  if (lower.includes('jobthai') || lower.includes('thai')) return jobthaiLogo
  return null
}
