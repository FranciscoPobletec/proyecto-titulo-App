import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosSubject = new BehaviorSubject<any[]>([]);

  constructor() { }

  getUsuarios() {
    return this.usuariosSubject.asObservable();
  }

  agregarUsuario(usuario: any) {
    const usuarios = this.usuariosSubject.value;
    usuarios.push(usuario);
    this.usuariosSubject.next(usuarios);
    console.log('Usuarios después de agregar:', usuarios); // Imprime los usuarios después de agregar uno nuevo
  }

  actualizarUsuarioPorNombre(nombreUsuario: string, nuevaContrasena: string) {
    const usuarios = this.usuariosSubject.value;
    const usuario = usuarios.find((u: any) => u.nombreUsuario === nombreUsuario);

    if (usuario) {
      usuario.contrasena = nuevaContrasena;
      this.usuariosSubject.next(usuarios);
      console.log('Usuarios después de actualizar:', usuarios); // Imprime los usuarios después de actualizar uno existente
    }
  }
}