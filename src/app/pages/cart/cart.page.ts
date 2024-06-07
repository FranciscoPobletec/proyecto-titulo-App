import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  selectedProducts: any[] = [];
  usuario: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadSelectedProducts();
    this.loadUser();
  }

  loadSelectedProducts() {
    const products = localStorage.getItem('selectedProducts');
    this.selectedProducts = products ? JSON.parse(products) : [];
  }

  loadUser() {
    const user = localStorage.getItem('user');
    this.usuario = user ? JSON.parse(user).username : '';
    if (!this.usuario) {
      this.router.navigate(['/login']);
    }
  }

  clearCart() {
    this.selectedProducts = [];
    localStorage.removeItem('selectedProducts');
  }
}
