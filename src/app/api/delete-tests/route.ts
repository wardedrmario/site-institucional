import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (dbUrl && !dbUrl.startsWith('postgres')) {
      dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres') ? process.env.DATABASE_URL : undefined;
    }
    
    if (!dbUrl) {
      return NextResponse.json({ error: 'Nenhuma URL de banco de dados válida encontrada.' }, { status: 500 });
    }

    const sql = neon(dbUrl as string);
    
    // Executa a exclusão de leads de teste baseando-se no nome ou email ou procedimento
    const deleted = await sql`
      DELETE FROM leads 
      WHERE name ILIKE '%teste%' 
         OR name ILIKE '%test%' 
         OR email ILIKE '%test%'
         OR procedure ILIKE '%teste%'
      RETURNING id, name, email;
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Limpeza concluída com sucesso',
      deleted_count: deleted.length,
      deleted_records: deleted
    });
  } catch (error: any) {
    console.error('Erro na limpeza de testes:', error);
    return NextResponse.json({ error: 'Falha ao executar limpeza', details: error.message }, { status: 500 });
  }
}
