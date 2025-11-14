import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Worldz - Your Global Career Platform',
  description: 'Find your dream job or internship across the globe. Connect with top companies and take your career to new heights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ClientLayout>
          <main className="flex-1">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  )
} 