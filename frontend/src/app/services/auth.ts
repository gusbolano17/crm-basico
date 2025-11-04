import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Environment } from '../core/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  isAuthenticated = signal<boolean>(!!sessionStorage.getItem('access_token'));

  login(body: { email: string; password: string }) : Observable<{accessToken: string, refreshToken: string}> {
    return this.http.post<{accessToken: string, refreshToken: string}>(`${Environment.API_URL}/usuario/login`, body).pipe(
      tap(({ accessToken, refreshToken }) => {
        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('refresh_token', refreshToken);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(body : {refreshToken?: string} = {}) {
    return this.http.post(`${Environment.API_URL}/usuario/logout`, body).pipe(
      tap(() => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
      })
    );
  }

  get token(){
    return sessionStorage.getItem('access_token');
  }

  refresh(){
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return;
    }

    return this.http.post<{ newAccessToken: string, newRefreshToken: string }>(`${Environment.API_URL}/usuario/refresh`, { refreshToken }).pipe(
      tap(({ newAccessToken, newRefreshToken }) => {
        sessionStorage.setItem('access_token', newAccessToken);
        sessionStorage.setItem('refresh_token', newRefreshToken);
      })
    );
  }
  
}
