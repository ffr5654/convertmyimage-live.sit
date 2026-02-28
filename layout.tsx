import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'ConvertMyImage - Fast Online Image Converter & Resizer',
  description: 'Convert JPG, PNG, WEBP and resize for Instagram, TikTok, YouTube instantly for free.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adsenseId = "ca-pub-5455421769208251";

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans bg-[#F9FAFB] text-[#1F2937] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
