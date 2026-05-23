import { Link } from 'lucide-react'
import Modal from './ui/Modal.jsx'
import WatchEnricher from './enrichers/WatchEnricher.jsx'
import ReadEnricher from './enrichers/ReadEnricher.jsx'
import { useCategories, useTodoForm, useMutation } from '../hooks/index.js'
import { todos as todoCommands } from '../commands/index.js'
import { useProfileId } from '../contexts/ProfileContext.jsx'

const labelStyle = {
  fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-3)',
  display: 'block', marginBottom: '8px',
}

export default function AddTodoModal({ categoryId, onClose }) {
  const profileId = useProfileId()
  const { form, updateField, changeCategoryId } = useTodoForm(null)

  const categories = useCategories(profileId)

  const activeCategory = categories?.find(c => c.id === (form.categoryId || categoryId)) || categories?.[0]
  const type = activeCategory?.type || 'todo'

  const { mutate: save, isLoading: saving } = useMutation(async (payload) => {
    await todoCommands.addTodo(payload)
    onClose()
  })

  async function handleSubmit(e) {
    e.preventDefault()
    const finalTitle = form.title.trim() || form.metadata?.title || ''
    if (!finalTitle) return
    await save({
      profileId,
      categoryId: activeCategory?.id,
      title: finalTitle,
      notes: form.notes.trim(),
      date: form.date ? new Date(form.date + 'T12:00:00') : null,
      url: form.url.trim() || null,
      metadata: form.metadata || null,
    })
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
                    onClick={() => changeCategoryId(cat.id)}
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
            <WatchEnricher profileId={profileId} value={form.metadata} onChange={m => updateField('metadata', m)} />
          </div>
        )}
        {type === 'read' && (
          <div>
            <span style={labelStyle}>find it</span>
            <ReadEnricher value={form.metadata} onChange={m => updateField('metadata', m)} />
          </div>
        )}

        {/* Title */}
        <div>
          <span style={labelStyle}>
            {type === 'watch' || type === 'read' ? 'or type manually' : 'title'}
          </span>
          <input
            value={form.title}
            onChange={e => updateField('title', e.target.value)}
            placeholder={
              type === 'watch' ? 'title of movie or show…' :
              type === 'read' ? 'book title or link…' :
              type === 'research' ? 'what to research…' :
              type === 'buy' ? 'what to buy…' : 'what needs doing…'
            }
            className="field accent-focus"
            required={!form.metadata}
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
                value={form.url}
                onChange={e => updateField('url', e.target.value)}
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
            value={form.date}
            onChange={e => updateField('date', e.target.value)}
            className="field accent-focus"
          />
        </div>

        {/* Notes */}
        <div>
          <span style={labelStyle}>notes <span style={{ color: 'var(--text-4)', textTransform: 'none', letterSpacing: 0 }}>— optional</span></span>
          <textarea
            value={form.notes}
            onChange={e => updateField('notes', e.target.value)}
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
            disabled={saving || (!form.title.trim() && !form.metadata)}
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
