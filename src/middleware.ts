import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Apenas proteger as rotas que começam com /admin
  if (!path.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Se a rota já for a página de login, não precisa proteger, 
  // mas podemos redirecionar para /admin se já estiver logado
  if (path === '/admin/login') {
    return NextResponse.next();
  }

  // Verifica o cookie de sessão
  const token = request.cookies.get('crm_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key_123');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    // Token inválido ou expirado
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
