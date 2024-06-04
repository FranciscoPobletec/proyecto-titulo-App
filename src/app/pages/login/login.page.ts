import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  mdl_usuario: string = '';
  mdl_contrasena: string = '';
  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = '';


  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {}

  async login() {
    try {
      const response = await this.usuarioService.login(this.mdl_usuario, this.mdl_contrasena);
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/principal']);
      } else {
        console.error('Error en inicio de sesión: Datos de usuario no válidos');
        this.isAlertOpen = true;
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      this.isAlertOpen = true;
    }
  }
  
  
  mostrarAlerta(header: string, message: string) {
    this.isAlertOpen = true;
    this.alertHeader = header;
    this.alertMessage = message;
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}



