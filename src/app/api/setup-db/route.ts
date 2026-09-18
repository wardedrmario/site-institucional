import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL não configurada' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

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
    `;

    return NextResponse.json({ success: true, message: 'Tabela leads criada/verificada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
