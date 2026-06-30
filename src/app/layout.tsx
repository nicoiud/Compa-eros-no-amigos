import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Compañeros',
  description: 'El party game de preguntas con tus amigos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#0f0f0f] text-white">
        {children}
      </body>
    </html>
  )
}
