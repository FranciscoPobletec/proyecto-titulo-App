import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  ruta: string = 'http://127.0.0.1:8000/api/usuario/';
  rutaComunas: string = 'http://127.0.0.1:8000/api/comuna/'; 

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any) {
    return this.http.post(this.ruta, usuario);
  }
  
  obtenerComunas() {
    return this.http.get(this.rutaComunas); // Corregido aquí
  }
}
