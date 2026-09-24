import { neon } from '@neondatabase/serverless';
import Link from 'next/link';
import Image from 'next/image';
import KanbanBoard from '@/components/crm/KanbanBoard';
import LogoutButton from '@/components/crm/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const view = resolvedParams.view || 'kanban';

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
    <div className="min-h-screen bg-[#ccb9b6] p-4 sm:p-8">
      <div className="w-full max-w-none mx-auto overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/brand/logo-horizontal-wine.svg" 
              alt="Dr. Mário Warde" 
              width={200} 
              height={40} 
              className="h-8 w-auto"
            />
            <div className="hidden sm:block h-6 w-px bg-white/30"></div>
            <p className="text-white/90 text-[15px] font-medium tracking-tight mt-0.5">Gestão de aquisição de pacientes</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="bg-black/10 p-1 rounded-lg flex items-center gap-1">
              <Link 
                href="?view=kanban"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-white/80 hover:text-white'}`}
              >
                Colunas
              </Link>
              <Link 
                href="?view=list"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-white/80 hover:text-white'}`}
              >
                Lista
              </Link>
            </div>

            {/* Leads Counter */}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-black/5 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-[#1d1d1f]">{leads.length} capturados</span>
            </div>

            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>

        {view === 'kanban' ? (
          <KanbanBoard initialLeads={leads} />
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
