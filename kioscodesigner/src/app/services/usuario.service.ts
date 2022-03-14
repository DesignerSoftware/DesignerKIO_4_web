import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public isUserLoggedIn=false;
  public usserLogged;
  secuenciaEmpleado = null;
  nombrePersona = 'Bienvenido';
  nombreApellidoPersona ='Bienvenido';
  datos;
  usuario=null;
  empresa=null;
  tokenJWT;
  urlLogoEmpresa;
  urlLogoEmpresaDarkXl;
  urlLogoEmpresaMin;
  grupoEmpresarial=null;
  documento=null;
  //cadenaConexion='wsreportePU';
  cadenaConexion=null;
  datosFamilia = null;
  datosPersonales = null;
  telefonosEmpleado = null;
  datosContacto = null;
  correo = null;
  nombreContactoSoporte = '';
  correoContactoSoporte = '';
  datosEstudios = null;
  datosEstudiosNF = null;
  datosExperienciaLab = null;
  urlActiva = null;
  tipoUsuario = null;
  documentosAnexos = null;
  existeDocumentoAnexo : Array<string> = [];
  documentoSeleccionado = null;
  carnetSeleccionado : Array<string> = [];
  listProverbios : Array<string> = [];
  existefotoPerfil = null; 
  notificacionesVacaciones:number  = 0;
  notificacionesAusentismo: number= 0;
  notificacionesRh: number = 0;

  urlKioscoDomain = "https://www.designer.com.co:8179";
  //public url = 'http://www.nominadesigner.co:8080/wsreporte/webresources/conexioneskioskos/obtenerFoto/sinFoto.jpg';
  //public url = `https://www.designer.com.co:8178/wsreporte/webresources/conexioneskioskos/obtenerFoto/sinFoto.jpg?cadena=${this.cadenaConexion}`;
  public url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/sinFoto.jpg?usuario=${this.usuario}&empresa=${this.empresa}&cadena=${this.cadenaConexion}`;
   
  constructor(private http: HttpClient) {
    this.isUserLoggedIn =  false;
  }

  setUserLoggedIn(usuario: string) {
    this.isUserLoggedIn = true;
    this.usserLogged = usuario;
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  getUserLoggedIn() {
    const obj: any = JSON.parse(localStorage.getItem('currentUser')) ;
    //console.log('getUserLoggedIn()', obj);
    return JSON.parse(localStorage.getItem('currentUser'));
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

  setGrupo(grupo: string){
    this.grupoEmpresarial=grupo;
  }

  setUrlKiosco(url: string){
    this.urlKioscoDomain=url;
  }

  getUrl(){
    return environment.urlKiosko;
  }

  getUrlws(){
    return environment.urlKioskoReportes;
  }

  getDatosUsuario(usuario: string, nit: string, cadena: string) {
    const obj: any = this.getUserLoggedIn;
    // const url = 'http://localhost:8080/wsjavanov5/jcmouse/restapi/restKiosco/getDatosEmpleadoNit/' + usuario + '/' + nit;
    //const url = `${environment.urlKioskoReportes}empleados/datosEmpleadoNit/${usuario}/${nit}?cadena=${cadena}`;
    //const url = `${environment.urlKioskoReportes}empleados/datosEmpleadoNit/${usuario}/${nit}?cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}empleados/datosEmpleadoNit/${usuario}/${nit}`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        cadena
      }
    });
  }

  getDatosUsuarioFamilia(usuario: string, nit: string, cadena: string) {
    const obj: any = this.getUserLoggedIn;
    // const url = 'http://localhost:8080/wsjavanov5/jcmouse/restapi/restKiosco/getDatosFamiliaEmpleado/' + usuario + '/' + nit;
    //const url = `${environment.urlKioskoReportes}empleados/datosFamiliaEmpleado/${usuario}/${nit}?cadena=${cadena}`;
    //const url = `${environment.urlKioskoReportes}empleados/datosFamiliaEmpleado/${usuario}/${nit}?cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}empleados/datosFamiliaEmpleado/${usuario}/${nit}`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        cadena
      }
    });
  }

  getDatosExpLabEmpleado(usuario: string, nit: string, cadena: string) {
    const obj: any = this.getUserLoggedIn;
    //const url = `${environment.urlKioskoReportes}empleados/datosExperienciaLab/?empleado=${usuario}&nit=${nit}&cadena=${cadena}`;
    //const url = `${environment.urlKioskoReportes}empleados/datosExperienciaLab/?empleado=${usuario}&nit=${nit}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}empleados/datosExperienciaLab`;
    ////console.log('url:' + url);
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
    // const url = 'http://localhost:8080/wsjavanov5/jcmouse/restapi/restKiosco/getDatosEmpleadoNit/' + usuario + '/' + nit;
    //const url = `${environment.urlKioskoReportes}empleados/datosEmpleadoNit/${usuario}/${nit}?cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}empleados/datosEmpleadoNit/${usuario}/${nit}`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        cadena: cadena
      }
    });
  }

  getTelefonosEmpleado(usuario: string, nit: string, cadena: string){
    //const url = `${environment.urlKioskoReportes}empleados/telefonosEmpleadoNit?usuario=${usuario}&nit=${nit}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}empleados/telefonosEmpleadoNit`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        usuario: usuario,
        nit: nit,
        cadena: cadena
      }
    });    
  }  

  isAutenticado() {
    if (this.getUserLoggedIn () != null) {
      //console.log('estoy autenticado');
      return true;
    }
  }

  /*getSecuenciaEmpl(codEmpleado: string) {
    //const url = `${environment.urlKioskoDesigner}empleados/` + codEmpleado;
    // const url = `${environment.urlKioskoDesigner}empleados/` + codEmpleado;
    const url = `${environment.urlKioskoReportes}empleados/${codEmpleado}`;
    //console.log(url);
    return this.http.get(url);
  }*/

  actualizaParametrosReportes(codigoEmp: string, nitEmpresa: string, fechadesde: Date, fechahasta: Date, enviocorreo: boolean, dirigidoa: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/updateFechas` +
    `?usuario=${codigoEmp}&nitEmpresa=${nitEmpresa}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&enviocorreo=${enviocorreo}&dirigidoa=${dirigidoa}&cadena=${cadena}`;
    //console.log(url);
    return this.http.post(url, {});
  }

  validarIngresoKioscoSeudonimo(seudonimo: string, password: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/validarIngresoSeudonimoKiosco`;
    //console.log(url);
    /*//console.log(
      `${environment.urlKioskoReportes}conexioneskioskos/validarIngresoSeudonimoKiosco?usuario=${seudonimo}&clave=${password}&nitEmpresa=${nit}`);*/
    return this.http.get(url,
    {params: {
      usuario: seudonimo,
      clave: password,
      nitEmpresa: nit,
      cadena: cadena
    }});
  }

  validarSeudonimoClaveNit(seudonimo: string, clave: string, nitEmpresa: string, cadena: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioSeudonimoRegistrado?usuario=${seudonimo}&clave=${clave}&nitEmpresa=${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarUsuarioSeudonimoRegistrado`;
    //console.log(url);
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
    // const url =`${environment.urlKioskoDesigner}restKiosco/jwt/${usuario}/${clave}/${empresa}`;
    // const url =`${environment.urlKioskoReportes}conexioneskioskos/restKiosco/jwt/${usuario}/${clave}/${empresa}`;
    const url =`${environment.urlKioskoReportes}conexioneskioskos/restKiosco/jwt`;
    //console.log(url);
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
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/parametros?usuario=${usuario}&nitEmpresa=${empresa}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/parametros`;
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/parametros`;
    ////console.log(url);
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
    // const url = `${environment.urlKioskoDesigner}restKiosco/correoconexioneskioskos/${usuario}/${empresa}`;
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/correoconexioneskioskos/${usuario}/${empresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/correoconexioneskioskos/${usuario}/${empresa}?cadena=${cadena}`;
    //console.log(url);
    return this.http.get(url);
  }

  // actualizar clave conexioneskioskos:
  actualizaClave(usuario: string, nit: string, clave: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/updateClave?usuario=${usuario}&nitEmpresa=${nit}&clave=${clave}&cadena=${cadena}`;
    //console.log(url);
    return this.http.post(url, {});
  }

  generaClaveAleatoria(usuario: string, nit: string, cadena: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/generarClave?usuario=${usuario}&nit=${nit}`;
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/generarClave?usuario=${usuario}&nit=${nit}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/generarClave`;
    //console.log(url);
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
    //const url = `${environment.urlKioskoDesigner}restKiosco/validarJWTActivarCuenta?jwt=${jwt}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarJWTActivarCuenta?jwt=${jwt}&cadena=${cadena}`;
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarJWTActivarCuenta`;
    console.log(url);
    return this.http.get(url/*,
      {
        params: {
          jwt: jwt, cadena: cadena
        }
      }*/);
  }

  cambiaEstadoUsuario(seudonimo: string, nitEmpresa: string, activo: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/cambioEstadoUsuario?seudonimo=${seudonimo}&nitEmpresa=${nitEmpresa}&activo=${activo}&cadena=${cadena}`;
    ////console.log(url);
    return this.http.post(url, {});
  }

  // valida si esta registrado en conexioneskioskos por empleado y nitempresa, corregir para que sea por persona
  validaUsuarioYNitEmpresaRegistrado(usuario: string, nitEmpresa: string, cadena: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioRegistrado/${usuario}/${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarUsuarioRegistrado/${usuario}/${nitEmpresa}`;
    ////console.log(url);
    return this.http.get(url, {
      params: {
        cadena
      }
    });
  }

  /*getEmpresas() {
    const url = `${environment.urlKioskoReportes}restKiosco/empresas`;
    //console.log(url);
    return this.http.get(url);
  }*/

  getDocumentoSeudonimo(seudonimo: string, nit: string, cadena: string) { // requiere el seudonimo y el nit de la empresa para retornar el documento asociado
    // const url = `${environment.urlKioskoDesigner}restKiosco/documentoconexioneskioskos?seudonimo=${seudonimo}&nit=${nit}`;
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/documentoconexioneskioskos?seudonimo=${seudonimo}&nit=${nit}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/documentoconexioneskioskos`;
    //console.log(url);
    return this.http.get(url, {
        params: {
          seudonimo: seudonimo,
          nit: nit,
          cadena: cadena
        }
      });
  }

  getLogoEmpresa(nit: string, cadena: string) { 
    // const url = `${environment.urlKioskoDesigner}restKiosco/logoEmpresa/${nit}`;
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/logoEmpresa/${nit}?cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/logoEmpresa/${nit}`;
    ////console.log(url);
    return this.http.get(url, {
      params: {
        cadena
      }
    });
  }

  inactivaToken(jwt: string, nit: string, cadena: string) { // recibe token y cambia estado a N
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/inactivaToken?jwt=${jwt}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/inactivaToken?nit=${nit}&cadena=${cadena}&jwt=${jwt}`;
    ////console.log('cadena recibida: ', cadena);
    ////console.log('jwt: ', jwt);
    ////console.log('nit: ', nit);
    ////console.log(url);
    return this.http.post(url, {});
  }

// inactivo todos los tokens de un mismo tipo
  inactivaTokensTipo(tipo: string, usuario: string, nitEmpresa: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/inactivaTokensTipo?tipo=${tipo}&seudonimo=${usuario}&nit=${nitEmpresa}&cadena=${cadena}`;
    ////console.log(url);
    return this.http.post(url, {});
  }

  enviaCorreoNovedadRRHH(seudonimo: string, nit: string, novedad: string, asunto: string, urlKiosco: string, grupo: string, cadena: string ) { 
    // const url = `${environment.urlKioskoDesigner}restKiosco/logoEmpresa/${nit}`;
    //const url = `${environment.urlKioskoReportes}empleados/enviaReporteInfoRRHH?seudonimo=${seudonimo}&nitempresa=${nit}&observacion=${novedad}&grupo=${grupo}&urlKiosco=${urlKiosco}`;
    const url = `${environment.urlKioskoReportes}empleados/enviaReporteInfoRRHH`;
    //console.log(url);
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
    //const url = `${environment.urlKioskoReportes}empleados/educacionesNoFormales?usuario=${usuario}&cadena=${cadena}&empresa=${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}empleados/educacionesNoFormales`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        usuario,
        cadena,
        empresa: nitEmpresa
      }
    });
  }

  getEducacionesFormales(usuario: string, cadena: string, nitEmpresa: string) {
    //const url = `${environment.urlKioskoReportes}empleados/educacionesFormales?usuario=${usuario}&cadena=${cadena}&empresa=${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}empleados/educacionesFormales`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        usuario,
        cadena,
        empresa: nitEmpresa
      }
    });
  } 
  getObtenerAnexosDocumentos(usuario: string, cadena: string, nitEmpresa: string) {
    //const url = `${environment.urlKioskoReportes}empleados/educacionesFormales?usuario=${usuario}&cadena=${cadena}&empresa=${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}empleados/obtenerAnexosDocumentos`;
    ////console.log('url:' + url);
    return this.http.get(url, {
      params: {
        empleado: usuario,
        cadena: cadena,
        empresa: nitEmpresa
      }
    });
  }   
  getDescargarArchivo(usuario: string, cadena: string, nitEmpresa: string, anexo: string){
    const url = `${environment.urlKioskoReportes}empleados/decargarAnexo?usuario=${usuario}&cadena=${cadena}&empresa=${nitEmpresa}&anexo=${anexo}`;
    ////console.log(url);
    return this.http.get(url, { responseType: 'blob' });
  }
  getGenerarQR(seudonimo: string,celular: string,correo: string,cargo: string,empresa: string, cadena: string, nitEmpresa: string){
    const url = `${environment.urlKioskoReportes}empleados/generaQR`;
    ////console.log(url);
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
  getValidaFoto(seudonimo: string, cadena: string, nitEmpresa: string){
    const url = `${environment.urlKioskoReportes}empleados/exiteFoto`;
    ////console.log(url);
    return this.http.get(url, {
      params: {
        documento: seudonimo,
        cadena: cadena,
        nit: nitEmpresa
      }
    });
  }
  /*para eliminar la foto del usuario*/
  getEliminarFoto(seudonimo: string, cadena: string, nitEmpresa: string){
    const url = `${environment.urlKioskoReportes}empleados/eliminarFoto`;
    ////console.log(url);
    return this.http.get(url, {
      params: {
        documento: seudonimo,
        cadena: cadena,
        nit: nitEmpresa
      }
    });
  }

  getNotifiaciones(seudonimo: string, tipoNoti: string,cadena: string, nit: string){
    const url = `${environment.urlKioskoReportes}empleados/getNotificaciones`;
    ////console.log('url:' + url);
    return this.http.get(url,{
      params: {
        usuario: seudonimo,
        tipoNotificacion: tipoNoti,
        empresa: nit,
        cadena: cadena
      }
      });
  }

  getProverbios(cadena: string, nit: string){
    const url = `${environment.urlKioskoReportes}empleados/proverbios`;
    //console.log('url:' + url);
    return this.http.get(url,{
      params: {
        nit: nit,
        cadena: cadena
      }
      });
  }

  clear() {
    this.isUserLoggedIn = null;
    this.usserLogged = null;
    this.secuenciaEmpleado = null;
    this.nombrePersona = 'Bienvenido';
    this.nombreApellidoPersona = 'Bienvenido';
    this.datos = null;
    this.usuario = null;
    this.empresa = null;
    this.tokenJWT = null;
    this.urlLogoEmpresa = null;
    this.urlLogoEmpresaDarkXl = null;
    this.urlLogoEmpresaMin = null;
    this.grupoEmpresarial = null;
    this.documento = null;
    //this.cadenaConexion = 'wsreportePU';
    this.datosPersonales = null;
    this.datosFamilia = null;
    this.telefonosEmpleado = null;
    this.urlKioscoDomain= null;
    this.datosContacto = null;
    this.correo = null;
    this.nombreContactoSoporte='';
    this.correoContactoSoporte='';
    this.datosEstudios = null;
    this.datosEstudiosNF = null;
    this.datosExperienciaLab = null;
    this.urlActiva = null;
    this.tipoUsuario = null;
    this.documentosAnexos = null;
    this.documentoSeleccionado = null;
    this.carnetSeleccionado = [];
    this.existefotoPerfil = null;
    this.notificacionesVacaciones = 0;
    this.notificacionesAusentismo= 0;
    this.notificacionesRh = 0;
    this.existeDocumentoAnexo = [];
  }
}
