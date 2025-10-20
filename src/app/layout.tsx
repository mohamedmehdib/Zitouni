import type { Metadata } from "next";
import './globals.css';

// Base metadata that will be extended based on language
const baseMetadata = {
  authors: [{ name: "Zitouni Pro Talent" }],
  creator: "Zitouni Pro Talent",
  publisher: "Zitouni Pro Talent",
  metadataBase: new URL('https://zitouni-pro-talent.tn'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/ar',
      'fr': '/fr',
      'en': '/en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'sports' as const,
};

// French Metadata
const frenchMetadata: Metadata = {
  ...baseMetadata,
  title: "Zitouni Pro Talent - Agence de Découverte de Talents Footballistiques en Tunisie",
  description: "Zitouni Pro Talent - L'agence leader en Tunisie pour la découverte et le développement des talents footballistiques. Nous aidons les joueurs tunisiens à obtenir des opportunités professionnelles en Turquie, Espagne, Émirats Arabes Unis, Albanie et autres pays. Formation, tests et représentation professionnelle pour les joueurs de football.",
  keywords: [
    "agence football Tunisie",
    "découverte talents football",
    "joueurs tunisiens professionnels",
    "opportunités football Europe",
    "Zitouni Pro Talent",
    "représentation joueurs football",
    "tests football Tunisie",
    "missions joueurs à l'étranger",
    "football tunisien",
    "joueurs en Turquie",
    "joueurs en Espagne",
    "joueurs aux Émirats",
    "joueurs en Albanie",
    "académie football Tunisie",
    "développement talents football",
    "Sousse Tunisie football",
    "agence sportive Tunisie",
    "missions sportives",
    "professionnels football",
    "formation football"
  ].join(", "),
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: 'https://zitouni-pro-talent.tn',
    siteName: 'Zitouni Pro Talent',
    title: 'Zitouni Pro Talent - Agence de Découverte de Talents Footballistiques en Tunisie',
    description: 'L\'agence leader en Tunisie pour la découverte et le développement des talents footballistiques. Opportunités professionnelles en Turquie, Espagne, Émirats Arabes Unis, Albanie et autres.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zitouni Pro Talent - Découverte de Talents Footballistiques',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zitouni Pro Talent - Agence de Découverte de Talents Footballistiques en Tunisie',
    description: 'L\'agence leader en Tunisie pour la découverte et le développement des talents footballistiques. Opportunités professionnelles en Turquie, Espagne, Émirats Arabes Unis, Albanie et autres.',
    images: ['/twitter-image.jpg'],
    creator: '@ZitouniProTalent',
  },
};

// English Metadata
const englishMetadata: Metadata = {
  ...baseMetadata,
  title: "Zitouni Pro Talent - Football Talent Discovery Agency in Tunisia",
  description: "Zitouni Pro Talent - The leading agency in Tunisia for discovering and developing football talents. We help Tunisian players get professional opportunities in Turkey, Spain, UAE, Albania and other countries. Training, trials, and professional representation for football players.",
  keywords: [
    "football agency Tunisia",
    "football talent discovery",
    "professional Tunisian players",
    "football opportunities Europe",
    "Zitouni Pro Talent",
    "football players representation",
    "football trials Tunisia",
    "players missions abroad",
    "Tunisian football",
    "players in Turkey",
    "players in Spain",
    "players in UAE",
    "players in Albania",
    "football academy Tunisia",
    "talent development football",
    "Sousse Tunisia football",
    "sports agency Tunisia",
    "sports missions",
    "football professionals",
    "football training"
  ].join(", "),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zitouni-pro-talent.tn',
    siteName: 'Zitouni Pro Talent',
    title: 'Zitouni Pro Talent - Football Talent Discovery Agency in Tunisia',
    description: 'The leading agency in Tunisia for discovering and developing football talents. Professional opportunities in Turkey, Spain, UAE, Albania and other countries.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zitouni Pro Talent - Football Talent Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zitouni Pro Talent - Football Talent Discovery Agency in Tunisia',
    description: 'The leading agency in Tunisia for discovering and developing football talents. Professional opportunities in Turkey, Spain, UAE, Albania and other countries.',
    images: ['/twitter-image.jpg'],
    creator: '@ZitouniProTalent',
  },
};

