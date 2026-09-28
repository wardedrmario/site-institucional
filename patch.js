const fs = require('fs');
const path = 'src/app/primeira-consulta/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const newSections = `
      {/* 4. INFORMAÇÕES PRÁTICAS & LOGÍSTICA */}
      <section className="w-full bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tighter mb-4">
              Planejamento e Logística
            </h2>
            <p className="text-[#1d1d1f]/60 text-lg max-w-2xl mx-auto">
              Tudo estruturado para oferecer uma jornada fluida, segura e extremamente confortável, desde o agendamento até a alta médica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Endereço */}
            <div className="bg-[#f5f5f7] p-10 rounded-3xl flex flex-col items-start transition-all hover:bg-[#f0f0f2]">
              <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Localização Privilegiada</h3>
              <p className="text-[#1d1d1f]/70 leading-relaxed mb-4">
                Nosso consultório está localizado em uma das regiões mais nobres de São Paulo.
              </p>
              <address className="text-[#1d1d1f]/90 not-italic font-medium mb-4 text-sm">
                R. Jericó, 255 - Cj 81<br/>
                Sumarezinho, São Paulo - SP<br/>
                CEP: 05435-040
              </address>
              <ul className="text-sm text-[#1d1d1f]/60 space-y-2 mt-auto">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#310f0e]"></div> Estacionamento com Valet
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#310f0e]"></div> Acessibilidade total
                </li>
              </ul>
            </div>

            {/* Formatos de Atendimento */}
            <div className="bg-[#f5f5f7] p-10 rounded-3xl flex flex-col items-start transition-all hover:bg-[#f0f0f2]">
              <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.6 11.6L22 7v10l-6.4-4.5v-1zM4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Formatos de Atendimento</h3>
              <p className="text-[#1d1d1f]/70 leading-relaxed mb-4">
                Atendemos pacientes de todo o Brasil e do exterior com protocolos de triagem rigorosos.
              </p>
              <ul className="text-sm text-[#1d1d1f]/80 space-y-4 mt-auto">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#310f0e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Presencial:</strong> Avaliação clínica completa e planejamento minucioso.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#310f0e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Telemedicina:</strong> Triagem e alinhamento prévio para pacientes de fora de São Paulo.</span>
                </li>
              </ul>
            </div>

            {/* Pagamentos */}
            <div className="bg-[#f5f5f7] p-10 rounded-3xl flex flex-col items-start transition-all hover:bg-[#f0f0f2]">
              <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Honorários & Reembolsos</h3>
              <p className="text-[#1d1d1f]/70 leading-relaxed mb-4">
                Nossos procedimentos são realizados no modelo particular, garantindo a excelência do começo ao fim.
              </p>
              <ul className="text-sm text-[#1d1d1f]/80 space-y-4 mt-auto">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#310f0e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span><strong>Planos de Saúde:</strong> Auxiliamos em todo o processo de documentação para solicitação de <strong>reembolso</strong> perante a sua operadora.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="w-full bg-[#f5f5f7] py-24 px-6 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tighter mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { q: "O consultório atende emergências?", a: "Nossos atendimentos são integralmente dedicados a cirurgias eletivas agendadas. Em caso de urgências, recomendamos buscar um pronto-socorro imediatamente." },
              { q: "Como funciona o reembolso pelo plano de saúde?", a: "Se o seu convênio tiver cobertura de reembolso (Livre Escolha), nós fornecemos todos os laudos, relatórios e notas fiscais exigidas para que você possa dar entrada na operadora de saúde." },
              { q: "Pacientes de fora de São Paulo podem realizar a cirurgia?", a: "Sim. Grande parte das nossas pacientes são de outras cidades ou do exterior. O processo começa com uma consulta por telemedicina para alinhamento inicial e indicação. Posteriormente, desenhamos o cronograma logístico para que você venha a SP apenas no período cirúrgico." },
              { q: "Qual é o hospital onde as cirurgias são realizadas?", a: "Operamos exclusivamente em hospitais de altíssimo padrão em São Paulo, equipados com UTI e que seguem protocolos mundiais de segurança (como o Hospital Sírio-Libanês, Vila Nova Star, entre outros, dependendo do procedimento)." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-black/5">
                <h4 className="text-[17px] font-semibold text-[#1d1d1f] mb-3 flex items-start gap-3">
                  <span className="text-[#86868b] font-medium">Q.</span>
                  {faq.q}
                </h4>
                <p className="text-[#1d1d1f]/70 text-[15px] leading-relaxed pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA (Soft & Elegant) */}
      <section className="w-full bg-white py-24 md:py-32 px-6 text-center">
`;

// Replace the old CTA section with the new sections + CTA + Footer
const ctaRegex = /\{\/\* 4\. FINAL CTA[\s\S]*?<\/section>/;

const replacement = newSections + `
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tighter leading-tight">
            Pronta para dar <br/> o primeiro passo?
          </h2>
          <p className="text-[#1d1d1f]/60 text-[18px] mb-12 leading-relaxed">
            Nossa equipe de atendimento está preparada para entender suas expectativas e desenhar a jornada da sua primeira consulta.
          </p>
          
          <button 
            onClick={() => {
              setShowLeadForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#1d1d1f] px-10 py-5 text-[16px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] active:scale-[0.98]"
          >
            Falar com Atendimento
          </button>
        </div>
      </section>

      {/* 7. RODAPÉ INSTITUCIONAL */}
      <footer className="w-full bg-[#1d1d1f] py-12 px-6 text-center text-white/50 text-xs">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <p className="text-white/80 font-medium text-[13px] uppercase tracking-wider">
            Dr. Mário Jorge Warde Filho
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/60">
            <span>Cirurgião Plástico</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>CRM/SP: 81.741</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>RQE: 18.599</span>
          </div>
          <p className="max-w-xl leading-relaxed mt-4">
            A cirurgia plástica é uma ciência médica e seus resultados variam de acordo com o organismo de cada paciente. As informações desta página têm caráter exclusivamente educativo. Consulta presencial ou telemedicina (em conformidade com o CFM) é indispensável.
          </p>
          <div className="w-full h-px bg-white/10 my-4"></div>
          <p>&copy; {new Date().getFullYear()} Clínica Dr. Mário Warde. Todos os direitos reservados.</p>
        </div>
      </footer>
`;

content = content.replace(ctaRegex, replacement);
fs.writeFileSync(path, content, 'utf8');
