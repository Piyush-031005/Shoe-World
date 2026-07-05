import type { Metadata } from "next";
import { Inter, Silkscreen } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const pixelFont = Silkscreen({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shoe World — Premium Footwear, Pithoragarh",
  description: "Pithoragarh's premier footwear destination. Premium shoes, boots, sandals, loafers and sports footwear for every journey — from the hills to the streets.",
  keywords: "shoe world, pithoragarh footwear, premium shoes, boots, sandals, uttarakhand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${pixelFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
