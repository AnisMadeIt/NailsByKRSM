'use client'
import Link from 'next/link'
import { SERVICES } from '@/lib/services'

const CATEGORIES = ['Full Set', 'Refill', 'Removal']

const POLICY = [
  { title: 'Deposit', text: '$20 non-refundable deposit required. Applied to your total.' },
  { title: 'Payment', text: 'Cash preferred. Interac e-Transfer accepted.' },
  { title: 'Cancellations', text: 'All changes must be made at least 24 hours in advance.' },
  { title: 'Late Policy', text: '15–30 min late: $15 fee. 30+ min late: appointment cancelled.' },
]

export default function Home() {
  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .policy-grid { grid-template-columns: 1fr !important; }
          .policy-layout { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .hero-section { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .hero-left { padding: 7rem 1.25rem 3rem !important; }
          .gallery-item { flex: 0 0 85vw !important; height: 80vw !important; }
          .book-section { padding: 4rem 1.25rem !important; }
          .services-section { padding: 3rem 1.25rem !important; }
          .policy-section { padding: 3rem 1.25rem !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '1.5rem', letterSpacing: '0.15em', color: 'var(--rose)' }}>
          nailsbykrsm
        </span>
        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {['Work', 'Services', 'Policies'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.63rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}>{s}</a>
          ))}
        </div>
        <Link href="/book" style={{
          fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          padding: '0.65rem 1.2rem', border: '1px solid var(--rose)', color: 'var(--rose)', textDecoration: 'none', background: 'transparent'
        }}>Book Now</Link>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{
        minHeight: '100svh', display: 'grid', gridTemplateColumns: '1fr 1fr',
        position: 'relative', overflow: 'hidden'
      }}>
        <div className="hero-left" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '8rem 3rem 5rem', position: 'relative', zIndex: 2 }}>
          <p className="label fade-up-1" style={{ marginBottom: '1.5rem' }}>Montreal Nail Artist · Home Based</p>
          <h1 className="fade-up-2" style={{
            fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(4rem,9vw,8rem)', lineHeight: 0.9, letterSpacing: '0.04em',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--rose) 50%, var(--lilac) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Nails<br />by<br />KRSM</h1>
          <p className="fade-up-3" style={{ fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--muted)', marginTop: '1.5rem', fontWeight: 300 }}>
            Acrylic art that speaks<br />before you do.
          </p>
          <div className="fade-up-4" style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" className="btn-primary">Book Appointment</Link>
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--border)', padding: '0.6rem 0.9rem' }}>
              $20 Deposit
            </span>
          </div>
        </div>
        <div className="hero-right" style={{ position: 'relative', overflow: 'hidden', background: 'var(--deep)' }}>
          <img src="/gallery/hero.jpg" alt="Nail art" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) saturate(1.1)' }}
            onError={(e: any) => { e.target.style.display = 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--black) 0%, transparent 40%)' }} />
        </div>
      </section>

      {/* GALLERY CAROUSEL */}
      <section id="work" style={{ padding: '4rem 0' }}>
        <div className="section-divider label" style={{ padding: '0 1.5rem' }}>Portfolio</div>
        <div style={{
          display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch', gap: 10,
          padding: '0 1.5rem', paddingRight: 'calc(1.5rem + 15vw)',
          scrollbarWidth: 'none',
        }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="gallery-item" style={{
              flex: '0 0 78vw', height: '72vw', maxHeight: 340,
              scrollSnapAlign: 'start', overflow: 'hidden',
              background: 'var(--card)', borderRadius: 2, flexShrink: 0,
            }}>
              <img src={`/gallery/${n}.jpg`} alt={`Nail art ${n}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.95) brightness(0.88)', display: 'block' }}
                onError={(e: any) => { e.target.style.display = 'none' }} />
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services-section" style={{ padding: '4rem 3rem', background: 'var(--deep)' }}>
        <div className="section-divider label">Services & Pricing</div>
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 4rem' }}>
          {CATEGORIES.map(cat => (
            <div key={cat} style={{ marginBottom: '2rem' }}>
              <p className="label" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.2rem' }}>{cat}</p>
              {SERVICES.filter(s => s.category === cat).map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid rgba(200,150,180,0.06)' }}>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 300 }}>{s.name}</div>
                    <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.52rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                      {Math.floor(s.duration / 60)}h{s.duration % 60 ? ` ${s.duration % 60}min` : ''}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '1.35rem', color: 'var(--rose)', marginLeft: '1rem', flexShrink: 0 }}>${s.price}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* POLICIES */}
      <section id="policies" className="policy-section" style={{ padding: '4rem 3rem', borderTop: '1px solid var(--border)' }}>
        <div className="section-divider label">Policies</div>
        <div className="policy-layout" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3rem', alignItems: 'start' }}>
          <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '3rem', lineHeight: 1, color: 'var(--rose)', letterSpacing: '0.04em' }}>
            Read<br />Before<br />Booking.
          </h2>
          <div className="policy-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {POLICY.map(p => (
              <div key={p.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '1.1rem 1.1rem 1.1rem 1.4rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'linear-gradient(to bottom, var(--rose), var(--lilac))' }} />
                <p className="label" style={{ marginBottom: '0.4rem' }}>{p.title}</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.6, color: 'rgba(240,232,236,0.8)' }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK CTA */}
      <section className="book-section" style={{ padding: '5rem 3rem', textAlign: 'center', background: 'var(--deep)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(200,130,160,0.09) 0%, transparent 70%)' }} />
        <p className="label" style={{ marginBottom: '1rem' }}>Ready?</p>
        <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(2.5rem,7vw,5rem)', letterSpacing: '0.06em', lineHeight: 1, marginBottom: '1rem' }}>
          Book Your<br /><span style={{ color: 'var(--rose)' }}>Appointment</span>
        </h2>
        <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '2.5rem' }}>Slots fill up fast. Secure yours now.</p>
        <Link href="/book" className="btn-primary">Reserve a Slot</Link>
        <p className="label" style={{ marginTop: '1.5rem' }}>Montreal · Home Based · @nailsbykrsm</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '1.1rem', letterSpacing: '0.15em', color: 'var(--muted)' }}>NAILSBYKRSM</span>
        <a href="https://instagram.com/nailsbykrsm" target="_blank" rel="noreferrer" style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--rose)', textDecoration: 'none' }}>@nailsbykrsm</a>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--muted)' }}>Montréal, QC</span>
      </footer>
    </>
  )
}
