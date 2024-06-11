import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = null; 

  constructor(private router: Router,private usuarioService: UsuarioService) { }

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
      
      // Obtiene la lista de clientes del almacenamiento local
      const clientesString = localStorage.getItem('clientes');
      if (clientesString) {
        // Parsea la lista de clientes del almacenamiento local
        const clientes: any[] = JSON.parse(clientesString); // Especificamos el tipo de clientes como any[]
        
        // Busca al usuario logueado dentro de la lista de clientes
        this.usuario = clientes.find((cliente: any) => cliente.username === usuarioLogueado.username); // Especificamos el tipo de cliente como any
        console.log('Datos del usuario logueado:', this.usuario);
      } else {
        console.error('Lista de clientes no encontrada en el localStorage');
      }
    } else {
      console.error('Datos del usuario no encontrados en el localStorage');
    }

  
  
}
}