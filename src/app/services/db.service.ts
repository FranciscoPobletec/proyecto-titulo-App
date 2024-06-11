import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private router: Router) { }

  
  eliminarSesion() {
    localStorage.clear();
    this.router.navigate(['.'], { replaceUrl: true });
  }
}
