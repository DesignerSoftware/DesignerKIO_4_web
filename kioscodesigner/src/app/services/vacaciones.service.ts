import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {
  opcionesKiosco: any = [];
  SolicitudesJefe=null;
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

  getPeriodosvacacionesPendientes(seudonimo: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarPeriodosPendientesEmpleado?seudonimo=${seudonimo}&nitempresa=${nit}`;
    console.log('url:' + url);
    return this.http.get(url);
  }

  getUltimoPeriodoVacacionesPendientes(seudonimo: string, nit: string, cadena: string) {
    //const url = `http://pc006:8082/wsreporte/webresources/vacacionesPendientes/consultarPeriodoMasAntiguo?documento=52384153`;
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarPeriodoMasAntiguo?seudonimo=${seudonimo}&nitempresa=${nit}`;
    console.log('url:' + url);
    return this.http.get(url);
  }

  getDiasVacacionesProvisionadas(seudonimo: string, nit: string, cadena: string) {
    //const url = `http://pc006:8082/wsreporte/webresources/vacacionesPendientes/consultarPeriodoMasAntiguo?documento=52384153`;
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarDiasVacacionesProvisionados?seudonimo=${seudonimo}&nitempresa=${nit}`;
    console.log('url:' + url);
    return this.http.get(url);
  }

  // Consultar la suma del total de días solicitados contando ENVIADOS, AUTORIZADOS, RECHAZADOS, LIQUIDADOS y CANCELADOS
  getTotalDiasSolicitados(seudonimo: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/getDiasSoliciVacacionesXUltimoEstado?seudonimo=${seudonimo}&nitempresa=${nit}`;
    console.log('url:' + url);
    return this.http.get(url);
  }
    // Consultar todas las solicitudes de los empleados relacionados al jefe
  getSoliciSinProcesarJefe(nit: string, seudonimo: string, estado: string) {
    const url = `${environment.urlKioskoReportes}empleados/soliciSinProcesarJefe/${nit}/${seudonimo}/${estado}`;
    console.log('url:' + url);
    return this.http.get(url);
  }
  

  // Consultar la suma del total de días solicitados filtrando por estados: ENVIADOS, AUTORIZADOS, RECHAZADOS, LIQUIDADOS O CANCELADOS
  getTotalDiasSolicitadosXUltimoEstado(seudonimo: string, nit: string, cadena: string, estado: string) {
      const url = `${environment.urlKioskoReportes}vacacionesPendientes/getDiasSoliciVacacionesXUltimoEstado?seudonimo=${seudonimo}&nitempresa=${nit}&estado=${estado}`;
      console.log('url:' + url);
      return this.http.get(url);
    }

  clear() {
    this.opcionesKiosco = [];
    this.SolicitudesJefe =null;
  }



}
