import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'PRoast - Get Your Code Brutally Roasted by AI',
  description: 'Submit your code and get brutally honest (but helpful) feedback. Choose your pain level from gentle to savage.',
  metadataBase: new URL('https://proast.vercel.app'),
  openGraph: {
    title: 'PRoast - Get Your Code Roasted',
    description: 'How bad is your code? Find out.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono min-h-screen bg-retro-deep text-retro-secondary antialiased">
        {children}
      </body>
    </html>
  )
}
