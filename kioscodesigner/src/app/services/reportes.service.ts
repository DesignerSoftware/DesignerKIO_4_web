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
  
  constructor(private http: HttpClient) { }

  generarReporte(reporte: string, secuenciaEmpl: string, envioCorreo: boolean, correo: string, descripcionReporte: string, codigoReporte: string, nit: string, cadena: string) {
    const url = `${environment.urlKioskoReportes}reportes/generaReporte/${reporte}/${secuenciaEmpl}/${envioCorreo}/${correo}?descripcionReporte=${descripcionReporte}&codigoReporte=${codigoReporte}&nit=${nit}&cadena=${cadena}`;
    console.log(url);
    return this.http.get(url, { responseType: 'blob' });
  }

  validaFechasCertingresos(fechaDesde: string, fechaHasta: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/validarFechasCertingresos?fechadesde=${fechaDesde}&fechahasta=${fechaHasta}`;
    console.log(url);
    return this.http.get(url);
  }
}
