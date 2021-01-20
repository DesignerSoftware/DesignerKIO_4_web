import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private isUserLoggedIn;
  public usserLogged;
  secuenciaEmpleado = null;
  nombrePersona = 'Bienvenido';
  datos;
  usuario;
  empresa;
  tokenJWT;
  urlLogoEmpresa;
  urlLogoEmpresaDarkXl;
  urlLogoEmpresaMin;
  grupoEmpresarial=null;
  documento=null;
  cadenaConexion;
  datosFamilia = null;
  datosPersonales = null;
  urlKioscoDomain = "https://www.designer.com.co:8179";
  //public url = 'http://www.nominadesigner.co:8080/wsreporte/webresources/conexioneskioskos/obtenerFoto/sinFoto.jpg';
  public url = 'https://www.designer.com.co:8178/wsreporte/webresources/conexioneskioskos/obtenerFoto/sinFoto.jpg';

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
    console.log('getUserLoggedIn()', obj);
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

  // getDatosUsuario(usuario: string, nit: string) {
  //   const obj: any = this.getUserLoggedIn;
  //   // const url = 'http://localhost:8080/wsjavanov5/jcmouse/restapi/restKiosco/getDatosEmpleadoNit/' + usuario + '/' + nit;
  //   const url = `${environment.urlKioskoDesigner}restKiosco/getDatosEmpleadoNit/` + usuario + '/' + nit;
  //   console.log('url:' + url);
  //   return this.http.get(url);
  // }

  getDatosUsuario(usuario: string, nit: string) {
    const obj: any = this.getUserLoggedIn;
    // const url = 'http://localhost:8080/wsjavanov5/jcmouse/restapi/restKiosco/getDatosEmpleadoNit/' + usuario + '/' + nit;
    const url = `${environment.urlKioskoReportes}restKiosco/getDatosEmpleadoNit/` + usuario + '/' + nit;
    console.log('url:' + url);
    return this.http.get(url);
  }

  getDatosUsuarioFamilia(usuario: string, nit: string) {
    const obj: any = this.getUserLoggedIn;
    // const url = 'http://localhost:8080/wsjavanov5/jcmouse/restapi/restKiosco/getDatosFamiliaEmpleado/' + usuario + '/' + nit;
    const url = `${environment.urlKioskoReportes}empleados/datosFamiliaEmpleado/` + usuario + '/' + nit;
    console.log('url:' + url);
    return this.http.get(url);
  }

  getDatosUsuarioCadena(usuario: string, nit: string, cadena: string) {
    const obj: any = this.getUserLoggedIn;
    // const url = 'http://localhost:8080/wsjavanov5/jcmouse/restapi/restKiosco/getDatosEmpleadoNit/' + usuario + '/' + nit;
    const url = `${environment.urlKioskoReportes}empleados/datosEmpleadoNit/${usuario}/${nit}?cadena=${cadena}`;
    console.log('url:' + url);
    return this.http.get(url);
  }

  isAutenticado() {
    if (this.getUserLoggedIn () != null) {
      console.log('estoy autenticado');
      return true;
    }
  }

  getSecuenciaEmpl(codEmpleado: string) {
    //const url = `${environment.urlKioskoDesigner}empleados/` + codEmpleado;
    // const url = `${environment.urlKioskoDesigner}empleados/` + codEmpleado;
    const url = `${environment.urlKioskoReportes}empleados/${codEmpleado}`;
    console.log(url);
    return this.http.get(url);
  }

  actualizaParametrosReportes(codigoEmp: string, nitEmpresa: string, fechadesde: Date, fechahasta: Date, enviocorreo: boolean, dirigidoa: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/updateFechas` +
    `?usuario=${codigoEmp}&nitEmpresa=${nitEmpresa}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&enviocorreo=${enviocorreo}&dirigidoa=${dirigidoa}`;
    console.log(url);
    return this.http.post(url, {});
  }

  validarIngresoKioscoSeudonimo(seudonimo: string, password: string, nit: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/validarIngresoSeudonimoKiosco`;
    console.log(url);
    /*console.log(
      `${environment.urlKioskoReportes}conexioneskioskos/validarIngresoSeudonimoKiosco?usuario=${seudonimo}&clave=${password}&nitEmpresa=${nit}`);*/
    return this.http.get(url, {params: {
      usuario: seudonimo,
      clave: password,
      nitEmpresa: nit
    }});
  }

  validarSeudonimoClaveNit(seudonimo: string, clave: string, nitEmpresa: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioSeudonimoRegistrado?usuario=${seudonimo}&clave=${clave}&nitEmpresa=${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarUsuarioSeudonimoRegistrado?usuario=${seudonimo}&clave=${clave}&nitEmpresa=${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  generarTokenLogin(usuario: string, clave: string, empresa: string) { // recibe seudonimo, clave y nit de empresa
    // const url =`${environment.urlKioskoDesigner}restKiosco/jwt/${usuario}/${clave}/${empresa}`;
    const url =`${environment.urlKioskoReportes}conexioneskioskos/restKiosco/jwt/${usuario}/${clave}/${empresa}`;
    console.log(url);
    return this.http.get(url);
  }

  getParametros(usuario: string, empresa: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/parametros?usuario=${usuario}&nitEmpresa=${empresa}`;
    console.log(url);
    return this.http.get(url);
  }

  consultarCorreoConexioneskioskos(usuario: string, empresa: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/correoconexioneskioskos/${usuario}/${empresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/correoconexioneskioskos/${usuario}/${empresa}`;
    console.log(url);
    return this.http.get(url);
  }

  // actualizar clave conexioneskioskos:
  actualizaClave(usuario: string, nit: string, clave: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/updateClave?usuario=${usuario}&nitEmpresa=${nit}&clave=${clave}`;
    console.log(url);
    return this.http.post(url, {});
  }

  generaClaveAleatoria(usuario: string, nit: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/generarClave?usuario=${usuario}&nit=${nit}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/generarClave?usuario=${usuario}&nit=${nit}`;
    console.log(url);
    return this.http.get(url);
  }

  validaToken(jwt: string) { 
    //const url = `${environment.urlKioskoDesigner}restKiosco/validarJWTActivarCuenta?jwt=${jwt}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarJWTActivarCuenta?jwt=${jwt}`;
    console.log(url);
    return this.http.get(url);
  }

  cambiaEstadoUsuario(seudonimo: string, nitEmpresa: string, activo: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/cambioEstadoUsuario?seudonimo=${seudonimo}&nitEmpresa=${nitEmpresa}&activo=${activo}`;
    console.log(url);
    return this.http.post(url, {});
  }

  // valida si esta registrado en conexioneskioskos por empleado y nitempresa, corregir para que sea por persona
  validaUsuarioYNitEmpresaRegistrado(usuario: string, nitEmpresa: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioRegistrado/${usuario}/${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarUsuarioRegistrado/${usuario}/${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  getEmpresas() {
    const url = `${environment.urlKioskoDesigner}restKiosco/empresas`;
    console.log(url);
    return this.http.get(url);
  }

  getDocumentoSeudonimo(seudonimo: string, nit: string) { // requiere el seudonimo y el nit de la empresa para retornar el documento asociado
    // const url = `${environment.urlKioskoDesigner}restKiosco/documentoconexioneskioskos?seudonimo=${seudonimo}&nit=${nit}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/documentoconexioneskioskos?seudonimo=${seudonimo}&nit=${nit}`;
    console.log(url);
    return this.http.get(url);
  }

  getLogoEmpresa(nit: string) { 
    // const url = `${environment.urlKioskoDesigner}restKiosco/logoEmpresa/${nit}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/logoEmpresa/${nit}`;
    console.log(url);
    return this.http.get(url);
  }

  inactivaToken(jwt: string) { // recibe token y cambia estado a N
    const url = `${environment.urlKioskoReportes}conexioneskioskos/inactivaToken?jwt=${jwt}`;
    console.log(url);
    return this.http.post(url, {});
  }

// inactivo todos los tokens de un mismo tipo
  inactivaTokensTipo(tipo: string, usuario: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/inactivaTokensTipo?tipo=${tipo}&seudonimo=${usuario}&nit=${nitEmpresa}`;
    console.log(url);
    return this.http.post(url, {});
  }

  enviaCorreoNovedadRRHH(seudonimo: string, nit: string, novedad: string, urlKiosco: string, grupo: string ) { 
    // const url = `${environment.urlKioskoDesigner}restKiosco/logoEmpresa/${nit}`;
    const url = `${environment.urlKioskoReportes}empleados/enviaReporteInfoRRHH?seudonimo=${seudonimo}&nitempresa=${nit}&observacion=${novedad}&grupo=${grupo}&urlKiosco=${urlKiosco}`;
    console.log(url);
    return this.http.get(url);
  }  

  clear() {
    this.isUserLoggedIn = null;
    this.usserLogged = null;
    this.secuenciaEmpleado = null;
    this.nombrePersona = 'Bienvenido';
    this.datos = null;
    this.usuario = null;
    this.empresa = null;
    this.tokenJWT = null;
    this.urlLogoEmpresa = null;
    this.urlLogoEmpresaDarkXl = null;
    this.urlLogoEmpresaMin = null;
    this.grupoEmpresarial = null;
    this.documento = null;
    this.cadenaConexion = null;
    this.datosPersonales = null;
    this.datosFamilia = null;
    this.urlKioscoDomain= null;
  }
}
