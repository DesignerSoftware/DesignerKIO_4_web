import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  opcionesReportes: any = [];
  codigoReporteSeleccionado;
  reporteSeleccionado = null;
  nombreReporteSeleccionado;
  
  constructor(private http: HttpClient) { }

  generarReporte(reporte: string, envioCorreo: boolean, correo: string, descripcionReporte: string, codigoReporte: string, nit: string, cadena: string, usuario: string, grupo: string, urlKiosco: string) {
    const url = `${environment.urlKioskoReportes}reportes/generaReporte/${reporte}/${envioCorreo}/${correo}?descripcionReporte=${descripcionReporte}&codigoReporte=${codigoReporte}&nit=${nit}&cadena=${cadena}&usuario=${usuario}&grupo=${grupo}&urlKiosco=${urlKiosco}`;
    console.log(url);
    return this.http.get(url, { responseType: 'blob' });
  }

  validaFechasCertingresos(fechaDesde: string, fechaHasta: string) {
    const url = `${environment.urlKioskoReportes}restKiosco/validarFechasCertingresos?fechadesde=${fechaDesde}&fechahasta=${fechaHasta}`;
    console.log(url);
    return this.http.get(url);
  }

  clear() {
    this.opcionesReportes = [];
    this.codigoReporteSeleccionado = null;
    this.reporteSeleccionado = null;
    this.nombreReporteSeleccionado = null;
  }
}
