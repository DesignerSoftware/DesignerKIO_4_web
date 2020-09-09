import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  registrarUsuario(seudonimo: string, usuario: string, clave: string, nitEmpresa: string, correo: string) {
    // const url = `${environment.urlKioskoDesigner}conexioneskioskos?seudonimo=${seudonimo}&usuario=${usuario}&clave=${clave}&nitEmpresa=${nitempresa}&correo=${correo}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/creaUsuario?seudonimo=${seudonimo}&usuario=${usuario}&clave=${clave}&nitEmpresa=${nitEmpresa}&correo=${correo}`;
    console.log(url);

    // let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
    return this.http.post(url, { params: {
      seudonimo,
      usuario,
      clave,
      nitEmpresa,
      correo
    }});
  }

  validarUsuarioYEmpresa(codEmpleado: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioyEmpresa/${codEmpleado}/${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  getCorreoAsociadoPersonaEmpresa(documento: string, nitEmpresa: string){
    const url = `${environment.urlKioskoDesigner}restKiosco/getCorreoPersonaEmpresa/${documento}/${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  enviarCorreoConfirmaCuenta(usuario: string, clave: string, nitEmpresa: string, urlKiosco: string) {
    //const url = `${environment.urlKioskoDesigner}restKiosco/jwtValidCuenta?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&urlKiosco=${urlKiosco}`;
    const url = `${environment.urlKioskoDesigner}restKiosco/jwtValidCuenta?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&urlKiosco=${environment.urlKiosko}`;
    console.log(url);
    return this.http.get(url);
  }

  generarToken(usuario: string, clave: string, nitEmpresa: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/jwt?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  validarSeudonimoYNitEmpresaRegistrado(seudonimo: string, nitempresa: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/validarSeudonimoyEmpresaRegistrado/${seudonimo}/${nitempresa}`;
    console.log(url);
    return this.http.get(url);
  }

}
