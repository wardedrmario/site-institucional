import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const pass = resolvedParams.pass;

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
  let leads: any[] = [];
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">CRM / Pacientes</h1>
            <p className="text-[#86868b] mt-1">Gestão de captação</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-black/5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-[#1d1d1f]">{leads.length} leads</span>
          </div>
        </div>

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
                  leads.map((lead) => {
                    const data = new Date(lead.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
                    
                    let utmCampaign = 'Orgânico';
                    let utmSource = '-';
                    try {
                      if (lead.utms) {
                        const parsed = typeof lead.utms === 'string' ? JSON.parse(lead.utms) : lead.utms;
                        utmCampaign = parsed.utm_campaign || parsed.camp_id || 'Orgânico';
                        utmSource = parsed.utm_source || parsed.ad_id || '-';
                      }
                    } catch(e) {}

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
      </div>
    </div>
  );
}
