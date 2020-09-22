import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KiopreguntasfrecuentesService {

  constructor(private http: HttpClient) { }

  getKioPreguntasFrecuentes(nit: string) {
    const url = `${environment.urlKioskoDesigner}restKiosco/kioPreguntasFrecuentes/${nit}`;
    console.log(url);
    return this.http.get(url);
  }

}
