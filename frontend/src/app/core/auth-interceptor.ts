import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        const refreshResult = auth.refresh();
        return refreshResult ? refreshResult.pipe(
          switchMap(() =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } }))
          )
        ) : throwError(() => new Error('Unable to refresh token'));
      }
      return throwError(() => err);
    })
  );
}