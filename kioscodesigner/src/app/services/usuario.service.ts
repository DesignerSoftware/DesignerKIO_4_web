import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private isUserLoggedIn;
  public usserLogged;
  secuenciaEmpleado = null;
  datos;

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

  getDatosUsuario(usuario: string, nit: string) {
    const obj: any = this.getUserLoggedIn;
    // const url = 'http://localhost:8080/wsjavanov5/jcmouse/restapi/restKiosco/getDatosEmpleadoNit/' + usuario + '/' + nit;
    const url = `${environment.urlKioskoDesigner}restKiosco/getDatosEmpleadoNit/` + usuario + '/' + nit;
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
    const url = `${environment.urlKioskoDesigner}empleados/` + codEmpleado;
    console.log(url);
    return this.http.get(url);
  }

  actualizaParametrosReportes(codigoEmp: string, nitEmpresa: string, fechadesde: Date, fechahasta: Date, enviocorreo: boolean) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/updateFechas` +
    `?usuario=${codigoEmp}&nitEmpresa=${nitEmpresa}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&enviocorreo=${enviocorreo}`;
    console.log(url);
    return this.http.post(url, {});
  }

  validarIngresoKioscoSeudonimo(seudonimo: string, password: string, nit: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/validarIngresoSeudonimoKiosco`;
    console.log(
      `${environment.urlKioskoDesigner}restKiosco/validarIngresoSeudonimoKiosco?usuario=${seudonimo}&clave=${password}&nitEmpresa=${nit}`);
    return this.http.get(url, {params: {
      usuario: seudonimo,
      clave: password,
      nitEmpresa: nit
    }});
  }

  validarSeudonimoClaveNit(seudonimo: string, clave: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioSeudonimoRegistrado?usuario=${seudonimo}&clave=${clave}&nitEmpresa=${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  generarTokenLogin(usuario: string, clave: string, empresa: string) { // recibe seudonimo, clave y nit de empresa
    const url =`${environment.urlKioskoDesigner}restKiosco/jwt/${usuario}/${clave}/${empresa}`;
    console.log(url);
    return this.http.get(url);
  }

  getParametros(usuario: string, empresa: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/parametros?usuario=${usuario}&nitEmpresa=${empresa}`;
    console.log(url);
    return this.http.get(url);
  }

  consultarCorreoConexioneskioskos(usuario: string, empresa: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/correoconexioneskioskos/${usuario}/${empresa}`;
    console.log(url);
    return this.http.get(url);
  }

  // actualizar clave conexioneskioskos:
  actualizaClave(usuario: string, nit: string, clave: string) {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/updateClave?usuario=${usuario}&nitEmpresa=${nit}&clave=${clave}`;
    console.log(url);
    return this.http.post(url, {});
  }

  generaClaveAleatoria(usuario: string, nit: string){
    const url = `${environment.urlKioskoDesigner}restKiosco/generarClave?usuario=${usuario}&nit=${nit}`;
    console.log(url);
    return this.http.get(url);
  }

  validaToken(jwt: string) { /// retorna 0 si el token es válido.
    const url = `${environment.urlKioskoDesigner}restKiosco/validarJWTActivarCuenta?jwt=${jwt}`;
    console.log(url);
    return this.http.get(url);
  }

  cambiaEstadoUsuario() {
    const url = `${environment.urlKioskoReportes}conexioneskioskos/cambioEstadoUsuario?seudonimo=8125176&nitEmpresa=811025446&activo=P`;
    console.log(url);
    return this.http.get(url);
  }

  // valida si esta registrado en conexioneskioskos por empleado y nitempresa, corregir para que sea por persona
  validaUsuarioYNitEmpresaRegistrado(usuario: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioRegistrado/${usuario}/${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  getEmpresas() {
    const url = `${environment.urlKioskoDesigner}restKiosco/empresas`;
    console.log(url);
    return this.http.get(url);
  }
}
