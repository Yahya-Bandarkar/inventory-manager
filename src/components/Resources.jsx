import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Resources({ session }) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', status: 'available' })
  const [editId, setEditId] = useState(null)

  useEffect(() => { fetchResources() }, [])

  const fetchResources = async () => {
    setLoading(true)
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
    setResources(data || [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.name) return
    const payload = {
      name: form.name,
      type: form.type,
      status: form.status,
      assigned_to: session.user.id,
    }
    if (editId) {
      await supabase.from('resources').update(payload).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('resources').insert(payload)
    }
    setForm({ name: '', type: '', status: 'available' })
    setShowForm(false)
    fetchResources()
  }

  const handleEdit = (r) => {
    setForm({ name: r.name, type: r.type || '', status: r.status || 'available' })
    setEditId(r.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    await supabase.from('resources').delete().eq('id', id)
    fetchResources()
  }

  const statusColor = (status) => {
    if (status === 'available') return { bg: 'rgba(34,197,94,0.1)', color: '#16a34a', border: 'rgba(34,197,94,0.2)' }
    if (status === 'in-use') return { bg: 'rgba(234,179,8,0.1)', color: '#ca8a04', border: 'rgba(234,179,8,0.2)' }
    return { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'rgba(239,68,68,0.2)' }
  }

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem',
    background: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(255,255,255,0.8)',
    borderRadius: '10px', fontSize: '14px',
    color: '#1a1a2e', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>Workspace Resources</h2>
          <p style={{ fontSize: '13px', color: 'rgba(60,60,120,0.5)', marginTop: '2px' }}>{resources.length} resources total</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', type: '', status: 'available' }) }}
          style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          {showForm ? 'Cancel' : '+ Add Resource'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input style={inputStyle} placeholder="Resource name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Type (e.g. Laptop, Room)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
          </div>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ ...inputStyle, marginBottom: '0.75rem', width: 'auto' }}>
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <br />
          <button onClick={handleSubmit}
            style={{ marginTop: '0.75rem', padding: '8px 20px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            {editId ? 'Update Resource' : 'Save Resource'}
          </button>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'rgba(60,60,120,0.5)', fontSize: '14px' }}>Loading...</p>
      ) : resources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(60,60,120,0.4)' }}>
          <div style={{ fontSize: '40px', marginBottom: '0.75rem' }}>🖥️</div>
          <p style={{ fontSize: '15px' }}>No resources yet. Add your first resource!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {resources.map(r => {
            const sc = statusColor(r.status)
            return (
              <div key={r.id} style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '14px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>{r.name}</h3>
                  <span style={{ fontSize: '11px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '2px 8px', borderRadius: '20px', fontWeight: '500' }}>
                    {r.status}
                  </span>
                </div>
                {r.type && <p style={{ fontSize: '13px', color: 'rgba(60,60,120,0.55)', marginBottom: '0.75rem' }}>Type: {r.type}</p>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(r)}
                    style={{ flex: 1, padding: '6px', background: 'rgba(109,40,217,0.08)', color: '#6d28d9', border: '1px solid rgba(109,40,217,0.2)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(r.id)}
                    style={{ flex: 1, padding: '6px', background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}