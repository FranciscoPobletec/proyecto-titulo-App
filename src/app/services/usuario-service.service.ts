import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private ruta: string = 'http://127.0.0.1:8000/loginToken/';
  private usuarioRuta: string = 'http://127.0.0.1:8000/api/usuario/'; 
  private logoutRuta: string = 'http://127.0.0.1:8000/logoutToken/';

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Promise<any> {
    const credentials = { username, password };
    return this.http.post(this.ruta, credentials).toPromise();
  }

  async obtenerUsuarioAutenticado(token: string): Promise<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    try {
      const response = await this.http.get(this.usuarioRuta, { headers }).toPromise();
      return response;
    } catch (error) {
      throw new Error('Error al obtener el usuario autenticado');
    }
  }

  obtenerUsuarioPorId(userId: number, token: string): Promise<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get(`${this.usuarioRuta}${userId}/`, { headers }).toPromise();
  }

  obtenerUsuarios(): Promise<any> {
    return this.http.get(this.usuarioRuta).toPromise();
  }
  
}
