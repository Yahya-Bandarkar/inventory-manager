import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Inventory({ session }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', quantity: '', price: '', description: '' })
  const [editId, setEditId] = useState(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.name) return
    const payload = {
      name: form.name,
      category: form.category,
      quantity: parseInt(form.quantity) || 0,
      price: parseFloat(form.price) || 0,
      description: form.description,
      created_by: session.user.id,
    }
    if (editId) {
      await supabase.from('items').update(payload).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('items').insert(payload)
    }
    setForm({ name: '', category: '', quantity: '', price: '', description: '' })
    setShowForm(false)
    fetchItems()
  }

  const handleEdit = (item) => {
    setForm({ name: item.name, category: item.category || '', quantity: item.quantity || '', price: item.price || '', description: item.description || '' })
    setEditId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    await supabase.from('items').delete().eq('id', id)
    fetchItems()
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
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>Inventory</h2>
          <p style={{ fontSize: '13px', color: 'rgba(60,60,120,0.5)', marginTop: '2px' }}>{items.length} items total</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', category: '', quantity: '', price: '', description: '' }) }}
          style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input style={inputStyle} placeholder="Item name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input style={inputStyle} placeholder="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            <input style={inputStyle} placeholder="Price (₹)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <input style={{ ...inputStyle, marginBottom: '0.75rem' }} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button onClick={handleSubmit}
            style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            {editId ? 'Update Item' : 'Save Item'}
          </button>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'rgba(60,60,120,0.5)', fontSize: '14px' }}>Loading...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(60,60,120,0.4)' }}>
          <div style={{ fontSize: '40px', marginBottom: '0.75rem' }}>📦</div>
          <p style={{ fontSize: '15px' }}>No items yet. Add your first item!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '14px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>{item.name}</h3>
                {item.category && (
                  <span style={{ fontSize: '11px', background: 'rgba(109,40,217,0.1)', color: '#6d28d9', padding: '2px 8px', borderRadius: '20px', fontWeight: '500' }}>{item.category}</span>
                )}
              </div>
              {item.description && <p style={{ fontSize: '13px', color: 'rgba(60,60,120,0.55)', marginBottom: '0.75rem' }}>{item.description}</p>}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '13px', color: 'rgba(60,60,120,0.6)' }}>Qty: <strong style={{ color: '#1a1a2e' }}>{item.quantity}</strong></span>
                <span style={{ fontSize: '13px', color: 'rgba(60,60,120,0.6)' }}>₹<strong style={{ color: '#1a1a2e' }}>{item.price}</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)}
                  style={{ flex: 1, padding: '6px', background: 'rgba(109,40,217,0.08)', color: '#6d28d9', border: '1px solid rgba(109,40,217,0.2)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)}
                  style={{ flex: 1, padding: '6px', background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}