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
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/solicitudXEstado?documento=${documento}&empresa=${nit}&estado=${estado}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/solicitudXEstado`;
    console.log('url:' + url);
    return this.http.get(url, {
      params: {
        documento: documento,
        empresa: nit,
        estado: estado
      }
    });
  }

  getSolicitudesXEmpleadoJefe(documento: string, nit: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/solicitudesXEmpleadoJefe?documentoJefe=${documento}&empresa=${nit}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/solicitudesXEmpleadoJefe?documentoJefe=${documento}&empresa=${nit}&cadena=${cadena}`;
    console.log('url:' + url);
    return this.http.get(url, {
      params: {
        documentoJefe: documento,
        empresa: nit,
        cadena: cadena
      }
    });
  }

  getPeriodosvacacionesPendientes(seudonimo: string, nit: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarPeriodosPendientesEmpleado?seudonimo=${seudonimo}&nitempresa=${nit}`;
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarPeriodosPendientesEmpleado`;
    console.log('url:' + url);
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nitempresa: nit
      }
    });
  }

  getUltimoPeriodoVacacionesPendientes(seudonimo: string, nit: string, cadena: string) {
    //const url = `http://pc006:8082/wsreporte/webresources/vacacionesPendientes/consultarPeriodoMasAntiguo?documento=52384153`;
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarPeriodoMasAntiguo?seudonimo=${seudonimo}&nitempresa=${nit}`;
    console.log('url:' + url);
    return this.http.get(url);
  }

  getDiasUltimoPeriodoVacacionesPendientes(seudonimo: string, nit: string, cadena: string) {
    //const url = `http://pc006:8082/wsreporte/webresources/vacacionesPendientes/consultarPeriodoMasAntiguo?documento=52384153`;
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarDiasPendientesPerMasAntiguo?seudonimo=${seudonimo}&nitempresa=${nit}`;
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarDiasPendientesPerMasAntiguo`;
    console.log('url:' + url);
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nitempresa: nit
      }
    });
  }

  getDiasVacacionesProvisionadas(seudonimo: string, nit: string, cadena: string) {
    //const url = `http://pc006:8082/wsreporte/webresources/vacacionesPendientes/consultarPeriodoMasAntiguo?documento=52384153`;
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarDiasVacacionesProvisionados?seudonimo=${seudonimo}&nitempresa=${nit}`;
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarDiasVacacionesProvisionados`;
    console.log('url:' + url);
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nitempresa: nit,
        cadena: cadena
      }
    });
  }

  // Consultar la suma del total de días solicitados contando ENVIADOS, AUTORIZADOS, RECHAZADOS, LIQUIDADOS y CANCELADOS
  getTotalDiasSolicitados(seudonimo: string, nit: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/getDiasSoliciVacacionesXUltimoEstado?seudonimo=${seudonimo}&nitempresa=${nit}`;
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/getDiasSoliciVacacionesXUltimoEstado`;
    console.log('url:' + url);
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nitempresa: nit
      }
    });
  }
    // Consultar todas las solicitudes de los empleados relacionados al jefe
  getSoliciSinProcesarJefe(nit: string, seudonimo: string, estado: string) {
    const url = `${environment.urlKioskoReportes}empleados/soliciSinProcesarJefe/${nit}/${seudonimo}/${estado}`;
    console.log('url:' + url);
    return this.http.get(url);
  }
  

  // Consultar la suma del total de días solicitados filtrando por estados: ENVIADOS, AUTORIZADOS, RECHAZADOS, LIQUIDADOS O CANCELADOS
  getTotalDiasSolicitadosXUltimoEstado(seudonimo: string, nit: string, cadena: string, estado: string) {
      //const url = `${environment.urlKioskoReportes}vacacionesPendientes/getDiasSoliciVacacionesXUltimoEstado?seudonimo=${seudonimo}&nitempresa=${nit}&estado=${estado}`;
      const url = `${environment.urlKioskoReportes}vacacionesPendientes/getDiasSoliciVacacionesXUltimoEstado`;
      console.log('url:' + url);
      return this.http.get(url, {
        params: {
          seudonimo: seudonimo,
          nitempresa: nit,
          estado: estado
        }
      });
  }

  calculaFechasSolicitud(seudonimo: string, nit: string, fechainicio: string, dias: string) {
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/calculaFechaRegreso?seudonimo=${seudonimo}&nitempresa=${nit}&fechainicio=${fechainicio}&dias=${dias}`;
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/calculaFechaRegreso`;
    console.log('url:' + url);
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nitempresa: nit,
        fechainicio: fechainicio,
        dias: dias
      }
    });    
  }

  validaFechaInicio(seudonimo: string, nit: string, fechainicio: string) {
    const url = `${environment.urlKioskoReportes}empleados/validaFechaInicioVacaciones?seudonimo=${seudonimo}&nitempresa=${nit}&fechainicio=${fechainicio}`;
    console.log('url:' + url);
    return this.http.get(url);    
  }

  setNuevoEstadoSolicio(seudonimo: string, nit: string, cadena: string, estado: string, secuencia: string, motivo: string, urlKiosco: string, grupoEmpr: string) {
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/nuevoEstadoSolici?secuencia=${secuencia}&motivo=${motivo}&seudonimo=${seudonimo}&nitempresa=${nit}&estado=${estado}&cadena=${cadena}&grupo=${grupoEmpr}&urlKiosco=${urlKiosco}`;
    console.log('url:' + url);
    return this.http.post(url, []);
  }

  getDiasNovedadesVaca(nit: string, empleado: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/getDiasNovedadesVaca?nit=${nit}&empleado=${empleado}&cadena=${cadena}`;
    console.log('url:' + url);
    return this.http.get(url);
  }

  crearSolicitudVacaciones(seudonimo: string, nit: string, estado: string, fechainicio: string, fecharegreso: string, dias: string, vacacion: string, cadena: string, urlKiosco: string, grupoEmpr: string, fechafin: string) {
    const url = `${environment.urlKioskoReportes}vacacionesPendientes/crearSolicitudVacaciones?seudonimo=${seudonimo}&nitempresa=${nit}&fechainicio=${fechainicio}&fecharegreso=${fecharegreso}&dias=${dias}&vacacion=${vacacion}&fechafin=${fechafin}&cadena=${cadena}&grupo=${grupoEmpr}&urlKiosco=${urlKiosco}`;
    console.log('url:' + url);
    console.log('url recibida:'+urlKiosco)
    console.log('grupo recibid:'+grupoEmpr)
    return this.http.post(url, []);
  }

  clear() {
    this.opcionesKiosco = [];
    this.SolicitudesJefe =null;
  }


}
