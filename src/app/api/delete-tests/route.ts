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
    
    const deleted = await sql`
      DELETE FROM leads 
      WHERE name ILIKE '%teste%' 
         OR name ILIKE '%test%' 
         OR phone LIKE '%997490298%' 
         OR phone LIKE '%999999999%' 
         OR phone LIKE '%111111111%'
         OR utms LIKE '%teste_sintetico%'
      RETURNING id, name, phone, procedure;
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Limpeza de testes concluída com sucesso',
      deleted_count: deleted.length,
      deleted_records: deleted
    });
  } catch (error: any) {
    console.error('Erro na limpeza de testes:', error);
    return NextResponse.json({ error: 'Falha ao executar limpeza', details: error.message }, { status: 500 });
  }
}
