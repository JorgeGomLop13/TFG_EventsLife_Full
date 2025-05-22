/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router: Router) {}

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, {
      headers: {
        Accept: 'application/json'
      }
    });
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  logout() {
    this.deleteLocalStorage();
    this.router.navigate(['/home']);
  }
  //Para comprobar si el usuario está logueado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
  }

  deleteLocalStorage() {
    localStorage.removeItem('token');
  }

  isOrganizer(): Observable<boolean> {
    return this.getUser().pipe(
      map((user) => user.role === 'organizer'),
      catchError((err) => {
        console.error('Error al obtener usuario', err);
        return of(false);
      })
    );
  }
}
