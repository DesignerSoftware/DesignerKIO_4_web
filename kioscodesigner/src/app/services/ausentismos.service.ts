import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AusentismosService {
  opciones: any = [];
  codigosAusentismos: any = null;
  datosProrroga: any = null;
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

  getSoliciAusentSinProcesarAutorizador(nit: string, seudonimo: string, estado: string, cadena: string) {
    
    const url = `${environment.urlKioskoReportes}ausentismos/soliciSinProcesarAutorizador`;
    
    return this.http.get(url, {
      params: {
        nit: nit,
        jefe: seudonimo,
        estado: estado,
        cadena: cadena
      }
    });
  }

  getProrroga(usuario: string, causa: string, fechainicio: string, nit:string, cadena: string) {
    const url = `${environment.urlKioskoReportes}ausentismos/prorroga`;
    console.log('url:' + url);
    // console.log(nit);
    // console.log(cadena);
    // console.log(usuario);
    // console.log(causa);
    console.log(fechainicio)
    return this.http.get(url, {
      params: {
        nitempresa: nit,
        cadena: cadena,
        empleado: usuario,
        causa: causa,
        fechainicio: fechainicio  
      }
    });
  }
  getvalidaFechaNovedadEmpleadoXJefe(nit: string, seudonimo: string, fecha: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}ausentismos/validaFechaNovedadEmpleadoXJefe`;
    return this.http.get(url, {
      params: {
        nitempresa: nit,
        cadena: cadena,
        fechainicio: fecha,
        usuario: seudonimo,
      }
    });
  }

  getValidaTraslapamientoSoliciAusen(nit: string, seudonimo: string, fechaIni: string, fechaFin: string, refSolici: number, cadena: string){
    const url = `${environment.urlKioskoReportes}ausentismos/validaTraslapamientoSoliciAusen`;
    return this.http.get(url, {
      params: {
        nitempresa: nit,
        cadena: cadena,
        fechainicio: fechaIni,
        fechafin: fechaFin,
        refsolicitud: refSolici,
        usuario: seudonimo,
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
    causa: string, secDiagnostico: string, clase: string, tipo: string, prorroga: string, observacion: string, anexoadjunto: string, 
    cadena: string, urlKiosco: string, grupoEmpr: string, codCausa: string) {
    let url = `${environment.urlKioskoReportes}ausentismos/crearNovedadAusentismo?seudonimo=${seudonimo}&nitempresa=${nit}&fechainicio=${fechainicio}&fechafin=${fechafin}&dias=${dias}` +
    `&causa=${causa}&diagnostico=${secDiagnostico}&clase=${clase}&tipo=${tipo}&prorroga=${prorroga}&observacion=${observacion}&anexoadjunto=${anexoadjunto}`
    + `&codigoCausa=${codCausa}&cadena=${cadena}&grupo=${grupoEmpr}&urlKiosco=${urlKiosco}`;
    console.log('url:' + url);
    ////console.log('url recibida:'+urlKiosco)
    ////console.log('grupo recibid:'+grupoEmpr)
    return this.http.post(url, []
      /*{
      headers: new HttpHeaders({
        Authorization: token
      })
    }*/);
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
    const url = `${environment.urlKioskoReportes}ausentismos/enviaCorreoNuevoAusentismo?usuario=${seudonimo}&nitempresa=${nit}&solicitud=${secSoliciAusentismo}&observacion=${observacion}&asunto=${asunto}&grupo=${grupo}&cadena=${cadena}&urlKiosco=${urlKiosco}`;

    //console.log('url:' + url);
    /*return this.http.get(url, {
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
    });*/
    return this.http.get(url);
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

/*Retorna las solicitudes ya procesadas por el autorizador*/
getSolicitudesPorAutorizador(usuario: string, nit: string, cadena: string) {
  const url = `${environment.urlKioskoReportes}ausentismos/solicitudesPorAutorizador`;
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
  
  validaFechaInicioAusent(seudonimo: string, nit: string, fechainicio: string, cadena: string) {
    //const url = `${environment.urlKioskoReportes}empleados/validaFechaInicioVacaciones?seudonimo=${seudonimo}&nitempresa=${nit}&fechainicio=${fechainicio}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}empleados/validaFechaInicioAusentismo`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nitempresa: nit,
        fechainicio: fechainicio,
        cadena: cadena
      }
    });    
  }
}
