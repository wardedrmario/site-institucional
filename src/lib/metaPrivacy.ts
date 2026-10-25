// Seção 1.h da Meta: rotas cujas URLs carregam nomes de procedimentos (blog) ou dados internos (admin)
// nunca devem ter a URL enviada à Meta (PageView automático, Pixel client-side ou event_source_url da CAPI).
export const META_RESTRICTED_PATH_REGEX = /^\/(blog|admin)(\/|$)/;

export function isMetaRestrictedPath(pathname: string | null | undefined): boolean {
  return !!pathname && META_RESTRICTED_PATH_REGEX.test(pathname);
}
