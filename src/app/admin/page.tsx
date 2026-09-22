import { neon } from '@neondatabase/serverless';
import Link from 'next/link';
import Image from 'next/image';
import KanbanBoard from '@/components/crm/KanbanBoard';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const pass = resolvedParams.pass;
  const view = resolvedParams.view || 'kanban';

  // Proteção básica para o MVP (senha na URL)
  if (pass !== 'warde2026') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-lg max-w-sm w-full border border-black/5">
          <div className="w-16 h-16 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-wine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#310f0e] mb-2">Acesso Restrito</h1>
          <p className="text-[#86868b] mb-6 text-sm">Esta área é exclusiva para a equipe de atendimento do Dr. Mário Warde.</p>
          <p className="text-xs text-black/40">Adicione ?pass=SENHA na URL para acessar.</p>
        </div>
      </div>
    );
  }

  // Busca os leads
  let leads: Record<string, unknown>[] = [];
  try {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      leads = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 200`;
    }
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] p-4 sm:p-8">
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/brand/logo-horizontal-wine.svg" 
              alt="Dr. Mário Warde" 
              width={200} 
              height={40} 
              className="h-8 w-auto"
            />
            <div className="hidden sm:block h-6 w-px bg-black/10"></div>
            <p className="text-[#86868b] text-[15px] font-medium tracking-tight mt-0.5">Gestão de aquisição de pacientes</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="bg-black/5 p-1 rounded-lg flex items-center gap-1">
              <Link 
                href="?pass=warde2026&view=kanban"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
              >
                Colunas
              </Link>
              <Link 
                href="?pass=warde2026&view=list"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
              >
                Lista
              </Link>
            </div>

            {/* Leads Counter */}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-black/5 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-[#1d1d1f]">{leads.length} capturados</span>
            </div>
          </div>
        </div>

        {view === 'kanban' ? (
          <KanbanBoard />
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f7] border-b border-black/5 text-[#86868b] text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Data</th>
                    <th className="p-4 font-semibold">Paciente</th>
                    <th className="p-4 font-semibold">Procedimento</th>
                    <th className="p-4 font-semibold">Previsão</th>
                    <th className="p-4 font-semibold">Origem</th>
                    <th className="p-4 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-[#86868b]">Nenhum registro.</td>
                    </tr>
                  ) : (
                    leads.map((lead: any) => {
                      const data = new Date(lead.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
                      
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
                        <tr key={lead.id} className="hover:bg-[#fbfbfd]">
                          <td className="p-4 text-sm text-[#86868b]">{data}</td>
                          <td className="p-4">
                            <div className="font-semibold text-[#1d1d1f]">{lead.name}</div>
                            <div className="text-xs text-[#86868b]">{lead.phone}</div>
                          </td>
                          <td className="p-4 text-sm font-medium">{lead.procedure || '-'}</td>
                          <td className="p-4 text-sm text-[#86868b]">{lead.timeframe || '-'}</td>
                          <td className="p-4 text-sm">
                            <span className="bg-[#ccb9b6]/20 text-wine px-2 py-1 rounded-full text-xs font-medium">{utmCampaign}</span>
                          </td>
                          <td className="p-4 text-right">
                            <a href={whatsLink} target="_blank" rel="noreferrer" className="inline-block bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors">
                              WhatsApp
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
