import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CadenaskioskosappService {

  constructor(private http: HttpClient) { }

  getCadenasKioskosEmp(grupo: string) {
    console.log('grupo recibido: ' + grupo);
    const url = `${environment.urlKioskoReportes}cadenaskioskos/${grupo}`;
    console.log(url);
    return this.http.get(url);
  }

}
