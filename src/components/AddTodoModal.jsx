import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'lucide-react'
import Modal from './ui/Modal.jsx'
import WatchEnricher from './enrichers/WatchEnricher.jsx'
import ReadEnricher from './enrichers/ReadEnricher.jsx'
import { db } from '../db/index.js'

const labelStyle = {
  fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-3)',
  display: 'block', marginBottom: '8px',
}

export default function AddTodoModal({ profileId, categoryId, onClose }) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState('')
  const [url, setUrl] = useState('')
  const [metadata, setMetadata] = useState(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId)
  const [saving, setSaving] = useState(false)

  const categories = useLiveQuery(
    () => db.categories.where('profileId').equals(profileId).sortBy('order'),
    [profileId]
  )

  const activeCategory = categories?.find(c => c.id === selectedCategoryId) || categories?.[0]
  const type = activeCategory?.type || 'todo'

  async function handleSubmit(e) {
    e.preventDefault()
    const finalTitle = title.trim() || metadata?.title || ''
    if (!finalTitle) return
    setSaving(true)
    await db.todos.add({
      profileId,
      categoryId: activeCategory?.id,
      title: finalTitle,
      notes: notes.trim(),
      date: date ? new Date(date + 'T12:00:00') : null,
      url: url.trim() || null,
      done: false,
      metadata: metadata || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    onClose()
  }

  return (
    <Modal title="add to stash" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Category chips */}
        {categories && categories.length > 1 && (
          <div>
            <span style={labelStyle}>category</span>
            <div className="no-scrollbar" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {categories.map(cat => {
                const active = cat.id === activeCategory?.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { setSelectedCategoryId(cat.id); setMetadata(null) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${active ? cat.color : 'var(--border)'}`,
                      background: active ? `${cat.color}18` : 'transparent',
                      color: active ? 'var(--text)' : 'var(--text-3)',
                      fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: active ? 600 : 400,
                      cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '11px' }}>{cat.icon}</span>
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Enricher section */}
        {type === 'watch' && (
          <div>
            <span style={labelStyle}>find it</span>
            <WatchEnricher profileId={profileId} value={metadata} onChange={setMetadata} />
          </div>
        )}
        {type === 'read' && (
          <div>
            <span style={labelStyle}>find it</span>
            <ReadEnricher value={metadata} onChange={setMetadata} />
          </div>
        )}

        {/* Title */}
        <div>
          <span style={labelStyle}>
            {type === 'watch' || type === 'read' ? 'or type manually' : 'title'}
          </span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={
              type === 'watch' ? 'title of movie or show…' :
              type === 'read' ? 'book title or link…' :
              type === 'research' ? 'what to research…' :
              type === 'buy' ? 'what to buy…' : 'what needs doing…'
            }
            className="field accent-focus"
            required={!metadata}
            autoFocus={type !== 'watch' && type !== 'read'}
          />
        </div>

        {/* URL for research/read */}
        {(type === 'research' || type === 'read') && (
          <div>
            <span style={labelStyle}>url</span>
            <div style={{ position: 'relative' }}>
              <Link size={13} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} />
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://…"
                className="field accent-focus"
                style={{ paddingLeft: '34px' }}
              />
            </div>
          </div>
        )}

        {/* Date */}
        <div>
          <span style={labelStyle}>date <span style={{ color: 'var(--text-4)', textTransform: 'none', letterSpacing: 0 }}>— optional</span></span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="field accent-focus"
          />
        </div>

        {/* Notes */}
        <div>
          <span style={labelStyle}>notes <span style={{ color: 'var(--text-4)', textTransform: 'none', letterSpacing: 0 }}>— optional</span></span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="any thoughts…"
            rows={3}
            className="field accent-focus"
            style={{ resize: 'none', lineHeight: 1.55 }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', paddingBottom: '8px' }}>
          <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>
            cancel
          </button>
          <button
            type="submit"
            disabled={saving || (!title.trim() && !metadata)}
            className="btn btn-primary"
            style={{ flex: 2 }}
          >
            stash it →
          </button>
        </div>
      </form>
    </Modal>
  )
}
