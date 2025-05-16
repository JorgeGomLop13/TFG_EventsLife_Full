import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/core/types/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  public role: string = '';
  public userName: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  register(user: User) {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/signin`, { email, password });
  }
  setRole(role: string) {
    localStorage.setItem('role', role);
  }
  setUserName(name: string) {
    localStorage.setItem('userName', name);
  }
  getRole() {
    this.role = localStorage.getItem('role') || '';
    return this.role;
  }
  getUserName() {
    this.userName = localStorage.getItem('userName') || '';
    return this.userName;
  }

  logout() {
    this.deleteLocalStorage();
    this.role = '';
    this.userName = '';
    this.router.navigate(['/home']);
  }
  //Para comprobar si el usuario está logueado
  isAuthenticated() {
    const token = localStorage.getItem('token');
    //Primero comprobamos que el token existe y no es nulo, si no existe redirigimos a la pagina de login
    if (token) {
      try {
        //Decodificamos el token para obtener su payload y sacar su fecha de expiracion
        const tokenDecoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        //Luego verificamos que el token no haya expirado, si ha expirado redirigimos devuelve false
        if (tokenDecoded.exp && tokenDecoded.exp < now) {
          return false;
        }
        //Si el token es valido y no ha expirado, se devuelve true
        return true;
      } catch (e) {
        //Si detecta algun error al decodificar el token devuelve false
        console.error('Error decoding token:', e);
        return false;
      }
    }
    return false;
  }
  deleteLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
  }
}
