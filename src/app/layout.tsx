import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PRoast - Get Your Code Brutally Roasted by AI',
  description: 'Submit your code and get brutally honest (but helpful) feedback. Choose your pain level from gentle to savage.',
  openGraph: {
    title: 'PRoast - Get Your Code Roasted 🔥',
    description: 'How bad is your code? Find out.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">{children}</body>
    </html>
  )
}
