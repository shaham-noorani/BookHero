import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('auth-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('auth-token');
    }
    return this.token;
  }

  private request(
    method: 'post' | 'get',
    uri: 'auth/login' | 'auth/register' | 'users/me',
    user?: TokenPayload
  ): Observable<any> {
    let base$;

    if (method === 'post') {
      base$ = this.http.post(`/api/${uri}`, user);
    } else {
      base$ = this.http.get(`/api/${uri}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
    }

    const request = base$.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('auth-token');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'auth/register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'auth/login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'users/me');
  }
}
