import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const siteUrl = 'https://jonahduckworth.com';

export const metadata: Metadata = {
  title: 'Jonah Duckworth — Builder',
  description:
    'Software developer and entrepreneur. Founded Ref Buddy and HarvestingPro. I turn manual processes into software that scales.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: siteUrl,
    siteName: 'Jonah Duckworth',
    title: 'Jonah Duckworth — Builder',
    description:
      'Software developer and entrepreneur. Founded Ref Buddy and HarvestingPro. I turn manual processes into software that scales.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jonah Duckworth — Builder',
    description:
      'Software developer and entrepreneur. Founded Ref Buddy and HarvestingPro. I turn manual processes into software that scales.',
  },
  alternates: {
    canonical: siteUrl,
  },
};

function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jonah Duckworth',
    url: siteUrl,
    jobTitle: 'Software Developer & Entrepreneur',
    description:
      'Software developer and entrepreneur based in Calgary. Founded Ref Buddy and HarvestingPro.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Calgary',
      addressRegion: 'AB',
      addressCountry: 'CA',
    },
    email: 'mailto:jonah@jdbuilds.ca',
    sameAs: [
      'https://github.com/jonahduckworth',
      'https://linkedin.com/in/jonah-duckworth',
    ],
    knowsAbout: [
      'Software Development',
      'Entrepreneurship',
      'React',
      'Next.js',
      'Rust',
      'Go',
      'Flutter',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Thompson Rivers University',
    },
    founder: [
      {
        '@type': 'Organization',
        name: 'Ref Buddy',
        url: 'https://refbuddy.ca',
        description:
          'Sports officiating platform for scheduling, expense tracking, and game reports.',
      },
      {
        '@type': 'Organization',
        name: 'HarvestingPro',
        url: 'https://harvestingpro.com',
        description:
          'Unified platform for forestry operators to track equipment, employees, and project profitability.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
