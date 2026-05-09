import { useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { exportProfile, importProfile } from '../../db/index.js'

const label = (text) => (
  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-3)', display: 'block', marginBottom: '8px' }}>
    {text}
  </span>
)

export default function SettingsData({ profileId }) {
  const [importing, setImporting] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleExport() {
    const json = await exportProfile(profileId)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stash-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        await importProfile(ev.target.result)
        setMsg('imported. switch to it from Profiles tab.')
      } catch (err) {
        setMsg('import failed: ' + err.message)
      } finally {
        setImporting(false)
      }
    }
    reader.readAsText(file)
  }

  const rowStyle = { display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }
  const btnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-2)', fontFamily: 'var(--font-ui)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s ease', width: 'fit-content' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={rowStyle}>
        {label('export')}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-4)', marginBottom: '4px', lineHeight: 1.6 }}>download all your data as json</p>
        <button onClick={handleExport} style={btnStyle}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
          <Download size={14} /> export profile
        </button>
      </div>
      <div>
        {label('import')}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-4)', marginBottom: '8px', lineHeight: 1.6 }}>import a stash json file — creates a new profile</p>
        <label style={{ ...btnStyle, cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.5 : 1 }}
          onMouseEnter={e => { if (!importing) { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text)'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
          <Upload size={14} /> {importing ? 'importing…' : 'import file'}
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} disabled={importing} />
        </label>
        {msg && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: msg.includes('failed') ? '#C47B7A' : '#5A9E7E', marginTop: '8px' }}>{msg}</p>}
      </div>
    </div>
  )
}
