import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AusentismosService {

  opciones: any = [];
  codigosAusentismos = null;

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

  getCodigosAusentismos(empresa: string, cadena: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}ausentismos/codigosDiagnosticos2`;
    console.log(url);
    return this.http.get(url, {
      params: {
        nitempresa: empresa,
        cadena
      }
    });
  }  

  getAutorizadorAusentismos(seudonimo: string, nit: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarPeriodosPendientesEmpleado?seudonimo=${seudonimo}&nitempresa=${nit}`;
    const url = `${environment.urlKioskoReportes}ausentismos/consultaNombreAutorizaAusentismos`;
    //console.log('url:' + url);
    return this.http.get(url, {
      params: {
        usuario: seudonimo,
        nitempresa: nit,
        cadena: cadena
      }
    });
  }  
  
  crearNovedadAusentismo(seudonimo: string, nit: string, estado: string, fechainicio: string, fechafin: string, dias: string,
    causa: string, clase: string, tipo: string, prorroga: string, observacion: string, anexoadjunto: string, cadena: string, urlKiosco: string, grupoEmpr: string) {
    let url = `${environment.urlKioskoReportes}ausentismos/crearNovedadAusentismo?seudonimo=${seudonimo}&nitempresa=${nit}&fechainicio=${fechainicio}&fechafin=${fechafin}&dias=${dias}`;
    url+=`&causa=${causa}&clase=${clase}&tipo=${tipo}&prorroga=${prorroga}&observacion=${observacion}&anexoadjunto=${anexoadjunto}`;
    url+=`&cadena=${cadena}&grupo=${grupoEmpr}&urlKiosco=${urlKiosco}`;
    console.log('url:' + url);
    ////console.log('url recibida:'+urlKiosco)
    ////console.log('grupo recibid:'+grupoEmpr)
    return this.http.post(url, []);
  }  

  clear() {
    this.opciones = [];
    this.codigosAusentismos = null;
  }
}
