import { HttpInterceptorFn } from '@angular/common/http';
// Le cookie XSRF-TOKEN est volontairement accessible à Angular; LPADA_SESSION reste HttpOnly.
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.url.startsWith('/api/')) {
    const token = document.cookie.split('; ').find(x => x.startsWith('XSRF-TOKEN='))?.substring(11);
    if (token) req = req.clone({ setHeaders: {'X-XSRF-TOKEN': decodeURIComponent(token)} });
  }
  return next(req);
};
