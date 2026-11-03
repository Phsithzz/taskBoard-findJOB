export const STATUS_CONFIG = {
  accepted: {
    id: 'accepted',
    label: 'Accepted',
    thaiLabel: 'ได้ Offer / ผ่านการคัดเลือก',
    pillClass: 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    columnBorder: 'border-t-emerald-500',
    columnBg: 'bg-emerald-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 01.8 1.6L14.25 7l2.55 3.4A1 1 0 0116 12H4v5a1 1 0 11-2 0V3z" clipRule="evenodd" />
      </svg>
    ),
  },
  applied: {
    id: 'applied',
    label: 'Applied',
    thaiLabel: 'ยื่นใบสมัครแล้ว',
    pillClass: 'bg-sky-400 text-white shadow-xs hover:bg-sky-500',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    columnBorder: 'border-t-sky-500',
    columnBg: 'bg-sky-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    ),
  },
  interviewing: {
    id: 'interviewing',
    label: 'Interviewing',
    thaiLabel: 'นัดสัมภาษณ์',
    pillClass: 'bg-blue-500 text-white shadow-xs hover:bg-blue-600',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    columnBorder: 'border-t-blue-500',
    columnBg: 'bg-blue-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    ),
  },
  bookmarked: {
    id: 'bookmarked',
    label: 'Bookmarked',
    thaiLabel: 'เล็งไว้ / บันทึกไว้',
    pillClass: 'bg-purple-400 text-white shadow-xs hover:bg-purple-500',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    columnBorder: 'border-t-purple-500',
    columnBg: 'bg-purple-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
    ),
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    thaiLabel: 'ไม่ผ่าน / ปฏิเสธ',
    pillClass: 'bg-rose-400 text-white shadow-xs hover:bg-rose-500',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    columnBorder: 'border-t-rose-500',
    columnBg: 'bg-rose-50/20',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
}

export const DEFAULT_PLATFORMS = ['LinkedIn', 'JobsDB', 'JobBKK', 'JobThai']
