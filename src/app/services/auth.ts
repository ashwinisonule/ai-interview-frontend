import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );

  }

  login(data: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/login`,
      data
    );

  }

  saveLoginData(response: any): void {

    localStorage.setItem(
      'token',
      response.token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(response.user)
    );

  }

  getUser(): any {

    const user =
      localStorage.getItem('user');

    return user
      ? JSON.parse(user)
      : null;

  }

  getToken(): string | null {

    return localStorage.getItem('token');

  }

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

  }

}