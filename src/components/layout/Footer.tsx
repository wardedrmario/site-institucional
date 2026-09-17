import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1d1d1f] text-white/80 pt-20 pb-16 border-t border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Apple-style Multi-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10 text-xs">
          
          {/* Col 1: Brand & Logo Oficial */}
          <div className="md:col-span-1 flex flex-col space-y-4">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/brand/logo-horizontal-white.svg" 
                alt="Dr. Mário Warde - Cirurgia Plástica" 
                className="h-8 w-auto object-contain opacity-90"
              />
            </Link>
            <p className="text-white/60 leading-relaxed font-normal text-[12px]">
              Cirurgia plástica orientada pela segurança cirúrgica absoluta, refinamento anatômico e acolhimento humano.
            </p>
          </div>

          {/* Col 2: Procedimentos */}
          <div className="flex flex-col space-y-2.5">
            <span className="font-semibold text-white tracking-tight text-xs uppercase text-white/90">Procedimentos</span>
            <Link href="#procedimentos" className="text-white/60 hover:text-white transition-colors">Lipoaspiração HD & Renuvion</Link>
            <Link href="#procedimentos" className="text-white/60 hover:text-white transition-colors">Mastopexia & Dual Plane</Link>
            <Link href="#procedimentos" className="text-white/60 hover:text-white transition-colors">Deep Plane Facelift</Link>
            <Link href="#procedimentos" className="text-white/60 hover:text-white transition-colors">Rinoplastia Estruturada</Link>
          </div>

          {/* Col 3: Atendimento & Concierge */}
          <div className="flex flex-col space-y-2.5">
            <span className="font-semibold text-white tracking-tight text-xs uppercase text-white/90">Experiência VIP</span>
            <Link href="#blog" className="text-white/60 hover:text-white transition-colors">Blog & Artigos</Link>
            <Link href="#triagem" className="text-white/60 hover:text-white transition-colors">Triagem Virtual / Teleconsulta</Link>
            <Link href="#metodo" className="text-white/60 hover:text-white transition-colors">Hospitais Credenciados</Link>
            <Link href="#faq" className="text-white/60 hover:text-white transition-colors">Perguntas Frequentes</Link>
          </div>

          {/* Col 4: Conformidade CFM */}
          <div className="flex flex-col space-y-2.5">
            <span className="font-semibold text-white tracking-tight text-xs uppercase text-white/90">Registro Médico</span>
            <p className="text-white/60 leading-relaxed">
              Dr. Mário Warde<br />
              Cirurgião Plástico Especialista<br />
              CRM/SP • RQE Registrado<br />
              Membro Titular da SBCP
            </p>
          </div>

          {/* Col 5: Contato & Endereço */}
          <div className="flex flex-col space-y-2.5 lg:col-span-1">
            <span className="font-semibold text-white tracking-tight text-xs uppercase text-white/90">Contato & Local</span>
            <p className="text-white/60 leading-relaxed">
              <strong className="text-white/80 font-medium">WhatsApp:</strong><br/>
              <a href="https://wa.me/5511966496116" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+55 11 96649-6116</a>
            </p>
            <p className="text-white/60 leading-relaxed">
              <strong className="text-white/80 font-medium">Instagram:</strong><br/>
              <a href="https://www.instagram.com/dr.mariowarde/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                @dr.mariowarde
              </a>
            </p>
            <p className="text-white/60 leading-relaxed">
              <strong className="text-white/80 font-medium">Endereço:</strong><br/>
              R. Jericó, 255 - Cj 81<br/>
              Sumarezinho, São Paulo - SP<br/>
              05435-040
            </p>
            <p className="text-white/60 leading-relaxed">
              <strong className="text-white/80 font-medium">Atendimento:</strong><br/>
              Seg a Sex: 09:30 às 18:30<br/>
              (Pausa das 12:00 às 13:00)
            </p>
          </div>

        </div>

        {/* Disclaimer CFM & Apple-style legal notes */}
        <div className="pt-8 space-y-3 text-[11px] text-white/40 leading-relaxed">
          <p>
            * As informações disponibilizadas neste site possuem caráter estritamente educativo e informativo, não substituindo a consulta médica individualizada, diagnóstico e plano terapêutico presencial, em conformidade com as Resoluções do Conselho Federal de Medicina (CFM).
          </p>
          <p>
            Resultados cirúrgicos variam de acordo com as características biológicas, anatômicas e pós-operatórias individuais de cada paciente. Procedimentos realizados exclusivamente em ambiente hospitalar com acreditação de excelência e suporte de UTI.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-white/5 gap-4">
            <p>&copy; {new Date().getFullYear()} Clínica Dr. Mário Warde. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-end">
              <a href="#" className="hover:text-white transition-colors">Privacidade de Dados</a>
              <a href="#" className="hover:text-white transition-colors">Termos Médicos</a>
              <div className="hidden sm:block w-px h-3 bg-white/10 mx-2"></div>
              <div className="flex items-center gap-2 text-white/40">
                <span>Desenvolvido por</span>
                <a href="https://unioo.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-all group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/logo-unioo.svg" alt="unioo" className="h-4 w-auto opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] tracking-widest uppercase font-medium">Comunicação e Marketing</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
