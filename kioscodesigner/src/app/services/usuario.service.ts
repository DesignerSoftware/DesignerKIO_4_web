import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DatosIngreso } from '../components/modelo/datos-ingreso';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public isUserLoggedIn = false;
  public usserLogged: string = '';
  secuenciaEmpleado: number = 0;
  nombrePersona: string = 'Bienvenido';
  nombreApellidoPersona: string = 'Bienvenido';
  datos: any = null;
  usuario: string = '';
  empresa: string = '';
  tokenJWT: string = '';
  urlLogoEmpresa: string = '';
  urlLogoEmpresaDarkXl: string = '';
  urlLogoEmpresaMin: string = '';
  grupoEmpresarial: string = '';
  documento: any = null;
  cadenaConexion: string = '';
  datosFamilia: any = null;
  datosPersonales: any = null;
  telefonosEmpleado: Array<string> = [];
  datosContacto: any = null;
  correo: string = '';
  nombreContactoSoporte: string = '';
  correoContactoSoporte: string = '';
  datosEstudios: any = null;
  datosEstudiosNF: any = null;
  datosExperienciaLab: any = null;
  urlActiva: string = '';
  tipoUsuario: any = null;
  documentosAnexos: any = null;
  existeDocumentoAnexo: Array<string> = [];
  documentoSeleccionado: any = null;
  //carnetSeleccionado: Array<string> = [];
  carnetSeleccionado: any = [];
  listProverbios: any = null;
  existefotoPerfil: any = null;
  notificacionesVacaciones: number = 0;
  notificacionesAusentismo: number = 0;
  notificacionesRh: number = 0;
  provisiones: Array<string> = [];

  urlKioscoDomain: string = '';
  public url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/sinFoto.jpg?usuario=${this.usuario}&empresa=${this.empresa}&cadena=${this.cadenaConexion}`;

  constructor(private http: HttpClient) {
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn(usuario: string) {
    this.isUserLoggedIn = true;
    this.usserLogged = usuario;
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  getUserLoggedIn() {
    console.log('currentUser');
    var currentUser: any = localStorage.getItem('currentUser');
    console.log('currentUser: ' + currentUser);
    var jCurrentUser: any;
    if (currentUser !== null) {
      jCurrentUser = JSON.parse(localStorage.getItem('currentUser') || '');
    }
    console.log('jCurrentUser: ' + jCurrentUser);
    return jCurrentUser;
  }

  setUsuario(usuario: string) {
    this.usuario = usuario;
  }

  setEmpresa(nitEmpresa: string) {
    this.empresa = nitEmpresa;
  }

  setTokenJWT(token: string) {
    this.tokenJWT = token;
  }

  setGrupo(grupo: string) {
    this.grupoEmpresarial = grupo;
  }

  setUrlKiosco(url: string) {
    this.urlKioscoDomain = url;
  }

  getUrl() {
    return environment.urlKiosko;
  }

  getUrlws() {
    return environment.urlKioskoReportes;
  }

  getDatosUsuario(usuario: string, nit: string, cadena: string) {
    const obj: any = this.getUserLoggedIn;
    const url = `${environment.urlKioskoReportes}empleados/datosEmpleadoNit/${usuario}/${nit}`;
    return this.http.get(url, {
      params: {
        cadena
      }
    });
  }

  getDatosUsuarioFamilia(usuario: string, nit: string, cadena: string) {
    const obj: any = this.getUserLoggedIn;
    const url = `${environment.urlKioskoReportes}empleados/datosFamiliaEmpleado/${usuario}/${nit}`;
    return this.http.get(url, {
      params: {
        cadena
      }
    });
  }

  getDatosExpLabEmpleado(usuario: string, nit: string, cadena: string) {
    const obj: any = this.getUserLoggedIn;
    const url = `${environment.urlKioskoReportes}empleados/datosExperienciaLab`;
    return this.http.get(url, {
      params: {
        empleado: usuario,
        nit: nit,
        cadena: cadena
      }
    });
  }

  getDatosUsuarioCadena(usuario: string, nit: string, cadena: string) {
    const obj: any = this.getUserLoggedIn;
    const url = `${environment.urlKioskoReportes}empleados/datosEmpleadoNit/${usuario}/${nit}`;
    return this.http.get(url, {
      params: {
        cadena: cadena
      }
    });
  }

  getTelefonosEmpleado(usuario: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}empleados/telefonosEmpleadoNit`;
    return this.http.get(url, {
      params: {
        usuario: usuario,
        nit: nit,
        cadena: cadena
      }
    });
  }

  isAutenticado(): boolean {
    if (this.getUserLoggedIn() != null) {
      return true;
    }
    return false;
  }

  actualizaParametrosReportes(codigoEmp: string, nitEmpresa: string, fechadesde: string, fechahasta: string, enviocorreo: boolean, dirigidoa: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/updateFechas` +
      `?usuario=${codigoEmp}&nitEmpresa=${nitEmpresa}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&enviocorreo=${enviocorreo}&dirigidoa=${dirigidoa}&cadena=${cadena}`;
    return this.http.post(url, {});
  }

  validarIngresoKioscoSeudonimo(seudonimo: string, password: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/validarIngresoSeudonimoKiosco`;
    return this.http.get<DatosIngreso>(url,
      {
        params: {
          usuario: seudonimo,
          clave: password,
          nitEmpresa: nit,
          cadena: cadena
        }
      }).pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  //Extraido del manual de Angular.
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  validarSeudonimoClaveNit(seudonimo: string, clave: string, nitEmpresa: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarUsuarioSeudonimoRegistrado`;
    return this.http.get(url, {
      params: {
        usuario: seudonimo,
        clave: clave,
        nitEmpresa: nitEmpresa,
        cadena: cadena
      }
    });
  }

  generarTokenLogin(usuario: string, clave: string, empresa: string, cadena: string, grupo: string) { // recibe seudonimo, clave y nit de empresa
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/jwt`;
    return this.http.get(url, {
      params: {
        usuario,
        clave,
        nit: empresa,
        cadena,
        grupo
      }
    });
  }

  getParametros(usuario: string, empresa: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/parametros`;
    return this.http.get(url,
      {
        params: {
          usuario: usuario,
          nitEmpresa: empresa,
          cadena: cadena
        }
      });
  }

  consultarCorreoConexioneskioskos(usuario: string, empresa: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/correoconexioneskioskos/${usuario}/${empresa}?cadena=${cadena}`;
    return this.http.get(url);
  }

  // actualizar clave conexioneskioskos:
  actualizaClave(usuario: string, nit: string, clave: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/updateClave?usuario=${usuario}&nitEmpresa=${nit}&clave=${clave}&cadena=${cadena}`;
    return this.http.post(url, {});
  }

  generaClaveAleatoria(usuario: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/generarClave`;
    return this.http.get(url,
      {
        params: {
          usuario: usuario,
          nit: nit,
          cadena: cadena
        }
      });
  }

  validaToken(jwt: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarJWTActivarCuenta?jwt=${jwt}&cadena=${cadena}`;
    console.log(url);
    return this.http.get(url);
  }

  cambiaEstadoUsuario(seudonimo: string, nitEmpresa: string, activo: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/cambioEstadoUsuario?seudonimo=${seudonimo}&nitEmpresa=${nitEmpresa}&activo=${activo}&cadena=${cadena}`;
    return this.http.post(url, {});
  }

  // valida si esta registrado en conexioneskioskos por empleado y nitempresa, corregir para que sea por persona
  validaUsuarioYNitEmpresaRegistrado(usuario: string, nitEmpresa: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarUsuarioRegistrado/${usuario}/${nitEmpresa}`;
    return this.http.get(url, {
      params: {
        cadena
      }
    });
  }

  // requiere el seudonimo y el nit de la empresa para retornar el documento asociado
  getDocumentoSeudonimo(seudonimo: string, nit: string, cadena: string) { 
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/documentoconexioneskioskos`;
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nit: nit,
        cadena: cadena
      }
    });
  }

  getLogoEmpresa(nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/logoEmpresa/${nit}`;
    return this.http.get(url, {
      params: {
        cadena
      }
    });
  }

  // recibe token y cambia estado a N
  inactivaToken(jwt: string, nit: string, cadena: string) { 
    const url = `${environment.urlKioskoReportes}conexioneskioskos/inactivaToken?nit=${nit}&cadena=${cadena}&jwt=${jwt}`;
    return this.http.post(url, {});
  }

  // inactivo todos los tokens de un mismo tipo
  inactivaTokensTipo(tipo: string, usuario: string, nitEmpresa: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/inactivaTokensTipo?tipo=${tipo}&seudonimo=${usuario}&nit=${nitEmpresa}&cadena=${cadena}`;
    return this.http.post(url, {});
  }

  enviaCorreoNovedadRRHH(seudonimo: string, nit: string, novedad: string, asunto: string, urlKiosco: string, grupo: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}empleados/enviaReporteInfoRRHH`;
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nitempresa: nit,
        observacion: novedad,
        asunto,
        grupo: grupo,
        urlKiosco: urlKiosco,
        cadena: cadena
      }
    });
  }

  getEducacionesNoFormales(usuario: string, cadena: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoReportes}empleados/educacionesNoFormales`;
    return this.http.get(url, {
      params: {
        usuario,
        cadena,
        empresa: nitEmpresa
      }
    });
  }

  getEducacionesFormales(usuario: string, cadena: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoReportes}empleados/educacionesFormales`;
    return this.http.get(url, {
      params: {
        usuario,
        cadena,
        empresa: nitEmpresa
      }
    });
  }
  getObtenerAnexosDocumentos(usuario: string, cadena: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoReportes}empleados/obtenerAnexosDocumentos`;
    return this.http.get(url, {
      params: {
        empleado: usuario,
        cadena: cadena,
        empresa: nitEmpresa
      }
    });
  }
  getDescargarArchivo(usuario: string, cadena: string, nitEmpresa: string, anexo: string) {
    const url = `${environment.urlKioskoReportes}empleados/decargarAnexo?usuario=${usuario}&cadena=${cadena}&empresa=${nitEmpresa}&anexo=${anexo}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  getGenerarQR(seudonimo: string, celular: string, correo: string, cargo: string, empresa: string, cadena: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoReportes}empleados/generaQR`;
    return this.http.get(url, {
      params: {
        documento: seudonimo,
        celular: celular,
        correo: correo,
        cargo: cargo,
        nomEmpresa: empresa,
        cadena: cadena,
        nit: nitEmpresa
      }
    });
  }
  getValidaFoto(usuario: string, cadena: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoReportes}empleados/existeFoto`;
    return this.http.get(url, {
      params: {
        usuario: usuario,
        nit: nitEmpresa,
        cadena: cadena
      }
    });
  }
  /*para eliminar la foto del usuario*/
  getEliminarFoto(seudonimo: string, cadena: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoReportes}empleados/eliminarFoto`;
    return this.http.get(url, {
      params: {
        documento: seudonimo,
        cadena: cadena,
        nit: nitEmpresa
      }
    });
  }

  loadAllNotifications() {
    var dato = null;
    this.getNotifiaciones(this.usuario, 'VACACION', this.cadenaConexion, this.empresa)
      .subscribe(
        data => {
          if (Array.isArray(data)) {
            this.notificacionesVacaciones = data[0];
          }
        });

    this.getNotifiaciones(this.usuario, 'AUSENTISMO', this.cadenaConexion, this.empresa)
      .subscribe(
        data => {
          if (Array.isArray(data)) {
            this.notificacionesAusentismo = data[0];
          }
        });

    this.getNotifiaciones(this.usuario, 'RRHH', this.cadenaConexion, this.empresa)
      .subscribe(
        data => {
          if (Array.isArray(data)) {
            this.notificacionesRh = data[0];
          }
        });
  }

  getNotifiaciones(seudonimo: string, tipoNoti: string, cadena: string, nit: string) {
    const url = `${environment.urlKioskoReportes}empleados/getNotificaciones`;
    return this.http.get(url, {
      params: {
        usuario: seudonimo,
        tipoNotificacion: tipoNoti,
        empresa: nit,
        cadena: cadena
      }
    });
  }

  getProverbios(cadena: string, nit: string) {
    const url = `${environment.urlKioskoReportes}empleados/proverbios`;
    return this.http.get(url, {
      params: {
        nit: nit,
        cadena: cadena
      }
    });
  }

  getUltimosPagos(seudonimo: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}empleados/ultimospagos`;
    return this.http.get(url, {
      params: {
        seudonimo: seudonimo,
        nit: nit,
        cadena: cadena
      }
    });
  }

  getProvisiones(seudonimo: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}empleados/provisiones`;
    return this.http.get(url, {
      params: {
        cadena: cadena,
        seudonimo: seudonimo,
        nit: nit
      }
    });
  }

  getFotoPerfil(seudonimo: string, nit: string, cadena: string) {

    const url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFotoPerfil`;
    return this.http.get(url, {
      params: {
        cadena: cadena,
        usuario: seudonimo,
        nit: nit
      }
    });
  }

  clear() {
    this.isUserLoggedIn = false;
    this.usserLogged = '';
    this.secuenciaEmpleado = 0;
    this.nombrePersona = 'Bienvenido';
    this.nombreApellidoPersona = 'Bienvenido';
    this.datos = null;
    this.usuario = '';
    this.empresa = '';
    this.tokenJWT = '';
    this.urlLogoEmpresa = '';
    this.urlLogoEmpresaDarkXl = '';
    this.urlLogoEmpresaMin = '';
    this.grupoEmpresarial = '';
    this.documento = null;
    this.datosPersonales = null;
    this.datosFamilia = null;
    this.telefonosEmpleado = [];
    this.urlKioscoDomain = '';
    this.datosContacto = null;
    this.correo = '';
    this.nombreContactoSoporte = '';
    this.correoContactoSoporte = '';
    this.datosEstudios = null;
    this.datosEstudiosNF = null;
    this.datosExperienciaLab = null;
    this.urlActiva = '';
    this.tipoUsuario = null;
    this.documentosAnexos = null;
    this.documentoSeleccionado = null;
    this.carnetSeleccionado = [];
    this.existefotoPerfil = null;
    this.notificacionesVacaciones = 0;
    this.notificacionesAusentismo = 0;
    this.notificacionesRh = 0;
    this.existeDocumentoAnexo = [];
    this.listProverbios = null;
    this.provisiones = [];
  }
}
