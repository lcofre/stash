import { useLiveQuery } from 'dexie-react-hooks'
import { CalendarDays } from 'lucide-react'
import { db } from '../db/index.js'

export default function CategoryTabs({ profileId, activeCategoryId, onSelect }) {
  const categories = useLiveQuery(
    () => db.categories.where('profileId').equals(profileId).sortBy('order'),
    [profileId]
  )

  if (!categories) return <div className="h-12 bg-slate-900" />

  return (
    <div className="flex gap-1 overflow-x-auto px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0 no-scrollbar">
      {categories.map(cat => {
        const active = cat.id === activeCategoryId
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(active ? null : cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0
              ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700'}`}
            style={active ? { backgroundColor: cat.color } : {}}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        )
      })}
      <button
        onClick={() => onSelect('__calendar__')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0
          ${activeCategoryId === '__calendar__' ? 'bg-slate-500 text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700'}`}
      >
        <CalendarDays size={14} />
        <span>Calendar</span>
      </button>
    </div>
  )
}
