export const STATUS_CONFIG = {
  accepted: {
    id: 'accepted',
    label: 'Accepted',
    thaiLabel: 'ได้ Offer / ผ่านการคัดเลือก',
    pillClass: 'bg-[#50bfa0] text-[#0d4434] hover:brightness-95 shadow-xs',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    columnBorder: 'border-t-[#50bfa0]',
    columnBg: 'bg-[#50bfa0]/10',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 01.8 1.6L14.25 7l2.55 3.4A1 1 0 0116 12H4v5a1 1 0 11-2 0V3z" clipRule="evenodd" />
      </svg>
    ),
  },
  applied: {
    id: 'applied',
    label: 'Applied',
    thaiLabel: 'ยื่นใบสมัครแล้ว',
    pillClass: 'bg-[#96cbf2] text-[#124368] hover:brightness-95 shadow-xs',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    columnBorder: 'border-t-[#96cbf2]',
    columnBg: 'bg-[#96cbf2]/10',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    ),
  },
  interviewing: {
    id: 'interviewing',
    label: 'Interviewing',
    thaiLabel: 'นัดสัมภาษณ์',
    pillClass: 'bg-[#64a3e4] text-[#0f335b] hover:brightness-95 shadow-xs',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    columnBorder: 'border-t-[#64a3e4]',
    columnBg: 'bg-[#64a3e4]/10',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    ),
  },
  bookmarked: {
    id: 'bookmarked',
    label: 'Bookmarked',
    thaiLabel: 'เล็งไว้ / บันทึกไว้',
    pillClass: 'bg-[#d2a9f5] text-[#411c6d] hover:brightness-95 shadow-xs',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    columnBorder: 'border-t-[#d2a9f5]',
    columnBg: 'bg-[#d2a9f5]/10',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
    ),
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    thaiLabel: 'ไม่ผ่าน / ปฏิเสธ',
    pillClass: 'bg-[#f47b7b] text-[#5d1717] hover:brightness-95 shadow-xs',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    columnBorder: 'border-t-[#f47b7b]',
    columnBg: 'bg-[#f47b7b]/10',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 2a1 1 0 011 1v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V5a1 1 0 012 0v3.5a.5.5 0 001 0V3a1 1 0 011-1z" />
      </svg>
    ),
  },
}

export const DEFAULT_PLATFORMS = ['LinkedIn', 'JobsDB', 'JobBKK', 'JobThai']
