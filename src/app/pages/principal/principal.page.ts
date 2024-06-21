import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  productos: any[] = [];
  filteredProductos: any[] = [];
  searchQuery: string = '';
  usuario: string = '';
  token: string = '';
  color: string = 'light';
  starHover: number = 0; 
  constructor(
    private router: Router,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token') || '';
    this.usuario = JSON.parse(localStorage.getItem('user') || '{}').username;
    if (!this.usuario || !this.token) {
      this.router.navigate(['/login']);
      return;
    }

    this.actualizarPrincipal();
  }
  actualizarPrincipal() {
    this.obtenerProductos();

  }
  getStockOptions(stock: number): number[] {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }

  obtenerProductos() {
    this.productoService.obtenerProductos(this.token).subscribe(
      (data: any) => {
        this.productos = data;
        this.filteredProductos = data; // Inicialmente mostrar todos los productos
      },
      (error) => {
        console.error('Error al obtener productos:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }


  fav() {
    if (this.color == 'light') {
      this.color = 'danger';
    } else {
      this.color = 'light';
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Notificación',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  addToCart(product: any) {
    if (product.selectedQuantity > 0) {
      const storedProducts = localStorage.getItem('selectedProducts');
      const selectedProducts = storedProducts ? JSON.parse(storedProducts) : [];
      const existingProduct = selectedProducts.find((p: any) => p.id === product.id);

      if (existingProduct) {
        if (existingProduct.cantidadSeleccionada + product.selectedQuantity <= product.cantidad) {
          existingProduct.cantidadSeleccionada += product.selectedQuantity;
          this.presentAlert('Producto agregado al carrito.');
        } else {
          this.presentAlert('No se puede agregar más del stock disponible.');
        }
      } else {
        const productToCart = {
          ...product,
          cantidadSeleccionada: product.selectedQuantity
        };
        selectedProducts.push(productToCart);
        this.presentAlert('Producto agregado al carrito.');
      }

      localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
      product.selectedQuantity = 0;
      this.router.navigate(['/cart']);
    } else {
      this.presentAlert('Por favor, seleccione una cantidad válida.');
    }
  }



  verCarrito() {
    this.router.navigate(['/principal']);
  }

  ordenarProductos(criterio: string) {
    switch (criterio) {
      case 'name_asc':
        this.filteredProductos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name_desc':
        this.filteredProductos.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'price_asc':
        this.filteredProductos.sort((a, b) => a.precio - b.precio);
        break;
      case 'price_desc':
        this.filteredProductos.sort((a, b) => b.precio - a.precio);
        break;
    }
  }

  buscarProducto() {
    const query = this.searchQuery.toLowerCase();
    
    if (query.trim() === '') {
      this.productos = this.productos;
    } else {
      this.productos = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query) ||
        producto.descripcion.toLowerCase().includes(query)
      );
    }
  }
  limpiarBusqueda() {
    this.obtenerProductos(); 
    this.searchQuery = ''; 
  }
  setRating(producto: any, rating: number) {
    producto.rating = rating;
  }
}