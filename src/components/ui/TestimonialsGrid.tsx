'use client';

const defaultTestimonials = [
  { 
    name: "Luciana Alves", 
    date: "há 2 semanas",
    avatar: "https://i.pravatar.cc/150?u=luciana",
    text: "Dr. Mario superou as minhas expectativas. O resultado ficou extremamente natural. O pós-operatório foi super tranquilo e com muito suporte." 
  },
  { 
    name: "Mariana Costa", 
    date: "há 1 mês",
    avatar: "https://i.pravatar.cc/150?u=mariana",
    text: "Excelente cirurgião! Muito atencioso desde a primeira consulta até a alta médica. Me passou muita segurança em cada detalhe do planejamento." 
  },
  { 
    name: "Juliana Mendes", 
    date: "há 3 meses",
    avatar: "https://i.pravatar.cc/150?u=juliana",
    text: "Profissional impecável. Tem um senso estético refinado que me deixou muito tranquila. O hospital e a equipe de enfermagem também são fantásticos." 
  },
  { 
    name: "Fernanda Rossi", 
    date: "há 4 meses",
    avatar: "https://i.pravatar.cc/150?u=fernanda",
    text: "Fiz minha cirurgia há 6 meses e não poderia estar mais feliz. A cicatriz está invisível e o suporte da clínica foi maravilhoso em todas as etapas." 
  },
  { 
    name: "Camila Ribeiro", 
    date: "há 5 meses",
    avatar: "https://i.pravatar.cc/150?u=camila",
    text: "Recomendo de olhos fechados. Dr. Mário é extremamente ético, sincero sobre os resultados e um verdadeiro artista na cirurgia plástica." 
  },
  { 
    name: "Renata Duarte", 
    date: "há 8 meses",
    avatar: "https://i.pravatar.cc/150?u=renata",
    text: "Achei incrível o atendimento. A secretária foi um amor e o Dr. tirou todas as minhas dúvidas com muita paciência. Resultado nota 10!" 
  },
];

export function TestimonialsGrid({ testimonials = defaultTestimonials }: { testimonials?: typeof defaultTestimonials }) {
  return (
    <section className="w-full bg-[#fbfbfd] py-24 md:py-32 px-6 border-t border-black/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[#86868b] font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
            Avaliações Reais
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tighter">
            O que dizem nossas pacientes no Google
          </h2>
        </div>

        {/* CSS Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((item, idx) => (
            <div 
              key={idx}
              className="break-inside-avoid bg-white border border-black/5 rounded-[2rem] p-8 hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                {/* Profile Picture */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Name and Date */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[#1d1d1f] font-semibold text-base truncate">{item.name}</h4>
                  <p className="text-[#86868b] text-xs mt-0.5">{item.date}</p>
                </div>
                
                {/* Google Verified Icon */}
                <div className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center shrink-0" title="Verificado no Google">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-[#FABB05]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-[#1d1d1f]/80 text-[15px] leading-relaxed font-normal">
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
