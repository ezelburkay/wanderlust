import "./globals.css";

import { IBM_Plex_Mono, Inter, Playfair_Display } from "next/font/google";

const sansFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans"
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono"
});

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} ${serifFont.variable} ${monoFont.variable}`}>{children}</body>
    </html>
  );
}
