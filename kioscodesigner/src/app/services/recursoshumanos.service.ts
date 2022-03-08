import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecursosHumanosService {

  mensajes: any = [];
  opciones: any = [];

  constructor(public http: HttpClient) { }

  getMensajes(empresa: string, cadena: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}rrhh/consultarmsj`;
    ////console.log(url);
    return this.http.get(url, {
      params: {
        nitempresa: empresa,
        cadena: cadena
      }
    });
  }

  crearMensaje(token: string, seudonimo: string, nit: string, fechainicio: string, fechafin: string, titulo: string,
    mensaje: string, anexoadjunto: string, cadena: string, extenciondjunto: string ) {
    let url = `${environment.urlKioskoReportes}rrhh/crearMensajeRh?seudonimo=${seudonimo}&nitempresa=${nit}&`
    + `fechainicio=${fechainicio}&fechafin=${fechafin}&titulo=${titulo}&`
    + `mensaje=${mensaje}&anexoadjunto=${anexoadjunto}&cadena=${cadena}&extenciondjunto=${extenciondjunto}`;
    //console.log('url:' + url);
    ////console.log('url recibida:'+urlKiosco)
    ////console.log('grupo recibid:'+grupoEmpr)
    return this.http.post(url, []
      /*{
      headers: new HttpHeaders({
        Authorization: token
      })
    }*/);
  }

  getAnexo(anexo: string, empresa: string, cadena: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}rrhh/obtenerAnexo?anexo=${anexo}&cadena=${cadena}&empresa=${empresa}`;
    //console.log(url);
    return this.http.get(url, { responseType: 'blob' });
  }

  clear() {
    this.mensajes = [];
  }
  
}
