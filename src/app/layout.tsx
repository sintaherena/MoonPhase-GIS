import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0B0E14',
};

export const metadata: Metadata = {
  title: 'MoonPhase GIS',
  description:
    'Geospatial lunar phase explorer with interactive map and astronomical data panel',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'MoonPhase GIS',
    description:
      'Explore lunar phases across the globe with real-time astronomical data',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MoonPhase GIS - Geospatial Lunar Phase Explorer',
      },
    ],
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoonPhase GIS',
    description:
      'Explore lunar phases across the globe with real-time astronomical data',
    images: ['/og-image.png'],
  },
};

function ServiceWorkerRegistration() {
  // Service worker registration handled via script
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                  console.log('SW registered:', registration.scope);
                })
                .catch(function(error) {
                  console.log('SW registration failed:', error);
                });
            });
          }
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <ServiceWorkerRegistration />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {/* Skip to content link for keyboard navigation */}
        <a href="#main-content" className="skip-to-content">
          Lewati ke konten utama
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
