import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    const blobs = Array.from({ length: 8 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 180 + 100,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      hue: Math.random() * 60 + 200,
    }))
    let animId
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#eef2ff'
      ctx.fillRect(0, 0, w, h)
      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, `hsla(${b.hue}, 70%, 70%, 0.55)`)
        grad.addColorStop(1, `hsla(${b.hue}, 70%, 70%, 0)`)
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
        b.x += b.dx; b.y += b.dy
        if (b.x < -b.r || b.x > w + b.r) b.dx *= -1
        if (b.y < -b.r || b.y > h + b.r) b.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  const validatePassword = (pwd) => {
    const rules = [
      { test: pwd.length >= 8, msg: 'At least 8 characters' },
      { test: /[A-Z]/.test(pwd), msg: 'One uppercase letter' },
      { test: /[a-z]/.test(pwd), msg: 'One lowercase letter' },
      { test: /[0-9]/.test(pwd), msg: 'One number' },
      { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd), msg: 'One special character' },
    ]
    return rules
  }

  const handleRegister = async () => {
    setError('')
    if (password !== confirmPassword) return setError('Passwords do not match')
    const rules = validatePassword(password)
    const failed = rules.find(r => !r.test)
    if (failed) return setError(`Password must contain: ${failed.msg}`)
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  const rules = validatePassword(password)

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: '14px',
    fontSize: '15px', fontFamily: 'DM Sans, sans-serif',
    color: '#1a1a2e', outline: 'none', boxSizing: 'border-box',
    boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .reg-wrap {
          height: 100vh; width: 100vw;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }
        .reg-wrap canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
        .reg-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px; margin: 0 1.5rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(32px) saturate(200%);
          -webkit-backdrop-filter: blur(32px) saturate(200%);
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 2px 0 rgba(255,255,255,0.8) inset, 0 32px 64px rgba(100,100,200,0.15);
          padding: 2.25rem 2.25rem;
        }
        .reg-btn {
          width: 100%; padding: 0.85rem;
          background: linear-gradient(135deg, #6d28d9, #4f46e5);
          color: #fff; border: none; border-radius: 16px;
          font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; box-shadow: 0 4px 20px rgba(109,40,217,0.35);
          transition: transform 0.15s;
        }
        .reg-btn:hover { transform: translateY(-1px); }
        .reg-btn:active { transform: scale(0.98); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        label { font-size: 12px; font-weight: 500; letter-spacing: 0.6px;
          text-transform: uppercase; color: rgba(60,60,120,0.6);
          display: block; margin-bottom: 7px; }
      `}</style>

      <div className="reg-wrap">
        <canvas ref={canvasRef} />
        <div className="reg-card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '52px', height: '52px', margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, #6d28d9, #4f46e5)',
              borderRadius: '18px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px',
              boxShadow: '0 4px 16px rgba(109,40,217,0.3)'
            }}>✨</div>
            <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1a1a2e', letterSpacing: '-0.4px' }}>
              Create account
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(60,60,120,0.55)', marginTop: '5px' }}>
              Join Inventory & Workspace Manager
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '0.7rem 1rem', marginBottom: '1rem', fontSize: '13px', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '0.85rem' }}>
            <label>Email</label>
            <input style={inputStyle} type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: '0.85rem' }}>
            <label>Password</label>
            <input style={inputStyle} type="password" placeholder="Min 8 chars"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {/* password strength rules */}
          {password.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.85rem' }}>
              {rules.map((r, i) => (
                <span key={i} style={{
                  fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: '500',
                  background: r.test ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)',
                  color: r.test ? '#16a34a' : '#dc2626',
                  border: `1px solid ${r.test ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`,
                }}>
                  {r.test ? '✓' : '✗'} {r.msg}
                </span>
              ))}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label>Confirm Password</label>
            <input style={{
              ...inputStyle,
              borderColor: confirmPassword && confirmPassword !== password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.7)'
            }} type="password" placeholder="Re-enter password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            {confirmPassword && confirmPassword !== password && (
              <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '5px' }}>Passwords do not match</p>
            )}
          </div>

          <button className="reg-btn" onClick={handleRegister} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '14px', color: 'rgba(60,60,120,0.5)' }}>
            Already have one?{' '}
            <Link to="/" style={{ color: '#6d28d9', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}