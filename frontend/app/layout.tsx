import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HNM Food Groups',
  description: 'Pure Goodness for All',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}