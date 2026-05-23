import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard')
      else navigate('/')
    })
  }, [])

  return (
    <div style={{ color: '#1a1a2e', fontFamily: 'DM Sans', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '16px' }}>
      Verifying...
    </div>
  )
}