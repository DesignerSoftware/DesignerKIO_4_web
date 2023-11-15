import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpcionesKioskosService {

  opcionesKioskos: any = [];

  opcionesKios: any = [];

  //kiovigCIR : Array<string> = [];
  kiovigCIR : any = null;

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

  getKioVigenciaCIR(empresa: string, opcionkioskoapp: string, cadena: string) {

    const url = `${environment.urlKioskoReportes}opcioneskioskosapp/kiovigenciasCIR`;
    return this.http.get(url, {
      params: {
        nit: empresa,
        opcionkioskoapp,
        cadena
      }
    });
  }

  clear() {
    this.opcionesKioskos = [];
    this.kiovigCIR  = [];
  }
}
