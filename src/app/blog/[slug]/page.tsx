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
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
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
          <div className="prose prose-lg prose-p:text-chumbo-light prose-p:leading-relaxed prose-headings:text-chumbo prose-a:text-wine hover:prose-a:text-burgundy mx-auto whitespace-pre-wrap font-normal text-lg">
            {article.content}
          </div>
          
          <ArticleComments />
          
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
