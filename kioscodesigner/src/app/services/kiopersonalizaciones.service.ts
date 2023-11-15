import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KiopersonalizacionesService {

  constructor(private http: HttpClient) { }

  getDatosContacto(nit: string, cadena: string) {
    //const url = `${environment.urlKioskoDesigner}restKiosco/datosContactoKiosco/${nit}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/datosContactoKiosco/${nit}?cadena=${cadena}`;
    //console.log(url);
    return this.http.get(url);
  }
}
