'use client'

import './globals.css'
import Navbar from '@/components/Navbar'
import './utils/amplify'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
