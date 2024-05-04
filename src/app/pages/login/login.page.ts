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

  isAlertOpen = false;
  alertButtons = ['OK'];

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {}

  navegar() {
    this.usuarioService.getUsuarios().subscribe((usuarios: any[]) => {
      const usuario = usuarios.find(
        (u: any) =>
          u.nombreUsuario === this.mdl_usuario && u.contrasena === this.mdl_contrasena
      );

      if (usuario) {
        let parametros: NavigationExtras = {
          state: {
            user: usuario.nombreUsuario,
            pass: usuario.contrasena,
          },
        };
        console.log("antes de la ruta")
        this.router.navigate(['principal'], parametros);
        console.log('Usuario ingresado correctamente.'); // Log success message
      } else {
        this.isAlertOpen = true;
        console.log('Usuario o contraseña incorrectos.');
      }
    });
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}

