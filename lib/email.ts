import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'
const ADMIN = process.env.ADMIN_EMAIL || ''

export async function sendBookingConfirmation(booking: {
  name: string
  email: string
  service: string
  price: number
  date: string
  time: string
}) {
  const dateFormatted = new Date(booking.date + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  // Email to client
  await resend.emails.send({
    from: `nailsbykrsm <${FROM}>`,
    to: booking.email,
    subject: `✨ Booking request received — ${dateFormatted}`,
    html: `
      <div style="background:#080808;color:#f0e8ec;font-family:Georgia,serif;padding:40px;max-width:560px;margin:auto">
        <h1 style="font-size:2rem;color:#e8a0b4;margin-bottom:8px">nailsbykrsm</h1>
        <p style="color:#888;font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px">Montreal Nail Artist</p>

        <p style="font-size:1.1rem;margin-bottom:24px">Hey ${booking.name}, your request is in! 💅</p>

        <div style="border:1px solid rgba(200,150,180,0.2);padding:24px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#888;font-size:0.8rem;font-family:monospace;text-transform:uppercase">Service</td><td style="padding:8px 0;text-align:right">${booking.service}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:0.8rem;font-family:monospace;text-transform:uppercase">Date</td><td style="padding:8px 0;text-align:right">${dateFormatted}</td></tr>
            <tr><td style="padding:8px 0;color:#888;font-size:0.8rem;font-family:monospace;text-transform:uppercase">Time</td><td style="padding:8px 0;text-align:right">${booking.time}</td></tr>
            <tr style="border-top:1px solid rgba(200,150,180,0.2)">
              <td style="padding:12px 0;color:#e8a0b4;font-size:0.8rem;font-family:monospace;text-transform:uppercase">Total</td>
              <td style="padding:12px 0;text-align:right;color:#e8a0b4;font-size:1.2rem">$${booking.price}</td>
            </tr>
          </table>
        </div>

        <div style="border-left:3px solid #e8a0b4;padding-left:16px;margin-bottom:24px;font-size:0.9rem;color:#aaa;line-height:1.7">
          <strong style="color:#f0e8ec">Booking Policy Reminder</strong><br>
          · $20 non-refundable deposit required to confirm<br>
          · Cash or Interac<br>
          · Cancellations: 24h notice required<br>
          · 15–30min late: $15 fee · 30min+ late: cancelled
        </div>

        <p style="color:#888;font-size:0.85rem">You'll receive a confirmation once your slot is approved. Questions? DM <a href="https://instagram.com/nailsbykrsm" style="color:#e8a0b4">@nailsbykrsm</a></p>
      </div>
    `
  })

  // Notification to admin
  if (ADMIN) {
    await resend.emails.send({
      from: `Booking System <${FROM}>`,
      to: ADMIN,
      subject: `New booking — ${booking.name} · ${dateFormatted}`,
      html: `
        <div style="font-family:monospace;padding:24px;background:#111;color:#eee;max-width:480px">
          <h2 style="color:#e8a0b4">New Booking Request</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr><td style="padding:6px 0;color:#888">Name</td><td>${booking.name}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Email</td><td>${booking.email}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Service</td><td>${booking.service}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Date</td><td>${dateFormatted} @ ${booking.time}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Price</td><td>$${booking.price}</td></tr>
          </table>
          <p style="margin-top:24px;color:#888">Go to your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="color:#e8a0b4">admin dashboard</a> to confirm or cancel.</p>
        </div>
      `
    })
  }
}

export async function sendStatusUpdate(booking: {
  name: string
  email: string
  service: string
  date: string
  time: string
  status: 'confirmed' | 'cancelled'
}) {
  const dateFormatted = new Date(booking.date + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const isConfirmed = booking.status === 'confirmed'

  await resend.emails.send({
    from: `nailsbykrsm <${FROM}>`,
    to: booking.email,
    subject: isConfirmed
      ? `✅ Appointment confirmed — ${dateFormatted}`
      : `❌ Appointment cancelled — ${dateFormatted}`,
    html: `
      <div style="background:#080808;color:#f0e8ec;font-family:Georgia,serif;padding:40px;max-width:560px;margin:auto">
        <h1 style="font-size:2rem;color:#e8a0b4;margin-bottom:8px">nailsbykrsm</h1>
        <p style="font-size:1.2rem;margin:24px 0">
          Hey ${booking.name} — your appointment for <strong>${booking.service}</strong> on <strong>${dateFormatted} @ ${booking.time}</strong> has been
          <span style="color:${isConfirmed ? '#a8d4a8' : '#d4a0a0'}">${booking.status}</span>.
        </p>
        ${isConfirmed
          ? `<p style="color:#aaa;font-size:0.9rem">See you soon! Don't forget: cash or Interac, and $20 deposit to lock it in. DM <a href="https://instagram.com/nailsbykrsm" style="color:#e8a0b4">@nailsbykrsm</a> with any questions.</p>`
          : `<p style="color:#aaa;font-size:0.9rem">Feel free to rebook at a different time. DM <a href="https://instagram.com/nailsbykrsm" style="color:#e8a0b4">@nailsbykrsm</a> if you have questions.</p>`
        }
      </div>
    `
  })
}
