import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  ruta: string = 'https://vecina-hay-pan.cl/api/usuario/';
  rutaComunas: string = 'https://vecina-hay-pan.cl/api/comuna/';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any) {
    console.log('Usuario a registrar:', usuario); // Verifica que password1 esté presente
    return this.http.post(this.ruta, usuario);
  }

  obtenerComunas() {
    return this.http.get(this.rutaComunas);
  }
  obtenerComunaPorId(id: number): Observable<any> {
    const url = `${this.rutaComunas}${id}/`; // Ajusta la URL según la API
    return this.http.get<any>(url);
  }
}
