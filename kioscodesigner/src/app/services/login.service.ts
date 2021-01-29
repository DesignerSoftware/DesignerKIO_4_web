import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { ReportesService } from './reportes.service';
import { OpcionesKioskosService } from './opciones-kioskos.service';
import { VacacionesService } from './vacaciones.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private usuarioService: UsuarioService, private reportesService: ReportesService,
              private opcionesKioskosService: OpcionesKioskosService, private vacacionesService: VacacionesService) {
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
    // const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioyEmpresa/${codEmpleado}/${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarUsuarioyEmpresa/${codEmpleado}/${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  getCorreoAsociadoPersonaEmpresa(documento: string, nitEmpresa: string){
    // const url = `${environment.urlKioskoDesigner}restKiosco/getCorreoPersonaEmpresa/${documento}/${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/getCorreoPersonaEmpresa/${documento}/${nitEmpresa}`;
    console.log(url);
    return this.http.get(url);
  }

  enviarCorreoConfirmaCuenta(usuario: string, clave: string, nitEmpresa: string, urlKiosco: string) {
    //const url = `${environment.urlKioskoDesigner}restKiosco/jwtValidCuenta?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&urlKiosco=${urlKiosco}`;
    // const url = `${environment.urlKioskoDesigner}restKiosco/jwtValidCuenta?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&urlKiosco=${environment.urlKiosko}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/jwtValidCuenta?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&urlKiosco=${environment.urlKiosko}`;
    console.log(url);
    return this.http.get(url);
  }

  generarToken(usuario: string, clave: string, nitEmpresa: string, cadena: string) {
    //const url = `${environment.urlKioskoDesigner}restKiosco/jwt?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/jwt?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&cadena?${cadena}`;
    console.log(url);
    console.log(`parametros: usuario ${usuario}, nit ${nitEmpresa}, clave ${clave}`);
    return this.http.post(url, {});
  }

  validarSeudonimoYNitEmpresaRegistrado(seudonimo: string, nitempresa: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/validarSeudonimoyEmpresaRegistrado/${seudonimo}/${nitempresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarSeudonimoyEmpresaRegistrado/${seudonimo}/${nitempresa}`;
    console.log(url);
    return this.http.get(url);
  }

  // Cerrar sesión
  logOut() {
    console.log('logOut() loginService');
    this.usuarioService.clear();
    this.reportesService.clear();
    this.opcionesKioskosService.clear();
    this.vacacionesService.clear();
  }

}
