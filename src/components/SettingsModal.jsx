import { useState } from 'react'
import Modal from './ui/Modal.jsx'
import SettingsCategories from './settings/SettingsCategories.jsx'
import SettingsProfiles from './settings/SettingsProfiles.jsx'
import SettingsAPI from './settings/SettingsAPI.jsx'
import SettingsData from './settings/SettingsData.jsx'

const TABS = ['Categories', 'Profiles', 'API Keys', 'Data']

export default function SettingsModal({ profileId, profiles, onClose, onSwitchProfile, onProfileCreated }) {
  const [activeTab, setActiveTab] = useState('Categories')

  return (
    <Modal title="settings" onClose={onClose} fullscreen>
      {/* Tabs */}
      <div className="no-scrollbar" style={{
        display: 'flex', overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--bg-2)', zIndex: 10,
        padding: '0 16px',
        flexShrink: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 14px', background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--amber)' : 'transparent'}`,
              marginBottom: '-1px',
              color: activeTab === tab ? 'var(--text)' : 'var(--text-4)',
              fontFamily: 'var(--font-ui)', fontSize: '13px',
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'color 0.15s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text-2)'; }}
            onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text-4)'; }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        {activeTab === 'Categories' && <SettingsCategories profileId={profileId} />}
        {activeTab === 'Profiles' && <SettingsProfiles profileId={profileId} profiles={profiles} onSwitchProfile={onSwitchProfile} onProfileCreated={onProfileCreated} onClose={onClose} />}
        {activeTab === 'API Keys' && <SettingsAPI profileId={profileId} />}
        {activeTab === 'Data' && <SettingsData profileId={profileId} />}
      </div>
    </Modal>
  )
}
