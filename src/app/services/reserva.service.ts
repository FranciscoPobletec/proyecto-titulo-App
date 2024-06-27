import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private ruta: string = 'https://vecina-hay-pan.cl/api/reserva';
  private rutaDetalle: string = 'https://vecina-hay-pan.cl/api/detalleReserva/';

  constructor(private http: HttpClient) {}
  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.ruta);
  }
  getReservasUsuario(userId: string): Observable<any> {
    const url = `${this.ruta}/?cliente=${userId}`;
    return this.http.get(url);
  }

  getReservaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.ruta}/${id}/`);
  }

  getUltimaReserva(): Observable<any> {
    return this.http.get<any>(`${this.ruta}/ultima`);
  }
  getDetallesReserva(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.rutaDetalle, { headers });
  }
  getDetallesReservaById(reservaId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    const url = `${this.rutaDetalle}?reserva=${reservaId}`;
    return this.http.get<any>(url, { headers });
  }

  crearReserva(reservaInfo: any, token: string): Observable<any> {
    const url = `${this.ruta}/`;
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.post(url, reservaInfo, { headers });
  }

  getUltimoNumeroOrden(): Observable<number> {
    return this.http.get<number>(`${this.ruta}/ultimoNumeroOrden`);
  }

  createDetallesReserva(detalle: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.rutaDetalle, detalle, { headers });
  }

  actualizarEstadoReserva(id: string, estado: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.getReservaById(id).pipe(
      switchMap(reserva => {
        reserva.estado = estado;
        return this.http.put(`${this.ruta}/${id}/`, reserva, { headers });
      })
    );
  }


  
}
