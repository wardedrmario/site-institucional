import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    let dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (dbUrl && !dbUrl.startsWith('postgres')) {
       dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') ? process.env.DATABASE_URL : undefined;
    }
    if (!dbUrl || !dbUrl.startsWith('postgres')) {
      return NextResponse.json({ error: 'Nenhuma URL válida (começando com postgres://) foi encontrada nas variáveis de ambiente. Verifique a Vercel.' }, { status: 500 });
    }
    const sql = neon(dbUrl as string);

    // Cria a tabela de Leads se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        city VARCHAR(255),
        procedure VARCHAR(255),
        timeframe VARCHAR(255),
        utms JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_suggestion TEXT;
    `;

    return NextResponse.json({ success: true, message: 'Tabela leads criada/verificada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
