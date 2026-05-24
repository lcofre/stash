export default function ReadRenderer({ todo }) {
  const m = todo.metadata
  return (
    <div style={{ display: 'flex', gap: '14px' }}>
      {m?.coverUrl && (
        <div style={{ flexShrink: 0, width: '48px', height: '72px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-2)' }}>
          <img src={m.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 600,
          color: todo.done ? 'var(--text-3)' : 'var(--text)',
          lineHeight: 1.25,
          textDecoration: todo.done ? 'line-through' : 'none',
        }}>
          {todo.title}
        </p>
        {m?.authors && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-3)', marginTop: '6px' }}>
            {m.authors}
            {m.publishedYear && <span style={{ fontFamily: 'var(--font-mono)', marginLeft: '8px', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)' }}>{m.publishedYear}</span>}
            {m.pageCount && <span style={{ fontFamily: 'var(--font-mono)', marginLeft: '8px', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)' }}>{m.pageCount}p</span>}
          </p>
        )}
      </div>
    </div>
  )
}
