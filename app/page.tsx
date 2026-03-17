'use client'
import Link from 'next/link'
import { SERVICES } from '@/lib/services'

const CATEGORIES = ['Full Set', 'Refill', 'Removal']

const POLICY = [
  { title: 'Deposit', text: '$20 non-refundable deposit required to confirm. Applied to your total.' },
  { title: 'Payment', text: 'Cash preferred. Interac e-Transfer accepted.' },
  { title: 'Cancellations', text: 'All changes must be made at least 24 hours in advance.' },
  { title: 'Late Policy', text: '15–30 min late: $15 fee. 30+ min late: appointment cancelled.' },
]

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.4rem 3rem',
        background: 'linear-gradient(to bottom, rgba(8,8,8,0.95), transparent)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '1.6rem', letterSpacing: '0.15em', color: 'var(--rose)' }}>
          nailsbykrsm
        </span>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {['Work', 'Services', 'Policies'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{
              fontFamily: 'DM Mono,monospace', fontSize: '0.63rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none'
            }}>{s}</a>
          ))}
          <Link href="/book" className="btn-primary" style={{ padding: '0.6rem 1.4rem' }}>Book Now</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '8rem 3rem 5rem', position: 'relative', zIndex: 2 }}>
          <p className="label fade-up-1" style={{ marginBottom: '1.5rem' }}>Montreal Nail Artist · Home Based</p>
          <h1 className="fade-up-2" style={{
            fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(4rem,9vw,8rem)', lineHeight: 0.9,
            letterSpacing: '0.04em',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--rose) 50%, var(--lilac) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Nails<br />by<br />KRSM
          </h1>
          <p className="fade-up-3" style={{ fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--muted)', marginTop: '1.5rem', fontWeight: 300 }}>
            Acrylic art that speaks<br />before you do.
          </p>
          <div className="fade-up-4" style={{ marginTop: '3rem' }}>
            <Link href="/book" className="btn-primary">Book Appointment</Link>
          </div>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--deep)' }}>
          {/* Drop your hero image in /public/gallery/hero.jpg */}
          <img src="/gallery/hero.jpg" alt="Nail art" style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'brightness(0.75) saturate(1.1)'
          }} onError={(e: any) => { e.target.style.display = 'none' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, var(--black) 0%, transparent 40%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '2.5rem', right: '2.5rem', zIndex: 10,
            fontFamily: 'DM Mono,monospace', fontSize: '0.55rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', background: 'rgba(8,8,8,0.7)', border: '1px solid var(--border)',
            padding: '0.8rem 1.2rem', backdropFilter: 'blur(10px)', color: 'var(--muted)'
          }}>
            Cash / Interac · $20 Deposit
          </div>
        </div>
      </section>

      {/* GALLERY CAROUSEL */}
      <section id="work" style={{ padding: '7rem 0' }}>
        <div className="section-divider label" style={{ padding: '0 3rem' }}>Portfolio</div>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          gap: 10,
          padding: '0 3rem',
          paddingRight: 'calc(3rem + 12vw)',
          scrollbarWidth: 'none',
        }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} style={{
              flex: '0 0 320px', height: 320,
              scrollSnapAlign: 'start',
              overflow: 'hidden', position: 'relative',
              background: 'var(--card)', borderRadius: 2, flexShrink: 0,
            }}>
              <img
                src={`/gallery/${n}.jpg`}
                alt={`Nail art ${n}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.9) brightness(0.85)', transition: 'transform 0.5s, filter 0.5s' }}
                onMouseEnter={(e: any) => { e.target.style.transform = 'scale(1.06)'; e.target.style.filter = 'saturate(1.2) brightness(1)' }}
                onMouseLeave={(e: any) => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'saturate(0.9) brightness(0.85)' }}
                onError={(e: any) => { e.target.style.display = 'none' }}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.5rem', letterSpacing: '0.2em', color: 'var(--border)', textTransform: 'uppercase' }}>
                  gallery/{n}.jpg
                </span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--muted)', textAlign: 'center', marginTop: '1.5rem' }}>
          Drop your photos as /public/gallery/1.jpg through 6.jpg
        </p>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '6rem 3rem', background: 'var(--deep)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', right: '3rem', top: '4rem',
          fontFamily: 'Bebas Neue,sans-serif', fontSize: '8rem',
          color: 'rgba(200,150,180,0.04)', letterSpacing: '0.1em', userSelect: 'none'
        }}>MENU</div>

        <div className="section-divider label">Services & Pricing</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 4rem' }}>
          {CATEGORIES.map(cat => {
            const items = SERVICES.filter(s => s.category === cat)
            return (
              <div key={cat}>
                <p className="label" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.2rem' }}>{cat}</p>
                {items.map(s => (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '0.85rem 0', borderBottom: '1px solid rgba(200,150,180,0.05)',
                    transition: 'padding 0.25s, border-color 0.25s'
                  }}
                    onMouseEnter={(e: any) => { e.currentTarget.style.paddingLeft = '0.5rem'; e.currentTarget.style.borderColor = 'var(--border)' }}
                    onMouseLeave={(e: any) => { e.currentTarget.style.paddingLeft = '0'; e.currentTarget.style.borderColor = 'rgba(200,150,180,0.05)' }}
                  >
                    <span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 300 }}>{s.name}</span>
                      <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.55rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>
                        {Math.floor(s.duration / 60)}h{s.duration % 60 ? ` ${s.duration % 60}min` : ''}
                      </span>
                    </span>
                    <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '1.3rem', color: 'var(--rose)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                      ${s.price}
                    </span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </section>

      {/* POLICIES */}
      <section id="policies" style={{ padding: '5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start', borderTop: '1px solid var(--border)' }}>
        <div>
          <div className="section-divider label" style={{ marginBottom: '1.5rem' }}>Policies</div>
          <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '3.5rem', lineHeight: 1, color: 'var(--rose)', letterSpacing: '0.05em' }}>
            Read<br />Before<br />Booking.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          {POLICY.map(p => (
            <div key={p.title} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              padding: '1.5rem', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
                background: 'linear-gradient(to bottom, var(--rose), var(--lilac))'
              }} />
              <p className="label" style={{ marginBottom: '0.6rem' }}>{p.title}</p>
              <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, color: 'rgba(240,232,236,0.8)' }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOOK CTA */}
      <section style={{
        padding: '7rem 3rem', textAlign: 'center', background: 'var(--deep)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(200,130,160,0.08) 0%, transparent 70%)'
        }} />
        <p className="label" style={{ marginBottom: '1rem' }}>Ready?</p>
        <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(3rem,7vw,6rem)', letterSpacing: '0.06em', lineHeight: 1, marginBottom: '1rem' }}>
          Book Your<br /><span style={{ color: 'var(--rose)' }}>Appointment</span>
        </h2>
        <p style={{ fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--muted)', marginBottom: '3rem' }}>
          Slots fill up fast. Secure yours now.
        </p>
        <Link href="/book" className="btn-primary">Reserve a Slot</Link>
        <p className="label" style={{ marginTop: '1.5rem' }}>Montreal · Home Based · @nailsbykrsm</p>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '2.5rem 3rem', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '1.2rem', letterSpacing: '0.15em', color: 'var(--muted)' }}>NAILSBYKRSM</span>
        <a href="https://instagram.com/nailsbykrsm" target="_blank" rel="noreferrer"
          style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--muted)', textDecoration: 'none' }}>
          @nailsbykrsm
        </a>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--muted)' }}>Montréal, QC</span>
      </footer>
    </>
  )
}