// Arabic Metadata
const arabicMetadata: Metadata = {
  ...baseMetadata,
  title: "Zitouni Pro Talent - وكالة اكتشاف المواهب الكروية في تونس",
  description: "Zitouni Pro Talent - الوكالة الرائدة في تونس لاكتشاف وتطوير المواهب الكروية. نساعد اللاعبين التونسيين في الحصول على فرص احترافية في تركيا، إسبانيا، الإمارات، ألبانيا ودول أخرى. تدريب، اختبارات، وتمثيل احترافي للاعبي كرة القدم.",
  keywords: [
    "وكالة كرة القدم تونس",
    "اكتشاف المواهب الكروية",
    "لاعبين تونسيين محترفين",
    "فرص كرة القدم في أوروبا",
    "Zitouni Pro Talent",
    "تمثيل لاعبين كرة قدم",
    "اختبارات كرة القدم تونس",
    "بعثات لاعبين إلى الخارج",
    "كرة القدم التونسية",
    "لاعبين في تركيا",
    "لاعبين في إسبانيا",
    "لاعبين في الإمارات",
    "لاعبين في ألبانيا",
    "أكاديمية كرة القدم تونس",
    "تطوير المواهب الكروية",
    "سوسة تونس كرة القدم",
    "وكالة رياضية تونس",
    "بعثات رياضية",
    "محترفين كرة القدم",
    "تدريب كرة القدم"
  ].join(", "),
  openGraph: {
    type: 'website',
    locale: 'ar_TN',
    url: 'https://zitouni-pro-talent.tn',
    siteName: 'Zitouni Pro Talent',
    title: 'Zitouni Pro Talent - وكالة اكتشاف المواهب الكروية في تونس',
    description: 'الوكالة الرائدة في تونس لاكتشاف وتطوير المواهب الكروية. فرص احترافية في تركيا، إسبانيا، الإمارات، ألبانيا وغيرها.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zitouni Pro Talent - اكتشاف المواهب الكروية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zitouni Pro Talent - وكالة اكتشاف المواهب الكروية في تونس',
    description: 'الوكالة الرائدة في تونس لاكتشاف وتطوير المواهب الكروية. فرص احترافية في تركيا، إسبانيا، الإمارات، ألبانيا وغيرها.',
    images: ['/twitter-image.jpg'],
    creator: '@ZitouniProTalent',
  },
};

// Function to get metadata based on language
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const { lang } = params;
  
  switch (lang) {
    case 'ar':
      return arabicMetadata;
    case 'en':
      return englishMetadata;
    case 'fr':
    default:
      return frenchMetadata;
  }
}

