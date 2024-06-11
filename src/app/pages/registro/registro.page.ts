import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import { AlertController, MenuController } from '@ionic/angular';

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
    comuna: '', 
    rut: '',
    phone: '',
    cliente: true,
    comerciante: false
  };

  comunas: any[] = [];

  constructor(
    private registroService: RegistroService, 
    private router: Router, 
    private alertController: AlertController,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.cargarComunas();
    this.menu.enable(false);  // Deshabilitar el menú en la página de registro
  }

  ionViewWillLeave() {
    this.menu.enable(true);  // Habilitar el menú al salir de la página de registro
  }

  cargarComunas() {
    this.registroService.obtenerComunas().subscribe((data: any) => {
      this.comunas = data;
    });
  }
  volver() {
    this.router.navigate(['login']);
  }
  async registrar() {
    if (!this.camposEstanCompletos()) {
      await this.mostrarErrorCamposIncompletos();
      return; // Detener la ejecución si los campos están incompletos
    }

    if (!this.passwordsSonIguales()) {
      await this.mostrarErrorPasswordsNoCoinciden();
      return; // Detener la ejecución si las contraseñas no coinciden
    }

    try {
      const response = await this.registroService.registrarUsuario(this.usuario).toPromise();
      console.log('Usuario registrado:', response);
      await this.mostrarMensajeRegistroExitoso();
      // Redirigir al login después del registro exitoso
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en el registro:', error);
      // Mostrar un mensaje de error al usuario
      await this.mostrarErrorRegistro();
    }
  }

  camposEstanCompletos(): boolean {
    return (
      this.usuario.username &&
      this.usuario.email &&
      this.usuario.password1 &&
      this.usuario.password2 &&
      this.usuario.first_name &&
      this.usuario.last_name &&
      this.usuario.apellido_materno &&
      this.usuario.direccion &&
      this.usuario.comuna &&
      this.usuario.rut &&
      this.usuario.phone
    );
  }

  passwordsSonIguales(): boolean {
    return this.usuario.password1 === this.usuario.password2;
  }

  async mostrarErrorCamposIncompletos() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor complete todos los campos',
      buttons: ['OK']
    });

    return alert.present();
  }

  async mostrarErrorPasswordsNoCoinciden() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Las contraseñas no coinciden. Por favor, inténtelo nuevamente.',
      buttons: ['OK']
    });

    return alert.present();
  }

  async mostrarErrorRegistro() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Error en el registro. Por favor, inténtelo nuevamente.',
      buttons: ['OK']
    });

    return alert.present();
  }

  async mostrarMensajeRegistroExitoso() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Registro exitoso. Redirigiendo al login...',
      buttons: ['OK']
    });

    await alert.present();

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert.dismiss();
        resolve();
      }, 10000);  // 10 segundos
    });
  }
}
