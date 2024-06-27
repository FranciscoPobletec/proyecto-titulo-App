import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  ruta: string = 'https://vecina-hay-pan.cl/api/producto/';
  rutaLocal: string = 'https://vecina-hay-pan.cl/api/local/';

  constructor(private http: HttpClient) { }

  incrementarStock(productId: number, cantidad: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    const url = `${this.ruta}${productId}/`;

    return this.http.get(url, { headers }).pipe(
      switchMap((producto: any) => {
        const nuevaCantidad = producto.cantidad + cantidad;
        return this.http.patch(url, { cantidad: nuevaCantidad }, { headers });
      })
    );
  }
  
  decrementarStock(productId: number, cantidadSeleccionada: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    const url = `${this.ruta}${productId}/`;

    return this.http.get(url, { headers }).pipe(
      switchMap((producto: any) => {
        // Verificar si hay suficiente stock para restar la cantidad seleccionada
        if (cantidadSeleccionada > producto.cantidad) {
          throw new Error(`No hay suficiente stock para restar ${cantidadSeleccionada} unidades.`);
        }

        const nuevaCantidad = producto.cantidad - cantidadSeleccionada;

        // Actualizar la cantidad en el backend
        return this.http.patch(url, { cantidad: nuevaCantidad }, { headers });
      })
    );
  }



  getStockOptions(stock: number): number[] {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }

  obtenerProductos(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get(this.ruta, { headers });
  }

  obtenerProductoPorId(id: number, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get(`${this.ruta}${id}/`, { headers });
  }

  obtenerProductosPorLocal(localId: number, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    const url = `${this.rutaLocal}${localId}/productos/`;
    return this.http.get(url, { headers });
  }

  obtenerLocal(localId: number, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get(`${this.rutaLocal}${localId}/`, { headers });
  }
}
