import { articles } from '@/lib/blogData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArticleComments } from '@/components/ui/ArticleComments';

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = articles.find((a) => a.slug === resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="w-full flex-grow bg-[#fbfbfd]">
      {/* Article Header */}
      <section className="w-full bg-[#310f0e] text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-burgundy/30 blur-[150px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ccb9b6] bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/10">
              {article.category}
            </span>
            <span className="text-[11px] text-white/50 font-medium uppercase tracking-widest">
              {article.readTime} de leitura
            </span>
          </div>
          <h1 className="font-title text-3xl md:text-5xl lg:text-6xl font-normal tracking-tight mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span>Publicado em {article.date}</span>
            <span>•</span>
            <span>Dr. Mário Warde</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="w-full py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="max-w-none text-chumbo mx-auto font-normal text-lg">
            {article.content.split(/\n\s*\n/).map((block, idx) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              // Check if block is a section subtitle (numbered or all caps)
              const isNumberedHeading = /^\d+\.\s+[A-ZÀ-Ú\s:]+/.test(trimmed);
              const isAllCapsHeading = /^[A-ZÀ-Ú\s\(\)\?:-]{4,90}$/.test(trimmed) && trimmed === trimmed.toUpperCase() && !trimmed.includes('. ');

              if (isNumberedHeading || isAllCapsHeading) {
                return (
                  <h2 key={idx} className="font-sans text-xl md:text-2xl font-semibold text-chumbo mt-12 mb-4 tracking-tight uppercase">
                    {trimmed}
                  </h2>
                );
              }

              // Check if block has bullet points
              if (trimmed.includes('• ')) {
                const lines = trimmed.split('\n');
                return (
                  <div key={idx} className="my-6 space-y-3">
                    {lines.map((line, lIdx) => {
                      const cleanLine = line.trim();
                      if (cleanLine.startsWith('• ')) {
                        return (
                          <div key={lIdx} className="flex items-start gap-3 text-chumbo-light text-base md:text-lg leading-relaxed font-normal">
                            <span className="text-wine font-bold mt-0.5">•</span>
                            <span>{cleanLine.replace(/^•\s*/, '')}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={lIdx} className="text-chumbo-light text-base md:text-lg leading-relaxed font-normal">
                          {cleanLine}
                        </p>
                      );
                    })}
                  </div>
                );
              }

              return (
                <p key={idx} className="text-chumbo-light text-base md:text-lg leading-relaxed font-normal mb-6">
                  {trimmed}
                </p>
              );
            })}
          </div>
          {!('hideComments' in article && article.hideComments) && (
            <ArticleComments />
          )}
          <div className="mt-16 text-center">
            <Link href="/blog" className="inline-flex items-center justify-center gap-2 bg-[#f0edea] text-chumbo hover:bg-[#e4ded9] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full transition-all">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              Voltar para o Blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
