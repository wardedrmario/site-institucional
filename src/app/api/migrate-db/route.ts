import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'No DB URL' });
    const sql = neon(process.env.DATABASE_URL);
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'triagem';`;
    return NextResponse.json({ success: true, message: 'Migration applied!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
