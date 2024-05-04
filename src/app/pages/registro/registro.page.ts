import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario-service.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre: string = '';
  apellidoP: string = '';
  apellidoM: string = '';
  correo: string = '';
  contrasenia: string = '';
  telefono: string = '';
  direccion: string = '';
  confirmarContrasena: string = '';

  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
  }

  mostrarAlerta(header: string, message: string) {
    this.isAlertOpen = true;
    this.alertHeader = header;
    this.alertMessage = message;
  }

  registro() {
    if (!this.nombre || !this.correo || !this.contrasenia || !this.confirmarContrasena) {
      this.mostrarAlerta('Campos incompletos', 'Por favor, complete todos los campos.');
    } else if (this.contrasenia !== this.confirmarContrasena) {
      this.mostrarAlerta('Contraseñas no coinciden', 'Las contraseñas no coinciden.');
    } else if (this.contrasenia.length < 8) {
      this.mostrarAlerta('Contraseña débil', 'La contraseña debe tener al menos 8 caracteres.');
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.correo)) {
        this.mostrarAlerta('Correo electrónico inválido', 'El correo electrónico ingresado no es válido.');
      } else {
        const usuario = {
          nombreUsuario: this.nombre,
          correoElectronico: this.correo,
          contrasena: this.contrasenia,
        };

        this.usuarioService.agregarUsuario(usuario);

        // Limpiar los campos del formulario
        this.nombre = '';
        this.correo = '';
        this.contrasenia = '';
        this.confirmarContrasena = '';

        // Redirigir a la página principal
        this.router.navigate(['/login']);
      }
    }
  }
}