import Link from 'next/link';
import { articles } from '@/lib/blogData';

export const metadata = {
  title: 'Blog | Dr. Mário Warde',
  description: 'Artigos, tendências e informações médicas sobre cirurgia plástica.',
};

export default function BlogPage() {
  return (
    <main className="w-full flex-grow bg-[#fbfbfd]">
      {/* Hero Section */}
      <section className="w-full bg-[#310f0e] text-white pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-burgundy/30 blur-[150px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#ccb9b6] bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/10 mb-6">
            Blog & Artigos
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Conhecimento que<br className="hidden sm:block" /> eleva a sua escolha.
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto font-normal">
            Reflexões da minha prática diária, mitos desvendados e o que há de mais avançado em ciência e cirurgia plástica.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <Link href={`/blog/${article.slug}`} key={idx} className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 group flex flex-col h-full cursor-pointer outline-none focus:ring-2 focus:ring-wine/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-burgundy bg-wine/5 px-3 py-1.5 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-[11px] text-chumbo-light font-medium uppercase tracking-widest">
                    {article.readTime}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-chumbo mb-3 leading-[1.3] tracking-tight group-hover:text-wine transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-chumbo-light leading-relaxed font-normal mb-8 flex-grow">
                  {article.excerpt}
                </p>

                <div className="pt-6 border-t border-black/5 flex items-center justify-between mt-auto">
                  <span className="text-[11px] text-chumbo-light/80 font-medium">
                    {article.date}
                  </span>
                  <span className="text-xs font-semibold text-wine uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ler artigo 
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/" className="inline-block bg-[#f0edea] text-chumbo hover:bg-[#e4ded9] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all">
              Voltar para a Página Inicial
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
