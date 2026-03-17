'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SERVICES, TIME_SLOTS, formatTime } from '@/lib/services'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore, startOfToday, isSameDay } from 'date-fns'

type Step = 'service' | 'datetime' | 'details' | 'done'

const CATEGORIES = ['Full Set', 'Refill', 'Removal']

export default function BookPage() {
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Calendar
  const today = startOfToday()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = getDay(monthStart) // 0=Sun

  async function selectDate(date: Date) {
    setSelectedDate(date)
    setSelectedTime(null)
    setLoadingSlots(true)
    try {
      const res = await fetch(`/api/available-slots?date=${format(date,'yyyy-MM-dd')}&duration=${selectedService?.duration ?? 120}`)
      const data = await res.json()
      setAvailableSlots(data.slots || [])
    } catch {
      setAvailableSlots(TIME_SLOTS)
    }
    setLoadingSlots(false)
  }

  async function submitBooking() {
    if (!selectedService || !selectedDate || !selectedTime) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service: selectedService.name,
          price: selectedService.price,
          duration_mins: selectedService.duration,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStep('done')
    } catch (e: any) {
      setError(e.message)
    }
    setSubmitting(false)
  }

  const S = { padding: '5rem 3rem', maxWidth: 900, margin: '0 auto' }

  return (
    <>
      {/* NAV */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'1.2rem 3rem',
        background:'rgba(8,8,8,0.95)', backdropFilter:'blur(8px)',
        borderBottom:'1px solid var(--border)',
      }}>
        <Link href="/" style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'1.4rem', letterSpacing:'0.15em', color:'var(--rose)', textDecoration:'none' }}>
          nailsbykrsm
        </Link>
        <span className="label">Book Appointment</span>
      </nav>

      <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>

        {/* STEP INDICATOR */}
        <div style={{ padding:'2rem 3rem 0', maxWidth:900, margin:'0 auto' }}>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
            {(['service','datetime','details'] as Step[]).map((s, i) => (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <div style={{
                  width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  border:`1px solid ${step===s ? 'var(--rose)' : 'var(--border)'}`,
                  background: step===s ? 'var(--rose)' : 'transparent',
                  fontFamily:'DM Mono,monospace', fontSize:'0.65rem',
                  color: step===s ? 'var(--black)' : 'var(--muted)',
                  transition:'all 0.3s'
                }}>
                  {i+1}
                </div>
                <span className="label" style={{ color: step===s ? 'var(--rose)' : 'var(--muted)' }}>
                  {s==='service'?'Service':s==='datetime'?'Date & Time':'Your Info'}
                </span>
                {i<2 && <span style={{ color:'var(--border)', margin:'0 0.5rem' }}>—</span>}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: SERVICE */}
        {step === 'service' && (
          <div style={S}>
            <h2 className="fade-up-1" style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'2.8rem', letterSpacing:'0.05em', marginBottom:'2.5rem', color:'var(--rose)' }}>
              Pick Your Service
            </h2>
            {CATEGORIES.map(cat => (
              <div key={cat} style={{ marginBottom:'2rem' }}>
                <p className="label" style={{ paddingBottom:'0.75rem', borderBottom:'1px solid var(--border)', marginBottom:'0.5rem' }}>{cat}</p>
                {SERVICES.filter(s => s.category === cat).map(s => (
                  <div key={s.id}
                    onClick={() => setSelectedService(s)}
                    style={{
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                      padding:'1rem', marginBottom:'0.4rem', cursor:'pointer',
                      border:`1px solid ${selectedService?.id===s.id ? 'var(--rose)' : 'var(--border)'}`,
                      background: selectedService?.id===s.id ? 'rgba(232,160,180,0.06)' : 'transparent',
                      transition:'all 0.25s'
                    }}
                  >
                    <div>
                      <span style={{ fontSize:'1.15rem', fontWeight:300 }}>{s.name}</span>
                      <span className="label" style={{ marginLeft:'1rem' }}>
                        {Math.floor(s.duration/60)}h{s.duration%60?` ${s.duration%60}min`:''}
                      </span>
                    </div>
                    <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'1.4rem', color:'var(--rose)' }}>${s.price}</span>
                  </div>
                ))}
              </div>
            ))}
            <button
              className="btn-primary"
              disabled={!selectedService}
              onClick={() => setStep('datetime')}
              style={{ marginTop:'1rem', opacity: selectedService ? 1 : 0.4, cursor: selectedService ? 'pointer' : 'not-allowed' }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2: DATE & TIME */}
        {step === 'datetime' && (
          <div style={S}>
            <h2 className="fade-up-1" style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'2.8rem', letterSpacing:'0.05em', marginBottom:'0.5rem', color:'var(--rose)' }}>
              Pick a Date
            </h2>
            <p style={{ color:'var(--muted)', fontStyle:'italic', marginBottom:'2.5rem' }}>
              Service: {selectedService?.name} · ${selectedService?.price}
            </p>

            {/* CALENDAR */}
            <div style={{ background:'var(--card)', border:'1px solid var(--border)', padding:'1.5rem', marginBottom:'2rem', maxWidth:380 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <button onClick={() => setCurrentMonth(m => subMonths(m,1))} className="btn-ghost" style={{ padding:'0.4rem 0.8rem' }}>←</button>
                <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'1.3rem', letterSpacing:'0.1em' }}>
                  {format(currentMonth,'MMMM yyyy').toUpperCase()}
                </span>
                <button onClick={() => setCurrentMonth(m => addMonths(m,1))} className="btn-ghost" style={{ padding:'0.4rem 0.8rem' }}>→</button>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:'0.5rem' }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} className="label" style={{ textAlign:'center', padding:'0.3rem 0' }}>{d}</div>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
                {Array.from({length: startDay}).map((_,i) => <div key={`e${i}`} />)}
                {days.map(day => {
                  const past = isBefore(day, today)
                  const isSun = getDay(day) === 0
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const disabled = past || isSun
                  return (
                    <button key={day.toISOString()}
                      disabled={disabled}
                      onClick={() => !disabled && selectDate(day)}
                      style={{
                        padding:'0.5rem', textAlign:'center', cursor: disabled ? 'not-allowed' : 'pointer',
                        fontFamily:'DM Mono,monospace', fontSize:'0.7rem',
                        background: isSelected ? 'var(--rose)' : 'transparent',
                        color: isSelected ? 'var(--black)' : disabled ? 'rgba(240,232,236,0.2)' : 'var(--text)',
                        border: isSelected ? '1px solid var(--rose)' : '1px solid transparent',
                        transition:'all 0.2s',
                      }}
                      onMouseEnter={(e:any) => { if(!disabled && !isSelected) e.currentTarget.style.borderColor='var(--border)' }}
                      onMouseLeave={(e:any) => { if(!disabled && !isSelected) e.currentTarget.style.borderColor='transparent' }}
                    >
                      {format(day,'d')}
                    </button>
                  )
                })}
              </div>
              <p className="label" style={{ marginTop:'1rem', textAlign:'center' }}>Closed Sundays</p>
            </div>

            {/* TIME SLOTS */}
            {selectedDate && (
              <div style={{ marginBottom:'2rem' }}>
                <p className="label" style={{ marginBottom:'1rem' }}>Available Times — {format(selectedDate,'EEEE, MMMM d')}</p>
                {loadingSlots ? (
                  <p style={{ color:'var(--muted)', fontStyle:'italic' }}>Loading slots...</p>
                ) : availableSlots.length === 0 ? (
                  <p style={{ color:'var(--muted)', fontStyle:'italic' }}>No slots available this day. Pick another date.</p>
                ) : (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {availableSlots.map(slot => (
                      <button key={slot}
                        onClick={() => setSelectedTime(slot)}
                        style={{
                          fontFamily:'DM Mono,monospace', fontSize:'0.7rem', letterSpacing:'0.1em',
                          padding:'0.6rem 1.1rem', cursor:'pointer',
                          background: selectedTime===slot ? 'var(--rose)' : 'transparent',
                          color: selectedTime===slot ? 'var(--black)' : 'var(--text)',
                          border:`1px solid ${selectedTime===slot ? 'var(--rose)' : 'var(--border)'}`,
                          transition:'all 0.2s'
                        }}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display:'flex', gap:'1rem', marginTop:'1rem' }}>
              <button className="btn-ghost" onClick={() => setStep('service')}>← Back</button>
              <button
                className="btn-primary"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep('details')}
                style={{ opacity: selectedDate && selectedTime ? 1 : 0.4, cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed' }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONTACT INFO */}
        {step === 'details' && (
          <div style={S}>
            <h2 className="fade-up-1" style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'2.8rem', letterSpacing:'0.05em', marginBottom:'0.5rem', color:'var(--rose)' }}>
              Your Info
            </h2>
            <p style={{ color:'var(--muted)', fontStyle:'italic', marginBottom:'2.5rem' }}>
              {selectedService?.name} · {selectedDate && format(selectedDate,'MMM d')} @ {selectedTime && formatTime(selectedTime)}
            </p>

            <div style={{ maxWidth:480, display:'flex', flexDirection:'column', gap:'1.2rem', marginBottom:'2rem' }}>
              {[
                { key:'name', label:'Full Name', type:'text', placeholder:'Your name' },
                { key:'email', label:'Email', type:'email', placeholder:'your@email.com' },
                { key:'phone', label:'Phone', type:'tel', placeholder:'514-xxx-xxxx' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label" style={{ display:'block', marginBottom:'0.5rem' }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    placeholder={f.placeholder}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{
                      width:'100%', padding:'0.85rem 1rem',
                      background:'var(--card)', border:'1px solid var(--border)',
                      color:'var(--text)', fontFamily:'Cormorant Garamond,serif', fontSize:'1rem',
                      outline:'none', transition:'border-color 0.3s'
                    }}
                    onFocus={(e:any) => e.target.style.borderColor='var(--rose)'}
                    onBlur={(e:any) => e.target.style.borderColor='var(--border)'}
                  />
                </div>
              ))}
              <div>
                <label className="label" style={{ display:'block', marginBottom:'0.5rem' }}>Notes (optional)</label>
                <textarea
                  value={form.notes}
                  placeholder="Inspo, design requests, anything else..."
                  rows={3}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  style={{
                    width:'100%', padding:'0.85rem 1rem',
                    background:'var(--card)', border:'1px solid var(--border)',
                    color:'var(--text)', fontFamily:'Cormorant Garamond,serif', fontSize:'1rem',
                    outline:'none', resize:'vertical', transition:'border-color 0.3s'
                  }}
                  onFocus={(e:any) => e.target.style.borderColor='var(--rose)'}
                  onBlur={(e:any) => e.target.style.borderColor='var(--border)'}
                />
              </div>
            </div>

            {/* POLICY REMINDER */}
            <div style={{ maxWidth:480, background:'var(--card)', border:'1px solid var(--border)', padding:'1.2rem', marginBottom:'2rem' }}>
              <p className="label" style={{ marginBottom:'0.75rem' }}>Booking Policy</p>
              <ul style={{ fontFamily:'DM Mono,monospace', fontSize:'0.65rem', color:'var(--muted)', lineHeight:2, listStyle:'none' }}>
                <li>· $20 non-refundable deposit required</li>
                <li>· Cash or Interac accepted</li>
                <li>· Cancellations: 24h notice required</li>
                <li>· 15–30min late: $15 fee · 30min+: cancelled</li>
              </ul>
            </div>

            {error && (
              <p style={{ color:'#d4a0a0', fontFamily:'DM Mono,monospace', fontSize:'0.7rem', marginBottom:'1rem' }}>
                ⚠ {error}
              </p>
            )}

            <div style={{ display:'flex', gap:'1rem' }}>
              <button className="btn-ghost" onClick={() => setStep('datetime')}>← Back</button>
              <button
                className="btn-primary"
                disabled={submitting || !form.name || !form.email || !form.phone}
                onClick={submitBooking}
                style={{ opacity: (!submitting && form.name && form.email && form.phone) ? 1 : 0.4 }}
              >
                {submitting ? 'Sending...' : 'Confirm Request →'}
              </button>
            </div>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div style={{ ...S, textAlign:'center', paddingTop:'8rem' }}>
            <p style={{ fontSize:'3rem', marginBottom:'1.5rem' }}>💅</p>
            <h2 style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'3rem', letterSpacing:'0.05em', color:'var(--rose)', marginBottom:'1rem' }}>
              Request Sent!
            </h2>
            <p style={{ fontSize:'1.2rem', fontStyle:'italic', color:'var(--muted)', marginBottom:'0.75rem', maxWidth:480, margin:'0 auto 1.5rem' }}>
              You'll get a confirmation email once your slot is approved. Check your inbox!
            </p>
            <p className="label" style={{ marginBottom:'3rem' }}>
              Questions? DM <a href="https://instagram.com/nailsbykrsm" target="_blank" rel="noreferrer" style={{ color:'var(--rose)' }}>@nailsbykrsm</a>
            </p>
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
        )}

      </div>
    </>
  )
}
