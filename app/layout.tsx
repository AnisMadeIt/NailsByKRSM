import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'nailsbykrsm — Montreal Nail Artist',
  description: 'Montreal-based nail tech specializing in acrylic art. Book your appointment online.',
  openGraph: {
    title: 'nailsbykrsm',
    description: 'Montreal Nail Artist · Acrylic Sets · Book Online',
    siteName: 'nailsbykrsm',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
