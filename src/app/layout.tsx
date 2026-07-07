import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { reader } from "@/lib/content";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await reader.singletons.settings.read();
  const name = settings?.name ?? "Bicol IT";
  const description = settings?.description ?? "";
  const url = settings?.url ?? "https://bicolit.org";

  // Single shared social card (public/og.png, 1200×630). Declared with explicit
  // dimensions/type/alt so scrapers (Facebook, LinkedIn, X, Slack, Discord)
  // render it immediately instead of re-fetching to measure it.
  const ogImage = {
    url: "/og.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: `${name} — Innovating Tomorrow, Today.`,
  };

  return {
    title: name,
    description,
    keywords: settings?.keywords ? [...settings.keywords] : [],
    metadataBase: new URL(url),
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url,
      title: name,
      description,
      siteName: name,
      locale: "en_PH",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${spaceMono.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
