import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "uikit/dist/css/uikit.min.css";
import "./globals.css";

import { Player } from "@/components/player/Player";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BRAME Music",
  description: "BRAME Music Player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={montserrat.className}>
        {children}
        <Player />
      </body>
    </html>
  );
}