// JSON-LD data in multiple languages
const getJsonLdData = (lang: string) => {
  const data = {
    ar: {
      organization: {
        '@context': 'https://schema.org',
        '@type': 'SportsOrganization',
        name: 'Zitouni Pro Talent',
        alternateName: 'وكالة زيتوني للمواهب المحترفة',
        description: 'وكالة رياضية متخصصة في اكتشاف وتطوير المواهب الكروية التونسية وتمثيلهم في البطولات الدولية',
        url: 'https://zitouni-pro-talent.tn',
        logo: 'https://zitouni-pro-talent.tn/logo.png',
        telephone: '+216-XX-XXX-XXX',
        email: 'info@zitouni-pro-talent.tn',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'شارع الحبيب بورقيبة',
          addressLocality: 'سوسة',
          addressRegion: 'سوسة',
          postalCode: '4000',
          addressCountry: 'TN'
        },
        areaServed: ['تونس', 'شمال أفريقيا', 'الوطن العربي'],
        serviceType: [
          'اكتشاف المواهب الكروية',
          'تمثيل لاعبين كرة القدم',
          'تنظيم اختبارات رياضية',
          'إدارة المسيرة الرياضية',
          'تفويض اللاعبين للاندية الدولية'
        ]
      },
      breadcrumb: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://zitouni-pro-talent.tn'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المواهب',
            item: 'https://zitouni-pro-talent.tn/#portfolio'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'الاتصال',
            item: 'https://zitouni-pro-talent.tn/#contact'
          }
        ]
      },
      localBusiness: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Zitouni Pro Talent',
        description: 'وكالة اكتشاف المواهب الكروية في سوسة، تونس',
        url: 'https://zitouni-pro-talent.tn',
        telephone: '+216-XX-XXX-XXX',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'شارع الحبيب بورقيبة',
          addressLocality: 'سوسة',
          addressRegion: 'سوسة',
          postalCode: '4000',
          addressCountry: 'TN'
        },
        openingHours: 'Mo-Fr 09:00-17:00',
        areaServed: 'تونس والعالم',
        serviceType: 'وكالة رياضية - اكتشاف المواهب الكروية'
      }
    },
    fr: {
      organization: {
        '@context': 'https://schema.org',
        '@type': 'SportsOrganization',
        name: 'Zitouni Pro Talent',
        alternateName: 'Agence Zitouni pour les Talents Professionnels',
        description: 'Agence sportive spécialisée dans la découverte et le développement des talents footballistiques tunisiens et leur représentation dans les compétitions internationales',
        url: 'https://zitouni-pro-talent.tn',
        logo: 'https://zitouni-pro-talent.tn/logo.png',
        telephone: '+216-XX-XXX-XXX',
        email: 'info@zitouni-pro-talent.tn',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Avenue Habib Bourguiba',
          addressLocality: 'Sousse',
          addressRegion: 'Sousse',
          postalCode: '4000',
          addressCountry: 'TN'
        },
        areaServed: ['Tunisie', 'Afrique du Nord', 'Monde Arabe'],
        serviceType: [
          'Découverte de talents footballistiques',
          'Représentation de joueurs de football',
          'Organisation de tests sportifs',
          'Gestion de carrière sportive',
          'Placement de joueurs dans des clubs internationaux'
        ]
      },
      breadcrumb: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: 'https://zitouni-pro-talent.tn'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Talents',
            item: 'https://zitouni-pro-talent.tn/#portfolio'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Contact',
            item: 'https://zitouni-pro-talent.tn/#contact'
          }
        ]
      },
      localBusiness: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Zitouni Pro Talent',
        description: 'Agence de découverte de talents footballistiques à Sousse, Tunisie',
        url: 'https://zitouni-pro-talent.tn',
        telephone: '+216-XX-XXX-XXX',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Avenue Habib Bourguiba',
          addressLocality: 'Sousse',
          addressRegion: 'Sousse',
          postalCode: '4000',
          addressCountry: 'TN'
        },
        openingHours: 'Mo-Fr 09:00-17:00',
        areaServed: 'Tunisie et International',
        serviceType: 'Agence sportive - Découverte de talents footballistiques'
      }
    },
    en: {
      organization: {
        '@context': 'https://schema.org',
        '@type': 'SportsOrganization',
        name: 'Zitouni Pro Talent',
        alternateName: 'Zitouni Professional Talent Agency',
        description: 'Sports agency specialized in discovering and developing Tunisian football talents and representing them in international competitions',
        url: 'https://zitouni-pro-talent.tn',
        logo: 'https://zitouni-pro-talent.tn/logo.png',
        telephone: '+216-XX-XXX-XXX',
        email: 'info@zitouni-pro-talent.tn',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Habib Bourguiba Avenue',
          addressLocality: 'Sousse',
          addressRegion: 'Sousse',
          postalCode: '4000',
          addressCountry: 'TN'
        },
        areaServed: ['Tunisia', 'North Africa', 'Arab World'],
        serviceType: [
          'Football talent discovery',
          'Football players representation',
          'Sports trials organization',
          'Sports career management',
          'Players placement in international clubs'
        ]
      },
      breadcrumb: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://zitouni-pro-talent.tn'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Talents',
            item: 'https://zitouni-pro-talent.tn/#portfolio'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Contact',
            item: 'https://zitouni-pro-talent.tn/#contact'
          }
        ]
      },
      localBusiness: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Zitouni Pro Talent',
        description: 'Football talent discovery agency in Sousse, Tunisia',
        url: 'https://zitouni-pro-talent.tn',
        telephone: '+216-XX-XXX-XXX',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Habib Bourguiba Avenue',
          addressLocality: 'Sousse',
          addressRegion: 'Sousse',
          postalCode: '4000',
          addressCountry: 'TN'
        },
        openingHours: 'Mo-Fr 09:00-17:00',
        areaServed: 'Tunisia and International',
        serviceType: 'Sports Agency - Football Talent Discovery'
      }
    }
  };

  return data[lang as keyof typeof data] || data.fr;
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = params;
  const jsonLdData = getJsonLdData(lang);

  const getHtmlLang = (lang: string) => {
    switch (lang) {
      case 'ar': return 'ar';
      case 'fr': return 'fr';
      case 'en': return 'en';
      default: return 'fr';
    }
  };

  const getDir = (lang: string) => {
    return lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <html lang={getHtmlLang(lang)} dir={getDir(lang)}>
      <head>
        <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.2.0/css/line.css" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData.organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData.breadcrumb) }}
        />

        {/* Additional Meta Tags for SEO */}
        <meta name="geo.region" content="TN-SUS" />
        <meta name="geo.placename" content={lang === 'ar' ? 'سوسة, تونس' : lang === 'fr' ? 'Sousse, Tunisie' : 'Sousse, Tunisia'} />
        <meta name="geo.position" content="35.8256;10.6369" />
        <meta name="ICBM" content="35.8256, 10.6369" />
        
        {/* Language and Regional */}
        <meta httpEquiv="content-language" content={getHtmlLang(lang)} />
        <meta name="country" content="Tunisia" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="safe for kids" />
        
        {/* Mobile Optimization */}
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Language Alternates */}
        <link rel="alternate" href="https://zitouni-pro-talent.tn/fr" hrefLang="fr" />
        <link rel="alternate" href="https://zitouni-pro-talent.tn/ar" hrefLang="ar" />
        <link rel="alternate" href="https://zitouni-pro-talent.tn/en" hrefLang="en" />
        <link rel="alternate" href="https://zitouni-pro-talent.tn/" hrefLang="x-default" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="abstract" content={
          lang === 'ar' ? "Zitouni Pro Talent - وكالة اكتشاف المواهب الكروية في تونس - فرص احترافية في أوروبا والعالم العربي" :
          lang === 'fr' ? "Zitouni Pro Talent - Agence de découverte de talents footballistiques en Tunisie - Opportunités professionnelles en Europe et dans le monde arabe" :
          "Zitouni Pro Talent - Football Talent Discovery Agency in Tunisia - Professional opportunities in Europe and Arab world"
        } />
        <meta name="subject" content={
          lang === 'ar' ? "اكتشاف المواهب الكروية وتمثيل اللاعبين التونسيين دولياً" :
          lang === 'fr' ? "Découverte de talents footballistiques et représentation internationale des joueurs tunisiens" :
          "Football talent discovery and international representation of Tunisian players"
        } />
        
        {/* Revisit and Cache */}
        <meta name="revisit-after" content="7 days" />
        <meta name="robots" content="all" />
        <meta name="coverage" content="Worldwide" />
        <meta name="copyright" content="Zitouni Pro Talent" />
        
        {/* Additional Open Graph Tags */}
        <meta property="og:site_name" content="Zitouni Pro Talent" />
        <meta property="og:country-name" content="Tunisia" />
        <meta property="og:region" content="TN-SUS" />
        <meta property="og:postal-code" content="4000" />
        
        {/* Additional Twitter Tags */}
        <meta name="twitter:site" content="@ZitouniProTalent" />
        <meta name="twitter:creator" content="@ZitouniProTalent" />
        <meta name="twitter:domain" content="zitouni-pro-talent.tn" />
        
        {/* Apple Meta Tags */}
        <meta name="apple-mobile-web-app-title" content="Zitouni Pro Talent" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* MS Application Meta Tags */}
        <meta name="application-name" content="Zitouni Pro Talent" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        
        {/* SEO Content Hints */}
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        
        {/* Additional Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData.localBusiness)
          }}
        />
      </body>
    </html>
  );
}