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
    console.log(obj);
    console.log('getUserLoggedIn()');
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
    const url = `${environment.urlKioskoDesigner}actualizarParametrosReportes` +
    `?usuario=${codigoEmp}&nitEmpresa=${nitEmpresa}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&enviocorreo=${enviocorreo}`;
    console.log(url);
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
    return this.http.post(url, {}, { headers: headers });
  }

  validarIngresoKioscoSeudonimo(seudonimo: string, clave: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/validarIngresoSeudonimoKiosco?usuario=${seudonimo}&clave=${clave}&nitEmpresa=${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  generarTokenLogin(usuario: string, clave: string, empresa: string) { // recibe seudonimo, clave y nit de empresa
    const url =`${environment.urlKioskoDesigner}restKiosco/jwt/${usuario}/${clave}/${empresa}`;
    console.log(url);
    return this.http.get(url);
  }


}
