import { neon } from '@neondatabase/serverless';
import Link from 'next/link';
import Image from 'next/image';
import KanbanBoard, { DbLead } from '@/components/crm/KanbanBoard';
import LogoutButton from '@/components/crm/LogoutButton';
import AutoRefresh from '@/components/crm/AutoRefresh';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const view = resolvedParams.view || 'kanban';
  const isPlaybookOpen = resolvedParams.playbook === 'open';

  // Busca os leads
  let leads: DbLead[] = [];
  try {
    let dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (dbUrl && !dbUrl.startsWith('postgres')) {
      dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') ? process.env.DATABASE_URL : undefined;
    }
    if (dbUrl) {
      const sql = neon(dbUrl as string);

      // Injeção do Script de Resgate White Glove no card do Sr. Cláudio
      const claudioRescueMessage = `Olá, Sr. Cláudio, bom dia! Tudo bem com o senhor? Aqui é a Ana Paula, Concierge do Dr. Mário Warde.

Passando para saber como o senhor está. Sei como a rotina na semana é corrida e os compromissos acabam atropelando o tempo.

O Dr. Mário estava revisando o planejamento dos atendimentos e me pediu para fazer um contato especial com o senhor. Ele achou o seu caso de contorno corporal e alinhamento do tórax muito interessante pelas proporções anatômicas e pelos resultados harmônicos que conseguimos alcançar hoje com as técnicas atuais.

Como estamos abrindo a grade exclusiva da próxima semana, reservei duas opções de horários privativos e sem sobreposição com o Dr. Mário para conversarem com calma:

Quarta-feira (21/10) às 15h30
Quinta-feira (22/10) às 16h00

Algum desses momentos fica mais confortável para o senhor passar aqui na clínica na Vila Madalena?`;

      try {
        await sql`
          UPDATE leads 
          SET ai_suggestion = ${claudioRescueMessage}
          WHERE (phone LIKE '%996768256%' OR name ILIKE '%Cláudio%')
            AND (ai_suggestion IS NULL OR ai_suggestion NOT LIKE '%tórax%');
        `;
      } catch (e) {
        console.warn('Auto-resgate Cláudio:', e);
      }

      leads = (await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 200`) as DbLead[];
    }
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] p-3 sm:p-6 lg:p-8">
      <AutoRefresh leadsCount={leads.length} />
      <div className="w-full max-w-none mx-auto">
        {/* CABEÇALHO PRINCIPAL DO CRM (Quiet Luxury) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-black/5 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <Image 
              src="/brand/logo-horizontal-wine.svg" 
              alt="Dr. Mário Warde" 
              width={200} 
              height={40} 
              className="h-8 sm:h-9 w-auto"
            />
            <div className="hidden sm:block h-7 w-px bg-slate-200"></div>
            <div>
              <p className="text-slate-800 text-sm sm:text-[15px] font-semibold tracking-tight">
                Gestão de Pacientes & Concierge
              </p>
              <p className="text-slate-500 text-xs hidden sm:block">
                Padrão Quiet Luxury • Operação Ana Paula & Dr. Mário Warde
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* View Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <Link 
                href="?view=kanban"
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  view === 'kanban' 
                    ? 'bg-white text-[#1d1d1f] shadow-xs' 
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Colunas
              </Link>
              <Link 
                href="?view=list"
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  view === 'list' 
                    ? 'bg-white text-[#1d1d1f] shadow-xs' 
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Lista
              </Link>
            </div>

            {/* Manuais Operacionais */}
            <div className="flex items-center gap-2">
              <a 
                href="/manual-crm.html" 
                target="_blank" 
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-2xs border border-slate-200 hover:border-slate-300 flex items-center cursor-pointer"
                title="Abrir Manual de Boas Práticas e Operação do CRM"
              >
                Manual CRM
              </a>
              <Link 
                href={isPlaybookOpen ? (view === 'table' ? '/admin?view=table' : '/admin') : (view === 'table' ? '/admin?view=table&playbook=open' : '/admin?playbook=open')}
                className="bg-white hover:bg-slate-50 text-[#310f0e] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-2xs border border-[#310f0e]/20 hover:border-[#310f0e]/40 flex items-center cursor-pointer"
                title="Abrir Playbook Comercial Concierge (Gaveta Integrada)"
              >
                Playbook
              </Link>
            </div>

            {/* Contador de Leads */}
            <div className="bg-white px-3.5 py-1.5 rounded-xl shadow-2xs border border-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">{leads.length} pacientes</span>
            </div>

            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>

        {/* ÁREA PRINCIPAL: KANBAN BOARD OU LISTA */}
        {view === 'kanban' ? (
          <KanbanBoard initialLeads={leads} defaultPlaybookOpen={isPlaybookOpen} />
        ) : (
          <div className="bg-white rounded-2xl shadow-xs border border-black/5 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#1d1d1f]">Todos os Registros de Pacientes</h2>
              <span className="text-xs text-slate-500 font-medium">Exibindo os {leads.length} pacientes mais recentes</span>
            </div>
            <div className="overflow-x-auto crm-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-black/5 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4">Data</th>
                    <th className="p-4">Paciente</th>
                    <th className="p-4">Procedimento</th>
                    <th className="p-4">Urgência</th>
                    <th className="p-4">Etapa Atual</th>
                    <th className="p-4">Origem</th>
                    <th className="p-4 text-right">Contato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-xs sm:text-[13px]">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-500">Nenhum registro encontrado.</td>
                    </tr>
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    leads.map((lead: any) => {
                      const data = new Date(lead.created_at).toLocaleString('pt-BR', { 
                        day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' 
                      });
                      
                      let utmCampaign = 'Orgânico';
                      try {
                        if (lead.utms) {
                          const parsed = typeof lead.utms === 'string' ? JSON.parse(lead.utms) : lead.utms;
                          utmCampaign = parsed.utm_campaign || parsed.camp_id || 'Orgânico';
                        }
                      } catch { /* ignorar erro */ }

                      const cleanPhone = lead.phone.replace(/\D/g, '');
                      const whatsLink = `https://wa.me/${cleanPhone.length <= 11 ? '55'+cleanPhone : cleanPhone}`;

                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4 text-slate-500 font-normal whitespace-nowrap">{data}</td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-900 text-sm">{lead.name}</div>
                            <div className="text-slate-500 font-medium mt-0.5">{lead.phone}</div>
                          </td>
                          <td className="p-4 font-semibold text-slate-900">{lead.procedure || '-'}</td>
                          <td className="p-4 text-slate-600">{lead.timeframe || '-'}</td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                              {lead.status || 'triagem'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="bg-[#310f0e]/10 text-[#310f0e] px-2.5 py-1 rounded-full text-xs font-semibold">
                              {utmCampaign}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <a 
                              href={whatsLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-semibold transition-all shadow-2xs"
                            >
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
