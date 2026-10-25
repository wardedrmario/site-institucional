// Seção 1.h da Meta: rotas cujas URLs carregam nomes de procedimentos (blog) ou dados internos (admin)
// nunca devem ter a URL enviada à Meta (PageView automático, Pixel client-side ou event_source_url da CAPI).
export const META_RESTRICTED_PATH_REGEX = /^\/(blog|admin)(\/|$)/;

// Apenas o domínio oficial envia dados à Meta. URLs técnicas da Vercel (*.vercel.app) e localhost ficam de fora.
export const META_ALLOWED_HOSTS = ['drmariowarde.com', 'www.drmariowarde.com'];

export function isMetaAllowedHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return META_ALLOWED_HOSTS.includes(host.split(':')[0].toLowerCase());
}

export function isMetaRestrictedPath(pathname: string | null | undefined): boolean {
  return !!pathname && META_RESTRICTED_PATH_REGEX.test(pathname);
}
