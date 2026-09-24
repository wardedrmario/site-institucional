'use server';

import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  
  // A senha global configurada no ambiente (ou fallback para testar)
  const masterPassword = process.env.CRM_PASSWORD || 'warde2026';

  if (password === masterPassword) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_123');
    
    const alg = 'HS256';
    const jwt = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('30d') // Sessão de 30 dias
      .sign(secret);

    (await cookies()).set('crm_session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });

    return { success: true };
  }

  return { success: false, error: 'Senha incorreta.' };
}

export async function logout() {
  (await cookies()).delete('crm_session');
  redirect('/admin/login');
}
