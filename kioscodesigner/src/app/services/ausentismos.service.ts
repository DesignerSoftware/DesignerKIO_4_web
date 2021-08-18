import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AusentismosService {

  opciones: any = [];
  codigosAusentismos = null;
  datosProrroga = null;
  SolicitudesJefe=null;


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
  getSoliciAusentSinProcesarJefe(nit: string, seudonimo: string, estado: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/soliciSinProcesarJefe/${nit}/${seudonimo}/${estado}?cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}ausentismos/soliciSinProcesarJefe`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        nit: nit,
        jefe: seudonimo,
        estado: estado,
        cadena: cadena
      }
    });
  }

  getProrroga(usuario: string, causa: string,nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}ausentismos/prorroga`;
    console.log('url:' + url);
    console.log(nit);
    console.log(cadena);
    console.log(usuario);
    console.log(causa);
    return this.http.get(url, {
      params: {
        nitempresa: nit,
        cadena: cadena,
        empleado: usuario,
        causa: causa
      }
    });
  }

  setNuevoEstadoSolicio(seudonimo: string, nit: string, cadena: string, estado: string, fechaInicio: string, secuencia: string, motivo: string, urlKiosco: string, grupoEmpr: string) {
    const url = `${environment.urlKioskoReportes}ausentismos/nuevoEstadoSolici?secuencia=${secuencia}&motivo=${motivo}&seudonimo=${seudonimo}&nitempresa=${nit}&estado=${estado}&fechainicio=${fechaInicio}&cadena=${cadena}&grupo=${grupoEmpr}&urlKiosco=${urlKiosco}`;
    //console.log('url:' + url);
    return this.http.post(url, []);

    /*return this.http.post(url, 
      params , {
        secuencia: secuencia,
        motivo: motivo,
        seudonimo: seudonimo,
        nitempresa: nit,
        estado: estado,
        fechainicio: fechaInicio,
        cadena: cadena,
        grupo: grupoEmpr,
        urlKiosco: urlKiosco,
      }
    );*/
  }

  getAnexoAusentismo(anexo: string, empresa: string, cadena: string) {
    // const url = `${environment.urlKioskoReportes}opcioneskioskos/${empresa}?seudonimo=${seudonimo}`;
    //const url = `${environment.urlKioskoReportes}opcioneskioskosapp/opcionesMenu?seudonimo=${seudonimo}&nitempresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}ausentismos/obtenerAnexo?anexo=${anexo}&cadena=${cadena}&empresa=${empresa}`;
    ////console.log(url);
    return this.http.get(url, { responseType: 'blob' });
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
  
  crearNovedadAusentismo(token: string, seudonimo: string, nit: string, estado: string, fechainicio: string, fechafin: string, dias: string,
    causa: string, secDiagnostico: string, clase: string, tipo: string, prorroga: string, observacion: string, anexoadjunto: string, cadena: string, urlKiosco: string, grupoEmpr: string) {
    let url = `${environment.urlKioskoReportes}ausentismos/crearNovedadAusentismo?seudonimo=${seudonimo}&nitempresa=${nit}&fechainicio=${fechainicio}&fechafin=${fechafin}&dias=${dias}`;
    url += `&causa=${causa}&diagnostico=${secDiagnostico}&clase=${clase}&tipo=${tipo}&prorroga=${prorroga}&observacion=${observacion}&anexoadjunto=${anexoadjunto}`;
    url += `&cadena=${cadena}&grupo=${grupoEmpr}&urlKiosco=${urlKiosco}`;
    console.log('url:' + url);
    ////console.log('url recibida:'+urlKiosco)
    ////console.log('grupo recibid:'+grupoEmpr)
    return this.http.post(url, []);
  }

  getSolicitudesXEstado(documento: string, nit: string, estado: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/solicitudXEstado?documento=${documento}&empresa=${nit}&estado=${estado}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}ausentismos/solicitudXEstado`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        documento: documento,
        empresa: nit,
        estado: estado,
        cadena: cadena
      }
    });
  }

  getFechaFinAusentismo(token: string, seudonimo: string, nit: string, fechaInicio: string, dias: string, secCausa: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/consultarPeriodosPendientesEmpleado?seudonimo=${seudonimo}&nitempresa=${nit}`;
    const url = `${environment.urlKioskoReportes}ausentismos/fechaFinAusentismo?usuario=${seudonimo}&nitempresa=${nit}&fechaInicio=${fechaInicio}&dias=${dias}&causa=${secCausa}&cadena=${cadena}`;
    //console.log('url:' + url);
    return this.http.get(url, {
      params: {
        usuario: seudonimo,
        nitempresa: nit,
        fechainicio: fechaInicio,
        dias: dias,
        causa: secCausa,
        cadena: cadena
      },
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  
  enviarCorreoNuevaNovedad(seudonimo: string, nit: string, secSoliciAusentismo: string, observacion: string, asunto: string,
    urlKiosco: string, grupo: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}ausentismos/enviaCorreoNuevoAusentismo`;
    //console.log('url:' + url);
    return this.http.get(url, {
      params: {
        usuario: seudonimo,
        nitempresa: nit,
        solicitud: secSoliciAusentismo,
        observacion,
        asunto,
        urlKiosco,
        grupo,
        cadena: cadena
      }
    });
  }

  /*Retorna las solicitudes ya procesadas por el empleado jefe*/
  getSolicitudesXEmpleadoJefe(usuario: string, nit: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/solicitudesXEmpleadoJefe?documentoJefe=${documento}&empresa=${nit}&cadena=${cadena}`;
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/solicitudesXEmpleadoJefe?documentoJefe=${documento}&empresa=${nit}&cadena=${cadena}`;
    //const url = `${environment.urlKioskoReportes}vacacionesPendientes/solicitudesXEmpleadoJefe?usuario=${usuario}&empresa=${nit}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}ausentismos/solicitudesXEmpleadoJefe`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        usuario,
        empresa: nit,
        cadena: cadena
      }
    });
  } 

  pruebaToken(token: string) {
    const url = `${environment.urlKioskoReportes}ausentismos/token`;
    /*const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');
    headers.append('producto', "prueba");*/
    //const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

    //const options = new RequestOptions({ headers: headers });
    return this.http.get(url,  {
      
      params: {
      },
      headers: new HttpHeaders({
        Authorization: token
      }),
      responseType: 'json'
    });
  }

  clear() {
    this.opciones = [];
    this.codigosAusentismos = null;
    this.datosProrroga = null;
  }
}
