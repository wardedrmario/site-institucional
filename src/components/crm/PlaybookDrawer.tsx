'use client';

import React, { useState, useEffect } from 'react';

interface PlaybookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScriptItem {
  id: string;
  category: 'regras' | 'voz' | 'primeiro_contato' | 'preco' | 'reserva' | 'endereco' | 'resgate' | 'telemedicina' | 'hospitais';
  title: string;
  badge?: string;
  situation: string;
  script?: string;
  bulletPoints?: string[];
  note?: string;
}

const PLAYBOOK_ITEMS: ScriptItem[] = [
  // 5 Regras de Ouro
  {
    id: 'regra-1',
    category: 'regras',
    title: 'Regra 1: Proibido Citar "A partir de R$ 32.000 / R$ 35.000" no WhatsApp',
    badge: 'Inegociável',
    situation: 'Quando o paciente pergunta o preço da cirurgia ou pede uma média no chat.',
    bulletPoints: [
      'Cirurgia plástica de alto padrão não se orça por chat.',
      'Citar valores brutos sem exame anatômico assusta o paciente de alta renda e viola normas do CFM.',
      'Apresente o valor transparente da Primeira Consulta Médica (R$ 350 Internet / R$ 850 VIP) com 100% do valor abatido no procedimento cirúrgico.'
    ],
    note: 'Nas conversas auditadas, citar R$ 32k/35k fez 4 pacientes qualificados sumirem em minutos.'
  },
  {
    id: 'regra-2',
    category: 'regras',
    title: 'Regra 2: Fim do Interrogatório — Vá Direto ao Convite da Consulta',
    badge: 'Inegociável',
    situation: 'Logo após o paciente responder à primeira mensagem informando a queixa principal.',
    bulletPoints: [
      'Não envie paredes de texto explicativo sobre procedimentos cirúrgicos.',
      'Não pergunte "Há quanto tempo a senhora busca essa cirurgia?".',
      'Valide a queixa em uma frase acolhedora e já pergunte se o paciente prefere consulta presencial na Vila Madalena ou por Telemedicina.'
    ]
  },
  {
    id: 'regra-3',
    category: 'regras',
    title: 'Regra 3: Áudio Humano de 25 Segundos após a Primeira Resposta',
    badge: 'Voz Humanizada',
    situation: 'Pacientes de 50 a 75 anos desconfiam de mensagens frias copiadas de robô.',
    bulletPoints: [
      'Assim que o paciente responder ao primeiro contato, envie um áudio curto (20 a 25 segundos).',
      'Fale com tom sereno, voz sorridente, chamando pelo primeiro nome e oferecendo duas opções de horário.'
    ]
  },
  {
    id: 'regra-4',
    category: 'regras',
    title: 'Regra 4: Ligação Telefônica Obrigatória Antes de Cancelar Vaga ou Encerrar Ficha',
    badge: 'Postura White Glove',
    situation: 'Antes de cancelar horários de pacientes em silêncio ou enviar mensagem de encerramento temporário.',
    bulletPoints: [
      'Proibido cancelar consulta unilateralmente às 13h30 por falta de resposta rápida no WhatsApp.',
      'Aguarde até as 17h00 da véspera e realize uma ligação cordial de 30 segundos (Cenário 3.1).',
      'Nenhuma ficha pode ser arquivada sem antes registrar ao menos uma tentativa real de ligação telefônica.'
    ]
  },
  {
    id: 'regra-5',
    category: 'regras',
    title: 'Regra 5: Uso dos Botões Automáticos no CRM — Zero Colchetes',
    badge: 'Eficiência CRM',
    situation: 'Ao responder pacientes direto pelo CRM (/admin).',
    bulletPoints: [
      'Cada cartão de paciente no CRM possui botões de scripts que já interpolam automaticamente o Primeiro Nome e o Procedimento do lead.',
      'Evita o envio acidental de tags como [Nome] ou [Procedimento] e impede a troca de nomes de pacientes.'
    ]
  },

  // Cenário 3.1: Ligações Telefônicas Cordiais
  {
    id: 'voz-1',
    category: 'voz',
    title: 'Roteiro Telefônico 1: Salvar Consulta Pré-agendada (Véspera às 17h00)',
    badge: 'Salvar Vaga na Véspera',
    situation: 'Paciente pré-confirmou interesse em um horário, mas não respondeu à mensagem no WhatsApp durante o dia (em reuniões ou compromissos executivos). Proibido cancelar sem antes ligar.',
    script: 'Olá, [Nome], tudo bem? Aqui é a Ana Paula, da clínica do Dr. Mário Warde.\n\nTe liguei rapidinho apenas para ter certeza de que você recebeu minha mensagem no WhatsApp. Como o Dr. Mário organiza a agenda com intervalos amplos e exclusivos para cada paciente, sem nenhuma sobreposição, fiz questão de preservar o seu horário de [Amanhã às 14h / Data Combinada] antes de qualquer ajuste de agenda. Fica mantido para você?',
    note: 'Se confirmar: "Perfeito, [Nome]! Horário travado. Vou só te reenviar o endereço com o link do Google Maps e as orientações do manobrista/Valet no WhatsApp. Até amanhã!"\nSe não puder ir: "Compreendo perfeitamente, [Nome]. Sabemos como a rotina é dinâmica e o mais importante é você vir com calma. Quer que eu veja uma opção para a próxima terça ou quinta-feira?"'
  },
  {
    id: 'voz-2',
    category: 'voz',
    title: 'Roteiro Telefônico 2: Resgate de Paciente Adormecido (4º ou 5º dia útil)',
    badge: 'Resgate Antes de Encerrar',
    situation: 'Paciente de 50 a 75 anos que cadastrou ou iniciou conversa, mas esfriou nas mensagens escritas. Ligue cordialmente antes do envio de break-up.',
    script: 'Olá, Dona [Nome] / Sr. [Nome], boa tarde! Tudo bem? Aqui é a Ana Paula, Concierge do Dr. Mário Warde.\n\nLiguei rapidamente apenas para saber se a senhora conseguiu dar uma olhadinha nas opções de horário que conversamos no WhatsApp sobre o seu planejamento de [rejuvenescimento facial / contorno corporal]. A sua semana esteve muito corrida?',
    note: 'Direcionamento: "Imagino perfeitamente! Por mensagem de texto às vezes fica difícil parar para olhar calendário. Como o Dr. Mário abre poucos horários por semana para dedicar tempo integral a cada paciente, prefere que eu veja uma data presencial aqui na Vila Madalena ou uma conversa inicial por vídeo (Telemedicina) para ficar mais confortável para a senhora?"'
  },
  {
    id: 'voz-3',
    category: 'voz',
    title: 'Roteiro Telefônico 3: Conduta para Caixa Postal & Ligação Não Atendida',
    badge: 'A Trinca de Ouro',
    situation: 'Se o paciente não atender, NUNCA ligue uma segunda vez no mesmo dia. Aplique a conduta dupla abaixo:',
    script: 'Recado na Caixa Postal (15 segundos):\n"Olá, [Nome], aqui é a Ana Paula da clínica do Dr. Mário Warde. Liguei apenas para checar um detalhe com você sobre a sua agenda com o doutor. Te deixei uma mensagem no WhatsApp para você ver com tranquilidade no seu tempo. Uma excelente tarde!"\n\nÁudio Humano no WhatsApp (Imediatamente após a chamada):\n"Olá, [Nome]! Tentei te dar um alô rápido agora por telefone, mas imagino que esteja em reunião ou com a rotina intensa. Só passei para te desejar uma ótima tarde e saber se você conseguiu ver meu recadinho anterior sobre sua consulta com o Dr. Mário. Quando tiver um minutinho, me dê um alô por aqui!"'
  },
  {
    id: 'voz-mandamentos',
    category: 'voz',
    title: 'Os 4 Mandamentos da Voz ao Telefone',
    badge: 'Conduta Ética',
    situation: 'Diretrizes comportamentais obrigatórias para toda chamada telefônica da Concierge.',
    bulletPoints: [
      '1. Proibido tom de cobrança: Nunca use termos como "estou ligando para cobrar" ou "sua vaga vai ser cancelada". Use sempre "preservar o seu horário exclusivo com o Dr. Mário".',
      '2. Sorriso na voz: A expressão facial modula o timbre da voz. Sorria antes de discar.',
      '3. Respeito pelo tempo: Abra a chamada justificando que é um contato rápido de 30 segundos ("Te liguei rapidinho apenas para...").',
      '4. Registro imediato no CRM: Ao desligar, gaste 5 segundos para salvar a nota no cartão do paciente no CRM (/admin).'
    ]
  },

  // Abordagem e Convite
  {
    id: 'script-1',
    category: 'primeiro_contato',
    title: 'Cenário 1: 1º Contato Acolhedor & Curto (Passo 1)',
    badge: 'Início de Conversa',
    situation: 'Assim que o lead entra no WhatsApp via formulário de Landing Page.',
    script: 'Olá, [Nome]! Tudo bem? Aqui é a Ana Paula, Concierge exclusiva do Dr. Mário Warde. Recebemos o seu cadastro sobre [rejuvenescimento facial / contorno corporal]. Para eu preparar o seu atendimento com todo cuidado, me conta um pouquinho: o que mais tem te incomodado hoje e qual é o seu principal objetivo com a cirurgia?'
  },
  {
    id: 'script-convite',
    category: 'primeiro_contato',
    title: 'Cenário 1.1: Convite Direto para Primeira Consulta (Passo 2)',
    badge: 'Convite em 2 Passos',
    situation: 'Logo após o paciente responder a queixa principal (sem interrogatório).',
    script: 'Perfeito, [Nome], compreendo perfeitamente. Essa queixa é justamente uma das maiores especialidades do Dr. Mário, buscando sempre um reposicionamento estruturado, natural e sem estigmas.\n\nPara o Dr. Mário avaliar a sua anatomia pessoalmente e desenhar o seu planejamento cirúrgico, você prefere agendar a sua Primeira Consulta presencialmente aqui na clínica (Vila Madalena) ou por vídeo (Telemedicina)?'
  },

  // Contorno de Preço
  {
    id: 'script-preco',
    category: 'preco',
    title: 'Cenário 2 e 4: Contorno de Preço Cirúrgico ("Qual a média de valor?")',
    badge: 'Preço & CFM',
    situation: 'Paciente pergunta o valor da cirurgia ou pede uma média/noção por mensagem.',
    script: 'Compreendo perfeitamente a sua necessidade de planejamento, [Nome].\n\nComo o Dr. Mário realiza cirurgias personalizadas e opera exclusivamente em estrutura hospitalar de primeira linha (como Sírio-Libanês, Vila Nova Star e Albert Einstein), o orçamento cirúrgico não é padronizado e só pode ser definido após ele avaliar a sua anatomia em consulta, inclusive por norma do Conselho Federal de Medicina.\n\nO primeiro passo é a Primeira Consulta Médica detalhada (o valor é de R$ 350,00, sendo 100% revertido em crédito no seu plano cirúrgico). Você prefere que eu veja um horário presencial aqui na Vila Madalena ou por vídeo (Telemedicina) esta semana?',
    note: 'Para pacientes de Indicação Médica / VIP, informe o valor de R$ 850,00. Para pacientes em Cortesia, destaque que a Primeira Consulta já é uma cortesia exclusiva isenta de honorários.'
  },

  // Reserva de Agenda Pix
  {
    id: 'script-reserva',
    category: 'reserva',
    title: 'Cenário 6: Confirmação de Exclusividade & Reserva 50% Pix',
    badge: 'Reserva de Agenda',
    situation: 'Quando o paciente escolhe uma data e horário para a consulta.',
    script: 'Olá, [Nome]! O Dr. Mário organiza a agenda com intervalos amplos entre os atendimentos, sem sobreposição de pacientes, para garantir total privacidade e uma consulta médica detalhada e sem pressa.\n\nPor essa razão, a confirmação do horário é formalizada mediante a reserva de 50% do valor da consulta via Pix (R$ 175,00), e o saldo restante é acertado no dia do atendimento.\n\nUm diferencial da clínica: caso você decida realizar o procedimento cirúrgico com o Dr. Mário, o valor integral da consulta (R$ 350,00) é revertido em crédito no seu plano cirúrgico.\n\nPosso enviar a chave Pix da clínica para travarmos a sua data com o doutor?',
    note: 'Valores oficiais: Consulta Geral R$ 350 (Sinal R$ 175). Consulta VIP R$ 850 (Sinal R$ 425). Em consultas Cortesia (R$ 0), envie o script de cortesia sem cobrança de sinal.'
  },
  {
    id: 'script-reserva-cortesia',
    category: 'reserva',
    title: 'Confirmação de Agendamento em Consulta Cortesia (R$ 0)',
    badge: 'Cortesia Isenta',
    situation: 'Para pacientes com voucher de reinauguração, convidados do Dr. Mário ou revisões cirúrgicas.',
    script: 'Olá, [Nome]! O Dr. Mário organiza a agenda com intervalos amplos entre os atendimentos, sem sobreposição de pacientes, para garantir total privacidade e uma consulta médica detalhada e sem pressa.\n\nComo o seu atendimento é uma Cortesia Exclusiva, o seu horário está pré-reservado diretamente na grade do Dr. Mário, sem necessidade de sinal financeiro via Pix.\n\nPosso confirmar a sua data e horário aqui na clínica (Vila Madalena)?'
  },

  // Endereço Oficial
  {
    id: 'script-endereco',
    category: 'endereco',
    title: 'Cenário 7 & Atalho /endereco: Endereço Oficial com Valet e Maps',
    badge: 'Localização Completa',
    situation: 'Sempre que solicitado o endereço ou na confirmação de consultas presenciais.',
    script: 'A clínica do Dr. Mário Warde está localizada em uma região nobre e de fácil acesso na Vila Madalena:\n\nEndereço: Rua Jericó, 255 - Conjunto 81 — Vila Madalena (Sumarezinho), São Paulo - SP | CEP: 05435-040 (o edifício conta com estacionamento e serviço de Valet no local, próximo à estação Vila Madalena do Metrô).\n\nLocalização no Google Maps: https://maps.google.com/?q=Rua+Jerico,255,Vila+Madalena,Sao+Paulo,SP,05435-040'
  },

  // Telemedicina VIP
  {
    id: 'script-telemedicina',
    category: 'telemedicina',
    title: 'Cenário 5: Contorno de Falta de Tempo (Telemedicina VIP)',
    badge: 'Comodidade Online',
    situation: 'Paciente alega rotina corrida, viagens constantes ou reside fora da Grande SP.',
    script: 'Compreendo perfeitamente, [Nome]. Sabemos como a rotina pode ser intensa.\n\nPensando exatamente na comodidade de pacientes com agendas dinâmicas ou que residem fora de São Paulo, o Dr. Mário realiza a Primeira Consulta por Telemedicina (Online).\n\nEla possui o mesmo rigor técnico e tempo dedicado da presencial: vocês conversam em uma chamada de vídeo privativa, o Dr. Mário analisa seu histórico, suas fotos prévias e suas queixas com calma, desenhando o seu planejamento cirúrgico preliminar.\n\nFica mais confortável para você iniciarmos com essa conversa de forma remota?'
  },

  // Régua de Resgate e Break-up
  {
    id: 'script-resgate-2',
    category: 'resgate',
    title: 'Tentativa 2 (48 horas depois — Foco em Autoridade com Artigo)',
    badge: 'Artigo do Blog',
    situation: '48 horas após o primeiro contato sem resposta.',
    script: 'Olá, [Nome], boa tarde! Passando rapidamente para compartilhar um artigo que o Dr. Mário preparou explicando como funciona a Primeira Consulta e o planejamento cirúrgico individualizado em nossa clínica:\nhttps://drmariowarde.com/blog/como-e-o-caminho-ate-a-primeira-consulta-com-o-dr-mario-warde\n\nFique à vontade para me chamar por aqui para escolhermos o melhor dia para você. Um abraço!'
  },
  {
    id: 'script-breakup',
    category: 'resgate',
    title: 'Tentativa 3 (7 dias depois — Despedida Elegante / Break-up)',
    badge: 'Somente Após Tentar Ligar',
    situation: 'Somente após tentar a ligação telefônica do Roteiro 2 e o paciente permanecer em silêncio.',
    script: 'Olá, [Nome]. Como não conseguimos conversar por telefone nestes últimos dias, imagino que sua rotina esteja corrida e que talvez este não seja o momento ideal para o seu planejamento cirúrgico. Vou deixar sua ficha em repouso para não incomodar, mas nossa agenda permanece à sua inteira disposição quando desejar retomar.\n\nEnquanto isso, convido você a acompanhar o Dr. Mário no Instagram: https://www.instagram.com/dr.mariowarde/\n\nExcelente semana!'
  },

  // Hospitais Credenciados
  {
    id: 'hospitais-info',
    category: 'hospitais',
    title: 'Hospitais de Referência e Segurança Cirúrgica',
    badge: 'Padrão Hospitalar AAA',
    situation: 'Quando o paciente pergunta onde o Dr. Mário opera ou questiona a segurança cirúrgica.',
    bulletPoints: [
      'Einstein Hospital Israelita (Morumbi)',
      'Hospital Sírio-Libanês (Bela Vista)',
      'Hospital Vila Nova Star (Vila Nova Conceição)',
      'O Dr. Mário opera exclusivamente em centros cirúrgicos hospitalares de primeira linha com UTI completa e retaguarda médica total, nunca em clínicas de fundo de consultório.'
    ],
    note: 'Argumento de autoridade máximo contra clínicas que operam em salas comerciais sem estrutura hospitalar.'
  }
];

