import type { Metadata } from "next";
import "./globals.css";

// 🌍 Base metadata (applied globally)
const baseMetadata = {
  authors: [{ name: "Zitouni Pro Talent" }],
  creator: "Zitouni Pro Talent",
  publisher: "Zitouni Pro Talent",
  metadataBase: new URL("https://zitouni-pro-talent.tn"),
  alternates: {
    canonical: "/",
    languages: {
      ar: "/ar",
      fr: "/fr",
      en: "/en",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  // ✅ Your actual Google verification code
  verification: {
    google: "7vCo1fOCuuCDVZ6gu65GOnWSfCLuVqabWQEoYglxuI0",
  },
  category: "sports" as const,
};

// French metadata 🇫🇷
const frenchMetadata: Metadata = {
  ...baseMetadata,
  title:
    "Zitouni Pro Talent - Agence de Découverte de Talents Footballistiques en Tunisie",
  description:
    "Zitouni Pro Talent - L'agence leader en Tunisie pour la découverte et le développement des talents footballistiques. Nous aidons les joueurs tunisiens à obtenir des opportunités professionnelles en Turquie, Espagne, Émirats Arabes Unis, Albanie et autres pays.",
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: "https://zitouni-pro-talent.tn",
    siteName: "Zitouni Pro Talent",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zitouni Pro Talent - Découverte de Talents Footballistiques",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Zitouni Pro Talent - Agence de Découverte de Talents Footballistiques en Tunisie",
    images: ["/twitter-image.jpg"],
    creator: "@ZitouniProTalent",
  },
};

// English metadata 🇬🇧
const englishMetadata: Metadata = {
  ...baseMetadata,
  title: "Zitouni Pro Talent - Football Talent Discovery Agency in Tunisia",
  description:
    "Zitouni Pro Talent - The leading agency in Tunisia for discovering and developing football talents. We help Tunisian players get professional opportunities abroad.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zitouni-pro-talent.tn",
    siteName: "Zitouni Pro Talent",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zitouni Pro Talent - Football Talent Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zitouni Pro Talent - Football Talent Discovery Agency in Tunisia",
    images: ["/twitter-image.jpg"],
    creator: "@ZitouniProTalent",
  },
};

// Arabic metadata 🇸🇦
const arabicMetadata: Metadata = {
  ...baseMetadata,
  title: "Zitouni Pro Talent - وكالة اكتشاف المواهب الكروية في تونس",
  description:
    "Zitouni Pro Talent - الوكالة الرائدة في تونس لاكتشاف وتطوير المواهب الكروية. نساعد اللاعبين التونسيين في الحصول على فرص احترافية في الخارج.",
  openGraph: {
    type: "website",
    locale: "ar_TN",
    url: "https://zitouni-pro-talent.tn",
    siteName: "Zitouni Pro Talent",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zitouni Pro Talent - اكتشاف المواهب الكروية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zitouni Pro Talent - وكالة اكتشاف المواهب الكروية في تونس",
    images: ["/twitter-image.jpg"],
    creator: "@ZitouniProTalent",
  },
};

// 🌐 Language-based metadata selector
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const { lang } = params;
  switch (lang) {
    case "ar":
      return arabicMetadata;
    case "en":
      return englishMetadata;
    case "fr":
    default:
      return frenchMetadata;
  }
}

// 🧱 Root Layout
interface RootLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const lang = params.lang || "fr";

  const getHtmlLang = (lang: string) =>
    lang === "ar" ? "ar" : lang === "en" ? "en" : "fr";
  const getDir = (lang: string) => (lang === "ar" ? "rtl" : "ltr");

  return (
    <html lang={getHtmlLang(lang)} dir={getDir(lang)}>
      <head>
        {/* ✅ Google Verification is automatically handled by Metadata.verification */}
        <meta name="geo.region" content="TN-SUS" />
        <meta name="geo.position" content="35.8256;10.6369" />
        <meta name="ICBM" content="35.8256, 10.6369" />
        <meta name="country" content="Tunisia" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
