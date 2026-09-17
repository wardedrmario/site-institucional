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
