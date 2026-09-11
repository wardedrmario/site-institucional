import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full bg-wine/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Official Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/brand/logo-horizontal-white.svg" 
                alt="Dr. Mário Warde - Cirurgia Plástica" 
                className="h-8 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-85"
              />
            </Link>
          </div>

          {/* Desktop Apple-style Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-[13px] font-medium text-white/80">
            <Link href="#procedimentos" className="hover:text-white transition-colors tracking-tight">
              Procedimentos
            </Link>
            <Link href="#metodo" className="hover:text-white transition-colors tracking-tight">
              A Maestria
            </Link>
            <Link href="#blog" className="hover:text-white transition-colors tracking-tight">
              Blog
            </Link>
            <Link href="#faq" className="hover:text-white transition-colors tracking-tight">
              Dúvidas
            </Link>
          </nav>


          
        </div>
      </div>
    </header>
  );
}
