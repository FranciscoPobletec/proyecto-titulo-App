import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { UsuarioService } from '../services/usuario-service.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  pages = [
    { title: 'Principal', url: '/principal', icon: 'home' },
  ];
  usuario: string = '';

  constructor(
    private router: Router, 
    private dbService: DbService,
    private usuarioService: UsuarioService,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.actualizarMenu();
  }

  actualizarMenu() {
    const user = localStorage.getItem('user');
    this.usuario = user ? JSON.parse(user).username : '';
  }

  perfil() {
    this.router.navigateByUrl('/perfil', { replaceUrl: true });
    this.actualizarMenu();
  }

  verHistorial() {
    this.router.navigateByUrl('/historial', { replaceUrl: true });
    this.actualizarMenu();
  }

  verCarrito() {
    this.router.navigateByUrl('/cart', { replaceUrl: true });
    this.actualizarMenu();
  }
 
  desconectar() {
    this.dbService.eliminarSesion();
    this.menuController.close();
    this.router.navigateByUrl('/login', { replaceUrl: true });
    this.actualizarMenu();
  }
}
