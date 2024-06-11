import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  ruta: string = 'hhttp://127.0.0.1:8000/api/reserva/';
  rutaDetalle: string = 'http://127.0.0.1:8000/api/detalleReserva/'; 
  constructor() { }
}
