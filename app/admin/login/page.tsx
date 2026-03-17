'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Wrong password')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'3rem', width:360, textAlign:'center' }}>
        <h1 style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'2rem', color:'var(--rose)', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>
          Admin
        </h1>
        <p className="label" style={{ marginBottom:'2rem' }}>nailsbykrsm dashboard</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key==='Enter' && login()}
          style={{
            width:'100%', padding:'0.85rem 1rem', marginBottom:'1rem',
            background:'var(--black)', border:'1px solid var(--border)',
            color:'var(--text)', fontFamily:'DM Mono,monospace', fontSize:'0.8rem',
            outline:'none', textAlign:'center', letterSpacing:'0.2em'
          }}
          onFocus={(e:any) => e.target.style.borderColor='var(--rose)'}
          onBlur={(e:any) => e.target.style.borderColor='var(--border)'}
        />
        {error && <p style={{ color:'#d4a0a0', fontFamily:'DM Mono,monospace', fontSize:'0.65rem', marginBottom:'1rem' }}>{error}</p>}
        <button className="btn-primary" onClick={login} disabled={loading} style={{ width:'100%', cursor:'pointer' }}>
          {loading ? '...' : 'Enter'}
        </button>
      </div>
    </div>
  )
}