const CATEGORIES = [
  { id: 'ALL', label: 'Todos os Módulos' },
  { id: 'regras', label: '5 Regras de Ouro' },
  { id: 'voz', label: 'Ligações de Voz (3.1)' },
  { id: 'primeiro_contato', label: 'Abordagem & Convite' },
  { id: 'preco', label: 'Contorno de Preço' },
  { id: 'reserva', label: 'Reserva 50% Pix' },
  { id: 'endereco', label: 'Endereço & Valet' },
  { id: 'telemedicina', label: 'Telemedicina VIP' },
  { id: 'resgate', label: 'Resgate & Break-up' },
  { id: 'hospitais', label: 'Hospitais Parceiros' }
];

export default function PlaybookDrawer({ isOpen, onClose }: PlaybookDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fecha no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredItems = PLAYBOOK_ITEMS.filter(item => {
    const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSearch = searchTerm.trim() === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.situation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.script && item.script.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.bulletPoints && item.bulletPoints.some(bp => bp.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchCategory && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop com Blur Suave */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Painel Lateral Deslizante (Quiet Luxury Slide-Over) */}
      <div 
        className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-[#fbfaf8] h-full shadow-2xl border-l border-slate-200/80 flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO DO DRAWER */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200/80 flex flex-col gap-3 shrink-0 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-[#310f0e] rounded-full"></span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] tracking-tight flex items-center gap-2">
                  <span>Playbook Comercial Concierge</span>
                  <span className="text-[11px] font-semibold text-[#310f0e] bg-[#310f0e]/5 border border-[#310f0e]/15 px-2 py-0.5 rounded-full">
                    v1.4 Oficial
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Roteiros de Cirurgia Plástica de Alto Padrão • Atendimento Concierge Ana Paula & Dr. Mário Warde
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/playbook-comercial.html"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#310f0e] bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Abrir Playbook em aba inteira separada"
              >
                <span>Nova Aba</span>
                <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Fechar Playbook (Esc)"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por roteiro, objeção, ligação telefônica, preço, hospital..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e] transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Abas Rápidas de Categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 crm-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#310f0e] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* CORPO DE SCRIPTS COM SCROLL INTERNO */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 crm-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Nenhum roteiro ou diretriz encontrada para o termo pesquisado.
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col gap-3 transition-all hover:border-[#310f0e]/30"
              >
                {/* Topo do Item */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {item.badge && (
                      <span className="text-[10px] font-bold text-[#310f0e] bg-[#310f0e]/5 border border-[#310f0e]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                        {item.badge}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {item.script && (
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.script)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        copiedId === item.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1d1d1f] hover:bg-[#310f0e] text-white'
                      }`}
                      title="Copiar texto para colar no WhatsApp"
                    >
                      {copiedId === item.id ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copiar Roteiro</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Situação */}
                <p className="text-xs text-slate-600 font-medium">
                  <span className="font-bold text-slate-800">Situação: </span>
                  {item.situation}
                </p>

                {/* Script com Formatação Glass */}
                {item.script && (
                  <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-3.5 text-xs sm:text-[13px] text-slate-800 font-normal leading-relaxed whitespace-pre-line select-text">
                    {item.script}
                  </div>
                )}

                {/* Bullet Points */}
                {item.bulletPoints && (
                  <ul className="space-y-1.5 bg-[#f8fafc] border border-slate-200/80 rounded-xl p-3.5 text-xs sm:text-[13px] text-slate-800">
                    {item.bulletPoints.map((bp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#310f0e] font-bold">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Nota / Dica Operacional */}
                {item.note && (
                  <p className="text-[11px] text-slate-500 font-normal border-t border-slate-100 pt-2 whitespace-pre-line">
                    <span className="font-semibold text-slate-700">Orientação Concierge: </span>
                    {item.note}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* RODAPÉ INFORMATIVO */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Clínica Dr. Mário Warde • Vila Madalena, São Paulo</span>
          <span>Padrão White Glove 2026</span>
        </div>
      </div>
    </div>
  );
}
