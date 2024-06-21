import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservaService } from 'src/app/services/reserva.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';
import { forkJoin } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';
interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
  // Agrega otras propiedades que pueda tener el producto
}

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  reservaId!: string;
  reserva: any;
  local: any;
  cliente: any;
  producto: any;
  detallesReserva: any[] = [];
  error: string = '';
  estadoCanceladoCliente: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.reservaId = params['id'];
      console.log('ID de la reserva:', this.reservaId);
      this.cargarDetallesReserva(this.reservaId);
    });
  }
  cargarDetallesReserva(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'Token no encontrado.';
        console.error(this.error);
        reject('Token no encontrado.');
        return;
      }
      this.reservaService.getReservaById(id).subscribe(
        reserva => {
          console.log('Reserva obtenida:', id);
          console.log('Reserva obtenida:', reserva);
          this.reserva = reserva;
          if (reserva.local && reserva.cliente && reserva.productos.length > 0) {
            const productoId = reserva.productos[0];
            forkJoin([
              this.productoService.obtenerLocal(reserva.local, token),
              this.usuarioService.obtenerUsuarioPorId(reserva.cliente, token),
              this.productoService.obtenerProductoPorId(productoId, token),
              this.reservaService.getDetallesReservaById(id, token)
            ]).subscribe(
              ([local, cliente, producto, detallesReserva]: [any, any, any, any[]]) => {
                this.local = local;
                this.cliente = cliente;
                this.producto = producto;
                this.detallesReserva = detallesReserva.filter((detalle: any) => detalle.reserva === Number(id));
                console.log('Detalles de reserva obtenidos:', this.detallesReserva);
                this.estadoCanceladoCliente = reserva.estado === '4';
                resolve();
              },
              error => {
                console.error('Error al obtener detalles adicionales:', error);
                this.error = 'Error al obtener detalles adicionales.';
                this.detallesReserva = []; 
                reject(error);
              }
            );
          } else {
            this.error = 'Faltan detalles de la reserva.';
            console.error(this.error);
            this.detallesReserva = []; 
            reject('Faltan detalles de la reserva.');
          }
        },
        error => {
          if (error.status === 404) {
            this.error = 'Reserva no encontrada.';
          } else {
            this.error = 'Error al obtener la reserva.';
          }
          console.error('Error al obtener la reserva:', error);
          this.detallesReserva = []; 
          reject(error);
        }
      );
    });
  }




  obtenerEstadoNombre(estadoId: string): string {
    const estados: { [key: string]: string } = {
      '1': 'Solicitado',
      '2': 'En Espera',
      '3': 'Retirado',
      '4': 'Cancelado por el Cliente',
      '5': 'Cancelado por el Comerciante',
      '6': 'Expirado'
    };
    return estados[estadoId] || 'Desconocido';
  }

  async cancelarReserva() {
    if (this.estadoCanceladoCliente) {
      this.navCtrl.navigateBack('/historial');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: '¿Estás seguro de que deseas cancelar esta reserva?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancelación de reserva abortada');
          }
        },
        {
          text: 'Sí',
          handler: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
              this.error = 'Token no encontrado.';
              console.error(this.error);
              return;
            }

            try {
              await this.cargarDetallesReserva(this.reservaId);
              await this.restaurarCantidadProductos(token);
              await this.reservaService.actualizarEstadoReserva(this.reservaId, '4', token).toPromise();
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'La reserva ha sido cancelada exitosamente.',
                buttons: ['OK']
              });

              await successAlert.present();
              this.navCtrl.navigateBack('/historial');
            } catch (error) {
              console.error('Error durante el proceso de cancelación:', error);
              this.error = 'Error durante el proceso de cancelación.';
            }
          }
        }
      ]
    });

    await alert.present();
  }



  async restaurarCantidadProductos(token: string) {
    try {
      console.log('Obteniendo detalles de la reserva con ID:', this.reservaId);
      const detallesReserva = this.detallesReserva;
      console.log('Detalles de reserva obtenidos:', detallesReserva);
      for (const detalle of detallesReserva) {
        const productoId = detalle.producto;
        const cantidadReservada = detalle.cantidad;
        console.log(`Procesando producto ID: ${productoId}, Cantidad reservada: ${cantidadReservada}`);
        const producto: Producto = await this.productoService.obtenerProductoPorId(productoId, token).toPromise() as Producto;
        if (producto) {
          const cantidadActual = producto.cantidad;
          console.log(`Producto ID: ${productoId}, Cantidad actual antes de restaurar: ${cantidadActual}`);
          const nuevaCantidad = cantidadActual + cantidadReservada;
          await this.productoService.incrementarStock(productoId, cantidadReservada, token).toPromise();
          const productoActualizado: Producto = await this.productoService.obtenerProductoPorId(productoId, token).toPromise() as Producto;
          if (productoActualizado) {
            const cantidadActualizada = productoActualizado.cantidad;
            console.log(`Producto ID: ${productoId}, Cantidad actualizada después de restaurar: ${cantidadActualizada}`);
          } else {
            console.error(`Error: Producto ID: ${productoId} no encontrado después de la actualización`);
          }
        } else {
          console.error(`Error: Producto ID: ${productoId} no encontrado`);
        }
      }
      console.log('Cantidad de productos restaurada correctamente.');
    } catch (error) {
      console.error('Error al restaurar la cantidad de productos:', error);
      throw error;
    }
  }

  volver() {
    this.navCtrl.navigateBack('/historial');
  }
  onActionButtonClick() {
    console.log('Botón de acción presionado');
  }
}
