import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { ReservaService } from 'src/app/services/reserva.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
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
  error: string = '';

  guardarDetallesReservaEnLocalStorage() {
    const detallesReservaStorage = {
      cantidad: null,
      precio_unitario: null,
      total: null,
      reserva: null,
      producto: null
    };

    localStorage.setItem('detallesReserva', JSON.stringify(detallesReservaStorage));
  }

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private reservaService: ReservaService,
    private alertController: AlertController,
  ) { }

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
  recuperarDetallesReservaDesdeLocalStorage() {
    const detallesReservaStr = localStorage.getItem('detallesReserva');
    if (detallesReservaStr) {
      const detallesReserva = JSON.parse(detallesReservaStr);

      console.log('Datos de detalles de reserva:', detallesReserva);

    } else {
      console.error('No se encontraron detalles de reserva en localStorage.');
    }
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
    if (!this.checkSelectedProducts()) {
      return;
    }

    const token = this.getToken();
    if (!token) {
      return;
    }

    const usuarioId = this.getUserId();
    if (!usuarioId) {
      return;
    }

    const reservaInfo = this.createReservaInfo();
    if (!reservaInfo) {
      return;
    }

   
  
    this.createReserva(reservaInfo, token);
  }

  private checkSelectedProducts(): boolean {
    if (this.selectedProducts.length === 0) {
      this.error = 'No hay productos seleccionados para reservar.';
      console.error(this.error);
      return false;
    }
    return true;
  }

  private getToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'Token no encontrado.';
      console.error(this.error);
    }
    return token;
  }

  private getUserId(): string | null {
    const usuarioData = localStorage.getItem('user');
    if (!usuarioData) {
      this.error = 'Datos del usuario no encontrados.';
      console.error(this.error);
      return null;
    }
    let usuarioId;
    try {
      usuarioId = JSON.parse(usuarioData).id;
    } catch (e) {
      this.error = 'Los datos del usuario no son un JSON válido.';
      console.error(this.error);
      return null;
    }
    if (!usuarioId) {
      this.error = 'ID de usuario no encontrado en los datos del usuario.';
      console.error(this.error);
      return null;
    }
    return usuarioId;
  }

  private createReservaInfo(): any | null {
    const localId = this.selectedProducts[0].local;
    const fechaInicio = new Date().toISOString().split('T')[0];
    const horaInicio = new Date().toISOString().split('T')[1].slice(0, 8);
    const productosIds = this.selectedProducts.map(producto => producto.id);

    const reservaInfo = {
      numeroOrden: this.generateUniqueOrderNumber(),
      fechaInicio: fechaInicio,
      horaInicio: horaInicio,
      estado: '1',
      cliente: this.getUserId(),
      local: localId,
      productos: productosIds
    };

    return reservaInfo;
    
  }

  

  actualizarStockProductos(productosIds: number[], token: string): Observable<boolean[]> {
    const observables = productosIds.map(id => {
      const producto = this.selectedProducts.find(p => p.id === id);
      if (producto) {
        const cantidad = producto.cantidadSeleccionada;
        console.log(`Actualizando stock del producto ${id}. Cantidad a restar: ${cantidad}`);

        producto.cantidad -= cantidad;
        console.log(`Stock actualizado en frontend para producto ${id}. Nuevo stock: ${producto.cantidad}`);


        return this.productoService.decrementarStock(id, cantidad, token).pipe(
          map((response: any) => {
            console.log(`Respuesta del backend para producto ${id}:`, response);
            return true; 
          }),
          catchError(error => {
            console.error(`Error al actualizar el stock del producto ${id}:`, error);
            return of(false); 
          })
        );
      }
      return of(false); 
    });

    return forkJoin(observables);
  }

  private createReserva(reservaInfo: any, token: string) {
    let productosActualizados = 0; 

    this.reservaService.crearReserva(reservaInfo, token).subscribe(
        (reservaResponse: any) => {
            console.log('Reserva creada exitosamente:', reservaResponse);
            const reservaId = reservaResponse.id;

            localStorage.setItem('reservaId', reservaId);

            this.actualizarStockProductos(reservaInfo.productos, token).subscribe(
                (resultados: boolean[]) => {
                    resultados.forEach((resultado, index) => {
                        if (resultado) {
                            productosActualizados++;
                            console.log(`Stock de producto ${reservaInfo.productos[index]} actualizado correctamente.`);
                        }
                    });

                    if (productosActualizados === reservaInfo.productos.length) {
                        console.log('Todos los productos han sido actualizados.');
                        this.presentSuccessAlert().then(() => {
                          this.clearCart(); 
                        });
                        this.createDetalleReserva(reservaId, token);
                    }
                },
                (error: any) => {
                    console.error('Error al actualizar el stock de productos:', error);
                }
            );
        },
        (error: any) => {
            console.error('Error al crear la reserva:', error);
        }
    );
}


  
private createDetalleReserva(reservaId: string, token: string) {
  const detallesObservables: Observable<boolean>[] = this.selectedProducts.map(producto => {
      const detalle = {
          cantidad: producto.cantidadSeleccionada,
          precio_unitario: producto.precio,
          total: (producto.cantidadSeleccionada * producto.precio).toFixed(2),
          reserva: reservaId, 
          producto: producto.id,
          
      };
      console.log('Detalle de reserva creado:', detalle);
      return this.reservaService.createDetallesReserva(detalle, token).pipe(
          map((response: any) => {
              console.log('Detalle de reserva creado:', response);
              return true; 
          }),
          catchError(error => {
              console.error('Error al crear el detalle de reserva:', error);
              return of(false);
          })
      );
  });

  forkJoin(detallesObservables).subscribe(
      (resultados: boolean[]) => {
          const todosExitosos = resultados.every(res => res);
          if (todosExitosos) {
              console.log('Todos los detalles de reserva se han creado correctamente.');
              this.clearCart(); 
          } else {
              console.error('Error en la creación de algunos detalles de reserva.');
          }
      },
      error => {
          console.error('Error en la creación de los detalles de reserva:', error);
      }
  );
}

  generateUniqueOrderNumber(): number {
    return Math.floor(Math.random() * 1000000);
  }
  private async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Reserva creada exitosamente.',
      buttons: ['OK']
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
      this.router.navigate(['/principal']);
    }, 3000); // 3000 milisegundos = 3 segundos
  }
}
