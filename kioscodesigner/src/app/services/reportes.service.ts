import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  generarReporte(reporte: string, secuenciaEmpl: string, envioCorreo: boolean) {
    const url = `${environment.urlKioskoReportes}reportes/generaReporte/${reporte}/${secuenciaEmpl}/${envioCorreo}`;
    console.log(url);
    return this.http.get(url, { responseType: 'blob' });
  }
}
