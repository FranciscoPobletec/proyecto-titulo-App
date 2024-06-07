import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { UsuarioService } from '../services/usuario-service.service';

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
  constructor(private router: Router, private dbService: DbService,private usuarioService: UsuarioService) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    this.usuario = user ? JSON.parse(user).username : '';
  }
  // Define tus funciones aquí
  perfil() {
    // Código para la función editar
  }

  verHistorial() {
    // Código para la función verHistorial
  }

  verCarrito() {
  this.router.navigate(['cart']);
  }

  desconectar() {
    this.dbService.eliminarSesion();
let extras: NavigationExtras = {
    replaceUrl: true
}
this.router.navigate(['login'],extras);
  }
}
