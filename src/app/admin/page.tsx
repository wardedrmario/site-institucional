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
        
        {/* Header do Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">CRM / Pacientes</h1>
            <p className="text-[#86868b] mt-1">Gestão de captação da Landing Page e Site Institucional</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-black/5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-[#1d1d1f]">{leads.length} leads registrados</span>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f5f7] border-b border-black/5 text-[#86868b] text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Paciente</th>
                  <th className="p-4 font-semibold">Procedimento</th>
                  <th className="p-4 font-semibold">Previsão</th>
                  <th className="p-4 font-semibold">Origem (UTM)</th>
                  <th className="p-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[#86868b]">
                      Nenhum paciente registrado ainda.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const data = new Date(lead.created_at).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
                    });
                    
                    let utmCampaign = 'Orgânico';
                    let utmSource = '-';
                    try {
                      if (lead.utms) {
                        const parsed = typeof lead.utms === 'string' ? JSON.parse(lead.utms) : lead.utms;
                        utmCampaign = parsed.utm_campaign || parsed.camp_id || 'Orgânico';
                        utmSource = parsed.utm_source || parsed.ad_id || '-';
                      }
                    } catch(e) {}

                    // Formata telefone para o link do whats
                    const cleanPhone = lead.phone.replace(/\D/g, '');
                    const whatsLink = \`https://wa.me/\${cleanPhone.length <= 11 ? '55'+cleanPhone : cleanPhone}\`;

                    return (
                      <tr key={lead.id} className="hover:bg-[#fbfbfd] transition-colors group">
                        <td className="p-4 text-sm text-[#86868b] whitespace-nowrap">{data}</td>
                        <td className="p-4">
                          <div className="font-semibold text-[#1d1d1f]">{lead.name}</div>
                          <div className="text-xs text-[#86868b] mt-0.5">{lead.phone}</div>
                        </td>
                        <td className="p-4 text-sm text-[#1d1d1f] font-medium">{lead.procedure || '-'}</td>
                        <td className="p-4 text-sm text-[#86868b]">{lead.timeframe || '-'}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ccb9b6]/20 text-wine">
                            {utmCampaign}
                          </span>
                          {utmSource !== '-' && (
                            <div className="text-[10px] text-[#86868b] mt-1 ml-1 text-opacity-70 truncate max-w-[120px]" title={utmSource}>
                              Ad: {utmSource}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <a 
                            href={whatsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-transform hover:scale-110 shadow-sm"
                            title="Abrir WhatsApp"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.347-.272.273-1.04 1.02-1.04 2.486s1.065 2.885 1.213 3.084c.149.198 2.099 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
                            </svg>
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
