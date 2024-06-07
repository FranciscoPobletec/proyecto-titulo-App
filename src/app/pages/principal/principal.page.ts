import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  productos: any[] = [];
  usuario: string = '';
  token: string = '';
  color: string = 'light';
  mostrarMenu = true;

  constructor(private router: Router, private productoService: ProductoService) { }

  ngOnInit() {
    // Recuperar datos del usuario y token del almacenamiento local
    this.token = localStorage.getItem('token') || '';
    this.usuario = JSON.parse(localStorage.getItem('user') || '{}').username;
    
    // Si el usuario o el token no están disponibles, redirigir al login
    if (!this.usuario || !this.token) {
      this.router.navigate(['/login']);
      return;
    }

    // Realizar la consulta de productos con los datos del usuario y token
    this.obtenerProductos();
  }

  getStockOptions(stock: number): number[] {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }

  obtenerProductos() {
    this.productoService.obtenerProductos(this.token).subscribe((data: any) => {
      // Asigna los productos recuperados a la variable 'productos'
      this.productos = data;
    }, (error) => {
      console.error('Error al obtener productos:', error);
      // Manejar el error (por ejemplo, redirigir al login si el token es inválido)
      if (error.status === 401) {
        this.router.navigate(['/login']);
      }
    });
  }

  fav() {
    if (this.color == 'light') {
      this.color = 'danger';
    } else {
      this.color = 'light';
    }
  }

  addToCart(product: any) {
    if (product.selectedQuantity > 0) {
      const productToCart = {
        ...product,
        cantidadSeleccionada: product.selectedQuantity
      };
      const storedProducts = localStorage.getItem('selectedProducts');
      const selectedProducts = storedProducts ? JSON.parse(storedProducts) : [];
      selectedProducts.push(productToCart);
      localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
      this.router.navigate(['/cart']);
    } else {
      alert('Por favor, seleccione una cantidad válida.');
    }
  }

  verCarrito() {
    this.router.navigate(['/cart']);
  }
}
