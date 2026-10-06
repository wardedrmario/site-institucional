import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      const sql = neon((process.env.DATABASE_URL || process.env.POSTGRES_URL));
      
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_date TIMESTAMP`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_note TEXT`;
      
      return NextResponse.json({ success: true, message: 'Tabela leads atualizada com sucesso no banco de dados!' });
    } else {
      return NextResponse.json({ success: false, error: 'Variáveis de ambiente não encontradas na Vercel.' });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
