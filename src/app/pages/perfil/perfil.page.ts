import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';
 // Asegúrate de importar el modelo de Comuna si lo tienes
export interface Comuna {
  id: number;
  nombre: string;
}
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = null;
  comunaNombre: string = ''; // Variable para almacenar el nombre de la comuna

  constructor(private router: Router, private usuarioService: UsuarioService,private registroService: RegistroService) { }

  ngOnInit() {
    this.cargarUsuario();
  }

  volver() {
    this.router.navigate(['/principal']);
  }

  cargarUsuario() {
    const usuarioString = localStorage.getItem('user');
    if (usuarioString) {
      // Parsea el objeto JSON del usuario logueado
      const usuarioLogueado = JSON.parse(usuarioString);

      // Asigna directamente el objeto de usuario logueado
      this.usuario = usuarioLogueado;

      // Obtener el nombre de la comuna del servicio
      this.registroService.obtenerComunaPorId(this.usuario.comuna).subscribe(
        (comuna: Comuna) => {
          this.comunaNombre = comuna.nombre; // Asignar el nombre de la comuna
        },
        error => {
          console.error('Error al obtener la comuna:', error);
          // Puedes mostrar un mensaje de error si no se puede obtener la comuna
        }
      );

      // Puedes imprimir o usar this.usuario según tus necesidades
      console.log('Datos del usuario logueado:', this.usuario);
    } else {
      console.error('Datos del usuario no encontrados en el localStorage');
    }
  }
}
