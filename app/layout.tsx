import type { Metadata } from "next";
import "./globals.css";

// Font loading note:
// This build environment cannot reach fonts.googleapis.com, so next/font/google
// is swapped for system font stacks that closely match Inter / Manrope / JetBrains Mono.
// To use the real webfonts in an environment with internet access, replace this block with:
//
// import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
// const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
// const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
// const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });
// and apply `${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}` on <body> instead of fontVariables.

export const metadata: Metadata = {
  title: "StockLens — Explainable AI Market Intelligence",
  description:
    "AI-powered stock research combining technical analysis, fundamentals, news sentiment and portfolio risk into transparent, explainable market intelligence.",
  openGraph: {
    title: "StockLens — Explainable AI Market Intelligence",
    description:
      "AI-powered stock research combining technical analysis, fundamentals, news sentiment and portfolio risk into transparent, explainable market intelligence.",
    type: "website",
    siteName: "StockLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "StockLens — Explainable AI Market Intelligence",
    description:
      "AI-powered stock research combining technical analysis, fundamentals, news sentiment and portfolio risk into transparent, explainable market intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        style={
          {
            "--font-inter": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
            "--font-manrope": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
            "--font-jetbrains": "ui-monospace, 'SFMono-Regular', Menlo, monospace",
          } as React.CSSProperties
        }
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
