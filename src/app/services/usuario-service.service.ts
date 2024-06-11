import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Ruta para obtener el token de autenticación
  ruta: string = 'http://127.0.0.1:8000/loginToken/';

  // Ruta para obtener los detalles del usuario actualmente autenticado
  usuarioRuta: string = 'http://127.0.0.1:8000/api/usuario/'; 

  logoutRuta: string = 'http://127.0.0.1:8000/logoutToken/';

  constructor(private router: Router, private http: HttpClient) {}

  // Método para realizar el inicio de sesión
  login(username: string, password: string): Promise<any> {
    const credentials = {
      username: username,
      password: password
    };

    return this.http.post(this.ruta, credentials).toPromise();
  }

  obtenerUsuarioAutenticado(token: string): Promise<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.get(this.usuarioRuta, { headers: headers }).toPromise();
  }

  obtenerUsuarios(): Promise<any> {
    return this.http.get(this.usuarioRuta).toPromise();
  }
  
}
