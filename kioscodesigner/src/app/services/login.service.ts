import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { ReportesService } from './reportes.service';
import { OpcionesKioskosService } from './opciones-kioskos.service';
import { VacacionesService } from './vacaciones.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public kioscoActivo = true;
  public mensajeKioscoInactivo = null;

  constructor(private http: HttpClient, private usuarioService: UsuarioService, private reportesService: ReportesService,
              private opcionesKioskosService: OpcionesKioskosService, private vacacionesService: VacacionesService) {
  }

  registrarUsuario(seudonimo1: string, usuario1: string, clave1: string, nitEmpresa1: string, correo1: string, cadena1: string) {
    // const url = `${environment.urlKioskoDesigner}conexioneskioskos?seudonimo=${seudonimo}&usuario=${usuario}&clave=${clave}&nitEmpresa=${nitempresa}&correo=${correo}`;
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/creaUsuario`;
    //const url = `${environment.urlKioskoReportes}conexioneskioskos/creaUsuario?seudonimo=${seudonimo}&usuario=${usuario}&clave=${clave}&nitEmpresa=${nitEmpresa}&correo=${correo}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/creaUsuario`;
    //console.log(url);
    // let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
    return this.http.post(url, "", {params: {
      seudonimo: seudonimo1,
      usuario: usuario1,
      clave: clave1,
      nitEmpresa: nitEmpresa1,
      correo: correo1,
      cadena: cadena1
    }}
    );
  }

  validarUsuarioYEmpresa(codEmpleado: string, nitEmpresa: string, cadena: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/validarUsuarioyEmpresa/${codEmpleado}/${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarUsuarioyEmpresa/${codEmpleado}/${nitEmpresa}?cadena=${cadena}`;
    //console.log(url);
    return this.http.get(url);
  }

  getCorreoAsociadoPersonaEmpresa(documento: string, nitEmpresa: string, cadena: string){
    // const url = `${environment.urlKioskoDesigner}restKiosco/getCorreoPersonaEmpresa/${documento}/${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/getCorreoPersonaEmpresa/${documento}/${nitEmpresa}?cadena=${cadena}`;
    //console.log(url);
    return this.http.get(url);
  }

  enviarCorreoConfirmaCuenta(usuario: string, clave: string, nitEmpresa: string, cadena: string, grupoEmpr: string, urlKiosco: string) {
    //const url = `${environment.urlKioskoDesigner}restKiosco/jwtValidCuenta?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&urlKiosco=${urlKiosco}`;
    // const url = `${environment.urlKioskoDesigner}restKiosco/jwtValidCuenta?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&urlKiosco=${environment.urlKiosko}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/jwtValidCuenta?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&cadena=${cadena}&grupo=${grupoEmpr}&urlKiosco=${urlKiosco}`;
    //console.log(url);
    return this.http.get(url);
  }

  generarToken(usuario: string, clave: string, nitEmpresa: string, cadena: string, grupo: string) {
    //const url = `${environment.urlKioskoDesigner}restKiosco/jwt?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/jwt?usuario=${usuario}&clave=${clave}&nit=${nitEmpresa}&cadena=${cadena}&grupo=${grupo}`;
    //console.log(url);
    //console.log(`parametros: usuario ${usuario}, nit ${nitEmpresa}, clave ${clave}, grupo: ${grupo}`);
    return this.http.post(url, {});
  }

  validarSeudonimoYNitEmpresaRegistrado(seudonimo: string, nitempresa: string, cadena: string) {
    // const url = `${environment.urlKioskoDesigner}restKiosco/validarSeudonimoyEmpresaRegistrado/${seudonimo}/${nitempresa}`;
    const url = `${environment.urlKioskoReportes}conexioneskioskos/restKiosco/validarSeudonimoyEmpresaRegistrado/${seudonimo}/${nitempresa}?cadena=${cadena}`;
    //console.log(url);
    return this.http.get(url);
  }

  // Cerrar sesión
  logOut() {
    //console.log('logOut() loginService');
    this.usuarioService.clear();
    this.reportesService.clear();
    this.opcionesKioskosService.clear();
    this.vacacionesService.clear();
  }

}
