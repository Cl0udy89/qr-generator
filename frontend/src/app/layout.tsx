import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QrCode } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QR Code Generator & Analytics',
  description: 'Manage and track your QR Code campaigns.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-900`}>
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <QrCode size={24} />
              </div>
              <span className="font-bold text-xl text-slate-800">QRytics MVP</span>
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
