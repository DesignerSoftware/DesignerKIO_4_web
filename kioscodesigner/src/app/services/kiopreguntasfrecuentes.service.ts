import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KiopreguntasfrecuentesService {

  constructor(private http: HttpClient) { }

  /*getKioPreguntasFrecuentes(nit: string) {
    const url = `${environment.urlKioskoReportes}restKiosco/kioPreguntasFrecuentes/${nit}`;
    console.log(url);
    return this.http.get(url);
  }*/
}
