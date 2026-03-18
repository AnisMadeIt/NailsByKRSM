'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { formatTime, TIME_SLOTS } from '@/lib/services'

type Booking = {
  id: string
  name: string
  email: string
  phone: string
  service: string
  price: number
  duration_mins: number
  date: string
  time: string
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

type Tab = 'pending' | 'confirmed' | 'cancelled' | 'calendar'

const STATUS_COLOR = {
  pending: { bg: 'rgba(212,165,116,0.1)', border: 'rgba(212,165,116,0.4)', text: '#d4a574' },
  confirmed: { bg: 'rgba(168,212,168,0.1)', border: 'rgba(168,212,168,0.4)', text: '#a8d4a8' },
  cancelled: { bg: 'rgba(212,160,160,0.1)', border: 'rgba(212,160,160,0.4)', text: '#d4a0a0' },
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('pending')
  const [updating, setUpdating] = useState<string | null>(null)
  const [blockDate, setBlockDate] = useState('')
  const [blockTime, setBlockTime] = useState('')
  const [blockMsg, setBlockMsg] = useState('')
  const [blockedSlots, setBlockedSlots] = useState<{ date: string, time: string }[]>([])
  const router = useRouter()

  const loadBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings', { credentials: 'include', cache: 'no-store' })
      if (res.status === 401) { router.push('/admin/login'); return }
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [router])

  const loadBlocked = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blocked', { credentials: 'include' })
      const data = await res.json()
      setBlockedSlots(data.slots || [])
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => {
    loadBookings()
    loadBlocked()
  }, [loadBookings, loadBlocked])

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    await loadBookings()
    setUpdating(null)
  }

  async function blockSlot() {
    if (!blockDate || !blockTime) return
    setBlockMsg('Saving...')
    const res = await fetch('/api/block-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: blockDate, time: blockTime })
    })
    setBlockMsg(res.ok ? '✓ Blocked' : '✗ Error')
    loadBlocked()
    setTimeout(() => setBlockMsg(''), 2000)
  }

  async function unblockSlot(date: string, time: string) {
    await fetch('/api/block-slot', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time })
    })
    loadBlocked()
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const filtered = bookings.filter(b => b.status === tab || tab === 'calendar')
  const pending = bookings.filter(b => b.status === 'pending')
  const revenue = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.price, 0)
  const thisMonth = bookings.filter(b => {
    const d = parseISO(b.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && b.status === 'confirmed'
  }).reduce((s, b) => s + b.price, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,8,8,0.97)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2.5rem', backdropFilter: 'blur(8px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '1.4rem', letterSpacing: '0.15em', color: 'var(--rose)' }}>nailsbykrsm</span>
          <span className="label">Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {pending.length > 0 && (
            <span style={{ background: 'var(--rose)', color: 'var(--black)', fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', padding: '0.3rem 0.7rem', borderRadius: 999 }}>
              {pending.length} pending
            </span>
          )}
          <button className="btn-ghost" onClick={logout} style={{ fontSize: '0.6rem', padding: '0.5rem 1rem' }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '2rem 2.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Bookings', value: bookings.length },
            { label: 'Pending', value: pending.length },
            { label: 'This Month', value: `$${thisMonth}` },
            { label: 'All-time Revenue', value: `$${revenue}` },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem' }}>
              <p className="label" style={{ marginBottom: '0.5rem' }}>{s.label}</p>
              <p style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '2rem', color: 'var(--rose)', letterSpacing: '0.05em' }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          {(['pending', 'confirmed', 'cancelled', 'calendar'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '0.75rem 1.2rem', cursor: 'pointer', background: 'transparent', border: 'none',
              color: tab === t ? 'var(--rose)' : 'var(--muted)',
              borderBottom: tab === t ? '2px solid var(--rose)' : '2px solid transparent',
              transition: 'color 0.2s', marginBottom: '-1px'
            }}>
              {t}{t !== 'calendar' && ` (${bookings.filter(b => b.status === t).length})`}
            </button>
          ))}
        </div>

        {tab !== 'calendar' && (
          <>
            {loading ? (
              <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Loading...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontStyle: 'italic', padding: '2rem 0' }}>No {tab} bookings.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.map(b => {
                  const sc = STATUS_COLOR[b.status]
                  return (
                    <div key={b.id} style={{
                      background: 'var(--card)', border: '1px solid var(--border)', padding: '1.25rem 1.5rem',
                      display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'center',
                      borderLeft: `3px solid ${sc.border}`
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '1.1rem' }}>{b.name}</span>
                          <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.55rem', letterSpacing: '0.15em', padding: '0.2rem 0.6rem', textTransform: 'uppercase', background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{b.status}</span>
                        </div>
                        <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: 'var(--muted)' }}>{b.email} · {b.phone}</p>
                        {b.notes && <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.35rem' }}>"{b.notes}"</p>}
                      </div>
                      <div>
                        <p style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{b.service}</p>
                        <p className="label">{format(parseISO(b.date), 'EEE, MMM d yyyy')} @ {formatTime(b.time)}</p>
                        <p style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '1.3rem', color: 'var(--rose)', marginTop: '0.25rem' }}>${b.price}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 140 }}>
                        {b.status !== 'confirmed' && (
                          <button disabled={updating === b.id} onClick={() => updateStatus(b.id, 'confirmed')}
                            style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.15em', padding: '0.5rem 1rem', cursor: 'pointer', background: 'rgba(168,212,168,0.1)', border: '1px solid rgba(168,212,168,0.4)', color: '#a8d4a8', textTransform: 'uppercase', opacity: updating === b.id ? 0.5 : 1 }}>
                            {updating === b.id ? '...' : '✓ Confirm'}
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button disabled={updating === b.id} onClick={() => updateStatus(b.id, 'cancelled')}
                            style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.15em', padding: '0.5rem 1rem', cursor: 'pointer', background: 'rgba(212,160,160,0.1)', border: '1px solid rgba(212,160,160,0.3)', color: '#d4a0a0', textTransform: 'uppercase', opacity: updating === b.id ? 0.5 : 1 }}>
                            ✕ Cancel
                          </button>
                        )}
                        {b.status !== 'pending' && (
                          <button disabled={updating === b.id} onClick={() => updateStatus(b.id, 'pending')}
                            style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.15em', padding: '0.5rem 1rem', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                            ↺ Pending
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {tab === 'calendar' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '1.5rem' }}>
              <p className="label" style={{ marginBottom: '1.2rem' }}>Block a Time Slot</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)}
                  style={{ padding: '0.75rem', background: 'var(--black)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'DM Mono,monospace', fontSize: '0.75rem', outline: 'none' }} />
                <select value={blockTime} onChange={e => setBlockTime(e.target.value)}
                  style={{ padding: '0.75rem', background: 'var(--black)', border: '1px solid var(--border)', color: blockTime ? 'var(--text)' : 'var(--muted)', fontFamily: 'DM Mono,monospace', fontSize: '0.75rem', outline: 'none' }}>
                  <option value="">Select time</option>
                  {TIME_SLOTS.map(s => <option key={s} value={s}>{formatTime(s)}</option>)}
                </select>
                <button className="btn-primary" onClick={blockSlot} disabled={!blockDate || !blockTime}
                  style={{ opacity: blockDate && blockTime ? 1 : 0.4, cursor: blockDate && blockTime ? 'pointer' : 'not-allowed' }}>
                  {blockMsg || 'Block Slot'}
                </button>
              </div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '1.5rem' }}>
              <p className="label" style={{ marginBottom: '1.2rem' }}>Currently Blocked</p>
              {blockedSlots.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No blocked slots.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {blockedSlots.map(b => (
                    <div key={`${b.date}-${b.time}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(200,150,180,0.05)' }}>
                      <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.7rem', color: 'var(--text)' }}>
                        {format(parseISO(b.date), 'MMM d, yyyy')} @ {formatTime(b.time)}
                      </span>
                      <button onClick={() => unblockSlot(b.date, b.time)}
                        style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.55rem', letterSpacing: '0.1em', padding: '0.3rem 0.7rem', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(212,160,160,0.3)', color: '#d4a0a0', textTransform: 'uppercase' }}>
                        unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
