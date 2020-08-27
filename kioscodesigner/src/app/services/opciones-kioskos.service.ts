import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpcionesKioskosService {
  opcionesKioskos: any = [];

  constructor(private http: HttpClient) { }

  getOpcionesKiosco(empresa: string) {
    const url = `${environment.urlKioskoDesigner}opcioneskioskos/${empresa}`;
    console.log(url);
    return this.http.get(url);
  }

  getPrueba(user: any): Observable<any> {
    const url = `${environment.urlKioskoDesigner}restKiosco/validarIngresoUsuarioKiosco?` +
    `usuario=8125176&clave=Prueba01*&nitEmpresa=830045567`;
    console.log(url);
    return this.http.get(`${environment.urlKioskoDesigner}restKiosco/validarIngresoUsuarioKiosco`, user);
  }

}
