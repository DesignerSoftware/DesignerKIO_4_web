import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AusentismosService {

  opciones: any = [];

  constructor(public http: HttpClient) { }

  getCausasEmpresa(empresa: string, cadena: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}ausentismos/causas`;
    ////console.log(url);
    return this.http.get(url, {
      params: {
        nitempresa: empresa,
        cadena
      }
    });
  }

  clear() {
    this.opciones = [];
  }
}
