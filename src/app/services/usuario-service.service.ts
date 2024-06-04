import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  ruta: string ='http://127.0.0.1:8000/loginToken/';
  ;

  constructor(private router: Router, private http: HttpClient ) { }
  login(username: string, password: string): Promise<any> {
    
    const credentials = {
      username: username,
      password: password
    };
    
    return this.http.post(this.ruta, credentials).toPromise();
  }
}
