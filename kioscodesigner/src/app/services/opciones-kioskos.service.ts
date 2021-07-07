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

  getOpcionesKiosco(empresa: string, seudonimo: string, cadena: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opciones?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opciones`;
    //console.log(url);
    return this.http.get(url, {
      params: {
        seudonimo,
        nitempresa: empresa,
        cadena: cadena
      }
    });
  }

  getMenuOpcionesKiosco(empresa: string, seudonimo: string, cadena: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu`;
    ////console.log(url);
    return this.http.get(url, {
      params: {
        seudonimo,
        nitempresa: empresa,
        cadena
      }
    });
  }

  clear() {
    this.opcionesKioskos = [];
  }

}
