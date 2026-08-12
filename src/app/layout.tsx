import type { Metadata } from "next";
import { Fredoka, Nunito_Sans } from "next/font/google";
import { pawlingsContent } from "@/config/pawlings-content";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["500", "600", "700"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${pawlingsContent.brand.name} | Pawling Adoption`,
    template: `%s | ${pawlingsContent.brand.name}`,
  },
  description: pawlingsContent.hero.subheadline,
  icons: {
    icon: pawlingsContent.brand.logoPath,
    apple: pawlingsContent.brand.logoPath,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunitoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
