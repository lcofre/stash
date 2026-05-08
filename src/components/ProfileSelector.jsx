import { useState } from 'react'
import { Package, Plus } from 'lucide-react'
import { createProfile } from '../db/index.js'

export default function ProfileSelector({ profiles, onSelect }) {
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    const id = await createProfile(name.trim())
    onSelect(id)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
          <Package size={32} className="text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Stash</h1>
        <p className="text-slate-400 text-sm text-center">Your personal categorized todo list</p>
      </div>

      {profiles.length > 0 && (
        <div className="w-full max-w-sm mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Your profiles</p>
          <div className="flex flex-col gap-2">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-100 font-medium transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-xs text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>
        </div>
      )}

      <form onSubmit={handleCreate} className="w-full max-w-sm flex flex-col gap-3">
        <p className="text-xs text-slate-400 uppercase tracking-wider">
          {profiles.length === 0 ? 'Create your first profile' : 'New profile'}
        </p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name or nickname"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 transition-colors"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim() || creating}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create profile
        </button>
      </form>
    </div>
  )
}
