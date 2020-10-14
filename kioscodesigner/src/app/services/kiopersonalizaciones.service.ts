import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KiopersonalizacionesService {

  constructor(private http: HttpClient) { }

  getDatosContacto(nit: string) {
    //const url = `${environment.urlKioskoDesigner}restKiosco/datosContactoKiosco/${nit}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/datosContactoKiosco/${nit}`;
    console.log(url);
    return this.http.get(url);
  }

}
