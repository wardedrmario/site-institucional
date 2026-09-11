import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Dr. Mário Warde | Cirurgia Plástica de Alta Precisão",
  description: "A fusão entre o rigor cirúrgico, proporções naturais e acolhimento exclusivo.",
  icons: {
    icon: "/brand/monogram-wine.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased text-[#1d1d1f] bg-[#fbfbfd] min-h-screen flex flex-col selection:bg-burgundy/15 selection:text-wine">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
