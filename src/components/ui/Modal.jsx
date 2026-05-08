import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, fullscreen = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 bg-slate-900 border border-slate-700 shadow-2xl w-full flex flex-col
          ${fullscreen ? 'h-full rounded-none' : 'max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh]'}`}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 shrink-0">
            <h2 className="text-base font-semibold text-slate-100">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  )
}
