import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  ruta: string = 'http://127.0.0.1:8000/api/producto/';

  constructor(private http: HttpClient) { }
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
}
