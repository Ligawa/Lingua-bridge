import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Lato } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const lato = Lato({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-body', display: 'swap' })

const linguaBridgeLogo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%206%2C%202026%2C%2003_08_50%20PM-90soxHyLHqGFp3wNGrmkrGydAqqFzT.png'

export const metadata: Metadata = {
  title: 'LinguaBridge – Urgent Translations & Short Courses',
  description:
    'LinguaBridge connects people and opportunities through urgent professional translations and practical short courses.',
  icons: { icon: linguaBridgeLogo, apple: linguaBridgeLogo },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lato.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Footer />
        </ThemeProvider>

        {/* Zoho SalesIQ Chat Widget */}
        <Script
          id="zoho-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`,
          }}
        />
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.com/widget?wc=siqd1a796ef77dd6088fd85fc9962bd1534"
          strategy="afterInteractive"
          defer
        />
      </body>
    </html>
  )
}
