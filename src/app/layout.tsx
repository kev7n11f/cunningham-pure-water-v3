import type { Metadata } from "next";
import "./globals.css";
import AquaBuddy from "@/components/AquaBuddy";

export const metadata: Metadata = {
  title: "Cunningham Pure Water LLC | Louisiana's Authorized Wellsys Dealer",
  description: "Premium commercial office water coolers and ice machines with 5 & 6 stage reverse osmosis filtration. Louisiana's exclusive authorized Wellsys dealer. Rent reverse osmosis water coolers and ice machines for your business.",
  keywords: "water cooler rental, ice machine rental, Wellsys dealer Louisiana, commercial water cooler, reverse osmosis, office water cooler, pure water, water filtration",
  authors: [{ name: "Cunningham Pure Water LLC" }],
  openGraph: {
    title: "Cunningham Pure Water LLC | Premium Water Solutions",
    description: "Louisiana's authorized Wellsys dealer. Commercial water coolers and ice machines with advanced reverse osmosis filtration for businesses.",
    url: "https://www.officepurewater.com",
    siteName: "Cunningham Pure Water LLC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cunningham Pure Water LLC",
    description: "Premium commercial reverse osmosis water coolers and ice machines for Louisiana businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
        <AquaBuddy />
      </body>
    </html>
  );
}
