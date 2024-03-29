import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  opcionesReportes: any = [];
  reportesEmpleado: any = [];
  reportesJefe: any = [];
  codigoReporteSeleccionado: any = null;
  reporteSeleccionado = null;
  nombreReporteSeleccionado = null;
  numeroReporte: number = 0;

  constructor(private http: HttpClient) { }
  generarReporte(reporte: string, envioCorreo: boolean, correo: string, descripcionReporte: string, codigoReporte: string, nit: string, cadena: string, usuario: string, grupo: string, urlKiosco: string) {
    const url = `${environment.urlKioskoReportes}reportes/generaReporte/${reporte}/${envioCorreo}/${correo}?descripcionReporte=${descripcionReporte}&codigoReporte=${codigoReporte}&nit=${nit}&cadena=${cadena}&usuario=${usuario}&grupo=${grupo}&urlKiosco=${urlKiosco}`;
    // console.log(url);
    return this.http.get(url, { responseType: 'blob' });
  }

  generarReporteprovisiones(reporte: string,nit: string, cadena: string, usuario: string ) {
    const url = `${environment.urlKioskoReportes}reportes/generaReporteProvisiones/${reporte}/?&nit=${nit}&cadena=${cadena}&usuario=${usuario}`;
    // console.log(url);
    return this.http.get(url, { responseType: 'blob' });
  }

  validaFechasCertingresos(fechaDesde: string, fechaHasta: string, cadena: string) {
    //onst url = `${environment.urlKioskoReportes}reportes/validarFechasCertingresos?fechadesde=${fechaDesde}&fechahasta=${fechaHasta}&cadena=${cadena}`;
    const url = `${environment.urlKioskoReportes}reportes/validarFechasCertingresos`;
    // console.log(url);
    return this.http.get(url, {
      params: {
        fechadesde: fechaDesde,
        fechahasta: fechaHasta,
        cadena
      }
    });
  }

  clear() {
    this.opcionesReportes = [];
    this.codigoReporteSeleccionado = null;
    this.reporteSeleccionado = null;
    this.nombreReporteSeleccionado = null;
    this.reportesEmpleado = [];
    this.reportesJefe = [];
    this.numeroReporte = 0;
  }
}
