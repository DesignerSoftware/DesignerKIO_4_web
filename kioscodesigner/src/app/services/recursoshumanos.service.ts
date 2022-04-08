import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecursosHumanosService {

  mensajes: any = [];
  opciones: any = [];
  urlMsj = null;

  constructor(public http: HttpClient) { }

  getMensajes(empresa: string, cadena: string , estado: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    
    if (estado == 'S') {
      this.urlMsj = `${environment.urlKioskoReportes}rrhh/consultarmsjActivos`; 
    } else {
      this.urlMsj = `${environment.urlKioskoReportes}rrhh/consultarmsj`; 
    }
     
    ////console.log(url);
    return this.http.get(this.urlMsj, {
      params: {
        nitempresa: empresa,
        cadena: cadena
      }
    });
  }

  crearMensaje(token: string, seudonimo: string, nit: string, fechainicio: string, fechafin: string, titulo: string,
    mensaje: string, anexoadjunto: string, cadena: string, extenciondjunto: string, correo: string, urlkiosko: string ) {
    let url = `${environment.urlKioskoReportes}rrhh/crearMensajeRh`;
    /*?seudonimo=${seudonimo}&nitempresa=${nit}&`
    + `fechainicio=${fechainicio}&fechafin=${fechafin}&titulo=${titulo}&`
    + `mensaje=${mensaje}&anexoadjunto=${anexoadjunto}&cadena=${cadena}&extenciondjunto=${extenciondjunto}`
    + `&correo=${correo}`;*/
    //console.log('url:' + url);
    ////console.log('url recibida:'+urlKiosco)
    ////console.log('grupo recibid:'+grupoEmpr)
    return this.http.post(url, "", {
      params: {
        seudonimo: seudonimo,
        nitempresa: nit,
        fechainicio: fechainicio,
        fechafin: fechafin,
        titulo: titulo,
        mensaje: mensaje,
        anexoadjunto: anexoadjunto,
        cadena: cadena,
        extenciondjunto: extenciondjunto,
        correo: correo,
        url: urlkiosko
      }
    }
      /*{
      headers: new HttpHeaders({
        Authorization: token
      })
    }*/);
  }

  updateMensaje(token: string, seudonimo: string, nit: string, fechainicio: string, fechafin: string, titulo: string,
    mensaje: string, anexoadjunto: string, cadena: string, extenciondjunto: string, secuenciaMensaje: string, estado: string ) {
    let url = `${environment.urlKioskoReportes}rrhh/updateMensajeRh?seudonimo=${seudonimo}&secuenciamsj=${secuenciaMensaje}&nitempresa=${nit}&`
    + `fechainicio=${fechainicio}&fechafin=${fechafin}&titulo=${titulo}&`
    + `mensaje=${mensaje}&anexoadjunto=${anexoadjunto}&cadena=${cadena}&extenciondjunto=${extenciondjunto}`
    + `&estado=${estado}`;
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

  deleteMsj(token: string, seudonimo: string, secuenciaMensaje: string, nit: string, cadena: string) {
    let url = `${environment.urlKioskoReportes}rrhh/deleteMensajeRh?seudonimo=${seudonimo}&secuenciamsj=${secuenciaMensaje}&nitempresa=${nit}&`
    + `cadena=${cadena}`;
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

  getResendEmail(token: string, seudonimo: string, nit: string, titulo: string,
    mensaje: string, cadena: string, urlkiosko: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}rrhh/reenviarcorreo`;
    //console.log(url);
    return this.http.get(url, { 
      params: {
        seudonimo: seudonimo,
        nitempresa: nit,
        titulo: titulo,
        mensaje: mensaje,
        cadena: cadena,
        url: urlkiosko
      }
    });
  }

  clear() {
    this.mensajes = [];
  }
  
}
