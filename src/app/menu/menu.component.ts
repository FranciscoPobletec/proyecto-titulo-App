import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  {
  pages = [
    { title: 'principal', url: '/principal', icon: 'principal' },
  ];

  constructor(private router: Router ,private dbService: DbService) {}


  // Define tus funciones aquí
  editar() {
    // Código para la función editar
  }

  verHistorial() {
    // Código para la función verHistorial
  }

  verCarrito() {
    // Código para la función verCarrito
  }

  desconectar() {
    this.dbService.eliminarSesion();
let extras: NavigationExtras = {
    replaceUrl: true
}
this.router.navigate(['login'],extras);
  }
}
