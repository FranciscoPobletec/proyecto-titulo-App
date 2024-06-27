import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private ruta: string = 'https://vecina-hay-pan.cl/loginToken/';
  private usuarioRuta: string = 'https://vecina-hay-pan.cl/api/usuario/';
  private logoutRuta: string = 'https://vecina-hay-pan.cl/logoutToken/';

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Promise<any> {
    const credentials = { username, password };
    return this.http.post(this.ruta, credentials).toPromise()
      .catch(error => {
        throw new Error(`Error en inicio de sesión:, ${error.message}`);
      });
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
