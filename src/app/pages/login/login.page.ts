import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario-service.service';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  mdl_usuario: string = '';
  mdl_contrasena: string = '';

  constructor(
    private router: Router, 
    private usuarioService: UsuarioService, 
    private alertController: AlertController,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.menuController.enable(false);
  }

  ngOnDestroy() {
    this.menuController.enable(true);
  }

  async login() {
    if (!this.mdl_usuario || !this.mdl_contrasena) {
      this.mostrarErrorCamposIncompletos();
      return; 
    }

    try {
      const response = await this.usuarioService.login(this.mdl_usuario, this.mdl_contrasena);
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.mostrarMensajeIngresoCorrecto();
      } else {
        this.mostrarErrorClaveUsuarioIncorrecto();
      }
    } catch (error) {
      console.error("Error en inicio de sesión:", JSON.stringify(error)); // Muestra el objeto de error completo
      this.mostrarErrorClaveUsuarioIncorrecto();
    }
    
  }



  
  async mostrarErrorCamposIncompletos() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor complete todos los campos',
      buttons: ['OK']
    });

    await alert.present();
  }

  async mostrarErrorClaveUsuarioIncorrecto() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Clave o usuario incorrecto',
      buttons: ['OK']
    });

    await alert.present();
  }


  async mostrarMensajeIngresoCorrecto() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Ingreso correcto. Redirigiendo...',
      buttons: ['OK']
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
      this.router.navigate(['/principal']);
    }, 500);  
  }
}
