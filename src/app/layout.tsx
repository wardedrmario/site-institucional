import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleTagManager } from '@next/third-parties/google';

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
      <GoogleTagManager gtmId="GTM-5T7DBGTG" />
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased text-[#1d1d1f] bg-[#fbfbfd] min-h-screen flex flex-col selection:bg-burgundy/15 selection:text-wine">
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4376073622648258');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=4376073622648258&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
