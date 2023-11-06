import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My portfolio',
  description: 'Next(js) version, on steroids!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
