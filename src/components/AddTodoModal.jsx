import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Link } from 'lucide-react'
import Modal from './ui/Modal.jsx'
import WatchEnricher from './enrichers/WatchEnricher.jsx'
import ReadEnricher from './enrichers/ReadEnricher.jsx'
import { db } from '../db/index.js'

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

  const type = activeCategory?.type || 'todo'

  return (
    <Modal title="Add to Stash" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        {/* Category selector */}
        {categories && categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setSelectedCategoryId(cat.id); setMetadata(null) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0
                  ${cat.id === activeCategory?.id ? 'text-white' : 'text-slate-400 bg-slate-800 hover:bg-slate-700'}`}
                style={cat.id === activeCategory?.id ? { backgroundColor: cat.color } : {}}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Enricher */}
        {type === 'watch' && (
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Movie / TV Show</label>
            <WatchEnricher profileId={profileId} value={metadata} onChange={setMetadata} />
          </div>
        )}
        {type === 'read' && (
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Book</label>
            <ReadEnricher value={metadata} onChange={setMetadata} />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
            {type === 'watch' || type === 'read' ? 'Or enter title manually' : 'Title'}
            {(type === 'watch' || type === 'read') ? '' : ' *'}
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={
              type === 'watch' ? 'Movie or show title…' :
              type === 'read' ? 'Book title or URL…' :
              type === 'research' ? 'Topic to research…' :
              type === 'buy' ? 'Item to buy…' :
              'What needs to be done?'
            }
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors"
            required={!metadata}
            autoFocus={!metadata}
          />
        </div>

        {/* URL field for research/read */}
        {(type === 'research' || type === 'read') && (
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">URL (optional)</label>
            <div className="relative">
              <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://…"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors"
              />
            </div>
          </div>
        )}

        {/* Date */}
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Date (optional)</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add notes…"
            rows={3}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || (!title.trim() && !metadata)}
            className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add to Stash
          </button>
        </div>
      </form>
    </Modal>
  )
}
