// historial.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductoService } from 'src/app/services/producto.service';
import { ReservaService } from 'src/app/services/reserva.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  reservas: any[] = [];
  usuario: any = {}; // Cambiar el tipo de usuario a cualquier objeto
  reservaIds: string[] = [];

  constructor(
    private reservaService: ReservaService,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const userFromLocalStorage = localStorage.getItem('user');
  
    if (userFromLocalStorage) {
      try {
        const parsedUser = JSON.parse(userFromLocalStorage);
        this.usuario = parsedUser; 
        console.log('Usuario desde localStorage:', parsedUser);
        
        const userId = parsedUser.id; // Obtener el ID del usuario desde localStorage
        const token = localStorage.getItem('token');
  
        if (token) {
          this.usuarioService.obtenerUsuarioAutenticado(token).then(user => {
            this.usuario = user;
            console.log('Usuario autenticado:', user);
            this.cargarReservasUsuario(token, userId); // Pasar userId en lugar de user.id
          }).catch(error => {
            console.error('Error al obtener el usuario autenticado:', error);
          });
        } else {
          console.warn('Token no encontrado en localStorage');
        }
      } catch (error) {
        console.error('Error al parsear el usuario desde localStorage:', error);
      }
    } else {
      console.error('Usuario no encontrado en localStorage');
    }
  }
  
  cargarReservasUsuario(token: string, userId: string): void {
    this.reservaService.getReservasUsuario(userId).subscribe((reservas: any[]) => {
      console.log('Reservas del usuario:', reservas);
      console.log('ID de usuario:', userId);
      
      // Filtrar las reservas por el ID del cliente correspondiente al usuario autenticado
      this.reservas = reservas.filter(reserva => reserva.cliente === userId);
      
      if (this.reservas.length === 0) {
        console.log('El usuario no ha realizado reservas.');
      } else {
        this.loadAdditionalDetails(token); 
      }
    }, error => {
      console.error('Error al obtener las reservas del usuario:', error);
    });
  }
  
  
  loadAdditionalDetails(token: string): void {
    const observables = this.reservas.map(reserva => {
        const localObservable = this.productoService.obtenerLocal(reserva.local, token);
        const clienteObservable = this.usuarioService.obtenerUsuarioPorId(reserva.cliente, token);
        return forkJoin([localObservable, clienteObservable]).pipe(
            map(([local, cliente]: [any, any]) => {
                reserva.nombreLocal = local.nombre;
                reserva.nombreCliente = cliente.username;
                reserva.estadoNombre = this.obtenerEstadoNombre(reserva.estado);
                return reserva;
            })
        );
    });
  
    forkJoin(observables).subscribe(
        (reservas: any[]) => {
            this.reservas = reservas;
            this.reservas.sort((a, b) => {
                const dateA = new Date(a.fechaInicio).getTime();
                const dateB = new Date(b.fechaInicio).getTime();
                return dateB - dateA;
            });
            this.reservaIds = this.reservas.map(reserva => reserva.id);
            console.log('IDs de reserva:', this.reservaIds); 
        },
        error => {
            console.error('Error al cargar los detalles adicionales:', error);
        }
    );
  }
  
  calcularFechaTermino(fechaInicio: string): string {
    const fecha = new Date(fechaInicio);
    fecha.setHours(fecha.getHours() + 4); 
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
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
  
  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }


  
  volver() {
    this.navCtrl.navigateBack('/principal');
  }
}
