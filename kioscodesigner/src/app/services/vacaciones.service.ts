import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {
  opcionesKiosco: any = [];
  constructor(private http: HttpClient) { }

  getSolicitudesXEstado(documento: string, nit: string, estado: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/solicitudXEstado?documento=${documento}&empresa=${nit}&estado=${estado}`;
    console.log('url:' + url);
    return this.http.get(url);
  }

  getSolicitudesXEmpleadoJefe(documento: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/solicitudesXEmpleadoJefe?documentoJefe=${documento}&empresa=${nit}&cadena=${cadena}`;
    console.log('url:' + url);
    return this.http.get(url);
  }



}
