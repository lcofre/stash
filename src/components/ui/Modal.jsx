import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, fullscreen = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: fullscreen ? 'stretch' : 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="anim-fade-in"
        style={{ position: 'absolute', inset: 0, background: 'rgba(12,11,15,0.75)', backdropFilter: 'blur(4px)' }}
      />

      {/* Sheet */}
      <div
        className="anim-sheet-up"
        style={{
          position: 'relative', zIndex: 10,
          background: 'var(--bg-2)',
          border: '1px solid var(--border-2)',
          boxShadow: '0 -8px 60px rgba(0,0,0,0.5)',
          width: '100%',
          maxWidth: fullscreen ? '100%' : '520px',
          borderRadius: fullscreen ? 0 : '16px 16px 0 0',
          maxHeight: fullscreen ? '100%' : '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600, color: 'var(--text-2)', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: '4px', transition: 'color 0.15s ease', display: 'flex' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div style={{ overflowY: 'auto', flex: 1, overscrollBehavior: 'contain' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
