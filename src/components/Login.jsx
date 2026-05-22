import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  const handleLogin = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .login-wrap {
          height: 100vh; width: 100vw;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }
        canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
        .glass-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 400px; margin: 0 1.5rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(32px) saturate(200%);
          -webkit-backdrop-filter: blur(32px) saturate(200%);
          border-radius: 32px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 2px 0 rgba(255,255,255,0.8) inset,
                      0 32px 64px rgba(100,100,200,0.15),
                      0 8px 16px rgba(0,0,0,0.06);
          padding: 2.75rem 2.25rem;
        }
        .glass-input {
          width: 100%; padding: 0.8rem 1rem;
          background: rgba(255,255,255,0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 14px;
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          color: #1a1a2e; outline: none;
          transition: border 0.2s, background 0.2s;
          box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset;
        }
        .glass-input::placeholder { color: rgba(80,80,120,0.45); }
        .glass-input:focus {
          background: rgba(255,255,255,0.6);
          border-color: rgba(139,92,246,0.5);
        }
        .sign-btn {
          width: 100%; padding: 0.85rem;
          background: linear-gradient(135deg, #6d28d9, #4f46e5);
          color: #fff; border: none; border-radius: 16px;
          font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; letter-spacing: 0.2px;
          box-shadow: 0 4px 20px rgba(109,40,217,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .sign-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(109,40,217,0.45); }
        .sign-btn:active { transform: scale(0.98); }
        .sign-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        label {
          font-size: 12px; font-weight: 500; letter-spacing: 0.6px;
          text-transform: uppercase; color: rgba(60,60,120,0.6);
          display: block; margin-bottom: 7px;
        }
      `}</style>

      <div className="login-wrap">
        <canvas ref={canvasRef} />

        <div className="glass-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '56px', height: '56px', margin: '0 auto 1.1rem',
              background: 'linear-gradient(135deg, #6d28d9, #4f46e5)',
              borderRadius: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(109,40,217,0.3), 0 1px 0 rgba(255,255,255,0.3) inset',
              fontSize: '26px'
            }}>📦</div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a2e', letterSpacing: '-0.4px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(60,60,120,0.55)', marginTop: '5px' }}>
              Inventory & Workspace Manager
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '12px', padding: '0.7rem 1rem',
              marginBottom: '1.25rem', fontSize: '13px', color: '#dc2626'
            }}>{error}</div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input className="glass-input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label>Password</label>
            <input className="glass-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button className="sign-btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '14px', color: 'rgba(60,60,120,0.5)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#6d28d9', fontWeight: '600', textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}