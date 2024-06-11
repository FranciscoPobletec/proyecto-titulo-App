import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  selectedProducts: any[] = [];
  usuario: string = '';
  token: string = '';
  editingProductId: number | null = null;

  constructor(
    private router: Router, 
    private productoService: ProductoService, 
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token') || '';
    this.usuario = JSON.parse(localStorage.getItem('user') || '{}').username;
    if (!this.usuario || !this.token) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarProductosSeleccionados();
  }

  cargarProductosSeleccionados() {
    const storedProducts = localStorage.getItem('selectedProducts');
    this.selectedProducts = storedProducts ? JSON.parse(storedProducts) : [];
  }

  startEditing(productId: number) {
    this.editingProductId = productId;
  }

  stopEditing() {
    this.editingProductId = null;
    this.actualizarProductosSeleccionados();
  }

  incrementQuantity(product: any) {
    if (product.cantidadSeleccionada < product.cantidad) {
      product.cantidadSeleccionada++;
      this.actualizarProductosSeleccionados();
    }
  }

  decrementQuantity(product: any) {
    if (product.cantidadSeleccionada > 1) {
      product.cantidadSeleccionada--;
      this.actualizarProductosSeleccionados();
    }
  }

  removeProduct(productId: number) {
    this.selectedProducts = this.selectedProducts.filter(p => p.id !== productId);
    this.actualizarProductosSeleccionados();
  }

  clearCart() {
    
    this.selectedProducts = [];
    this.actualizarProductosSeleccionados();
    
    this.router.navigate(['/principal']);
  }

  actualizarProductosSeleccionados() {
    localStorage.setItem('selectedProducts', JSON.stringify(this.selectedProducts));
  }

  getTotalPrice() {
    return this.selectedProducts.reduce((total, product) => total + product.precio * product.cantidadSeleccionada, 0);
  }

  confirmCart() {
    
  }
}
