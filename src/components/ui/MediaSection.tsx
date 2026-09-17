export function MediaSection() {
  return (
    <section className="w-full bg-[#fbfbfd] border-t border-black/[0.04] py-24 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Título e Intro */}
        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-wine mb-4">
          DR. MÁRIO WARDE NA MÍDIA
        </h2>
        <p className="text-sm md:text-base text-chumbo-light font-medium mb-12">
          Destaque nas principais tvs, jornais e revistas do Brasil. Confira abaixo as reportagens em que sou notícia:
        </p>

        {/* Logos */}
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14 mb-20">
          <a href="https://www.terra.com.br/noticias/lipoescultura-associa-gordura-a-definicao-corporal,ab06c0710115bac899b10898187277c975yggwel.html" target="_blank" rel="noopener noreferrer" className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/media/terra.svg" alt="Terra" className="h-10 md:h-[50px] w-auto object-contain" />
          </a>
          
          <a href="https://oglobo.globo.com/patrocinado/dino/noticia/2026/05/12/lipoescultura-associa-gordura-a-definicao-corporal-1.ghtml" target="_blank" rel="noopener noreferrer" className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/media/o-globo.svg" alt="O Globo" className="h-10 md:h-[50px] w-auto object-contain" />
          </a>

          <a href="http://dino.ig.com.br/2026-05-12/lipoescultura-associa-gordura-a-definicao-corporal.html" target="_blank" rel="noopener noreferrer" className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/media/ig.png" alt="iG" className="h-9 md:h-11 w-auto object-contain" />
          </a>

          <a href="https://folhapress.folha.com.br/texto/2544025?releaseId=331193" target="_blank" rel="noopener noreferrer" className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/media/folha de sao paulo.png" alt="Folha de S.Paulo" className="h-7 md:h-9 w-auto object-contain" />
          </a>

          <a href="https://valor.globo.com/patrocinado/dino/noticia/2026/05/12/lipoescultura-associa-gordura-a-definicao-corporal-1.ghtml" target="_blank" rel="noopener noreferrer" className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/media/valor economico.png" alt="Valor Econômico" className="h-7 md:h-9 w-auto object-contain" />
          </a>

          <a href="https://www.em.com.br/mundo-corporativo/2026/05/7417757-lipoescultura-associa-gordura-a-definicao-corporal.html" target="_blank" rel="noopener noreferrer" className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/media/estado de minas.png" alt="Estado de Minas" className="h-10 md:h-[44px] w-auto object-contain" />
          </a>
        </div>



      </div>
    </section>
  );
}
