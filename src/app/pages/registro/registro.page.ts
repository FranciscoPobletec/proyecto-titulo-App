import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  usuario: any = {
    username: '',
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
    apellido_materno: '',
    direccion: '',
    comuna: '', // comuna será el nombre ahora
    rut: '',
    phone: '',
    cliente: true,
    comerciante: false
  };

  comunas: any[] = [];

  constructor(private registroService: RegistroService, private router: Router) { }

  ngOnInit() {
    this.cargarComunas();
  }

  cargarComunas() {
    this.registroService.obtenerComunas().subscribe((data: any) => {
      this.comunas = data;
    });
  }

  async registrar() {
    try {
      const response = await this.registroService.registrarUsuario(this.usuario).toPromise();
      console.log('Usuario registrado:', response);
      // Redirigir al login después del registro exitoso
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en el registro:', error);
      // Mostrar un mensaje de error al usuario
      alert('Error en el registro. Por favor, inténtelo nuevamente.');
    }
  }
}
