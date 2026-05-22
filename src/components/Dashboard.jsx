import { useState } from 'react'
import { supabase } from '../supabaseClient'
import Inventory from './Inventory'
import Resources from './Resources'

export default function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('inventory')

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const navItems = [
    { id: 'inventory', label: '📦 Inventory' },
    { id: 'resources', label: '🖥️ Resources' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .dash-wrap {
          height: 100vh; width: 100vw;
          background: #f0f2ff;
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem;
          height: 60px;
          background: rgba(255,255,255,0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.7);
        }
        .topbar-logo {
          font-size: 16px; font-weight: 600; color: #1a1a2e; letter-spacing: -0.3px;
          display: flex; align-items: center; gap: 8px;
        }
        .topbar-right {
          display: flex; align-items: center; gap: 1rem;
        }
        .user-pill {
          font-size: 13px; color: rgba(60,60,120,0.6);
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 20px; padding: 4px 12px;
        }
        .logout-btn {
          font-size: 13px; font-weight: 500;
          background: rgba(109,40,217,0.08);
          color: #6d28d9; border: 1px solid rgba(109,40,217,0.2);
          border-radius: 20px; padding: 5px 14px;
          cursor: pointer; transition: background 0.2s;
        }
        .logout-btn:hover { background: rgba(109,40,217,0.15); }
        .tabs {
          display: flex; gap: 6px;
          padding: 1rem 2rem 0;
        }
        .tab {
          padding: 8px 20px; border-radius: 12px 12px 0 0;
          font-size: 14px; font-weight: 500;
          cursor: pointer; border: none;
          background: rgba(255,255,255,0.3);
          color: rgba(60,60,120,0.5);
          transition: all 0.2s;
        }
        .tab.active {
          background: rgba(255,255,255,0.7);
          color: #6d28d9;
          backdrop-filter: blur(20px);
        }
        .content {
          flex: 1;
          margin: 0 2rem 2rem;
          background: rgba(255,255,255,0.35);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border-radius: 0 16px 16px 16px;
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 2px 0 rgba(255,255,255,0.8) inset;
          overflow-y: auto;
          padding: 1.5rem;
        }
      `}</style>

      <div className="dash-wrap">
        <div className="topbar">
          <div className="topbar-logo">
            📦 InvenSpace
          </div>
          <div className="topbar-right">
            <span className="user-pill">{session.user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Sign out</button>
          </div>
        </div>

        <div className="tabs">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="content">
          {activeTab === 'inventory' ? <Inventory session={session} /> : <Resources session={session} />}
        </div>
      </div>
    </>
  )
}