import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PQRSService {
    constructor(public http: HttpClient) { }
    crearMensaje(token: string, seudonimo: string, nit: string, titulo: string,
        mensaje: string, cadena: string, urlPqrs: string ) {
        let url = `${environment.urlKioskoReportes}pqrs/crearPqrs`;
        /*
        let urlExt = url + `?`
            + `seudonimo=${seudonimo}&`
            + `nitempresa=${nit}&`
            + `titulo=${titulo}&`
            + `mensaje="${mensaje}"&`
            + `cadena=${cadena}&`
            + `url=${urlPqrs}`
            ;
            */
/*
        return this.http.post(urlExt, "",
            {
              headers: new HttpHeaders({
                Authorization: token
              })
            } 
            
        );*/
        return this.http.post(url, "", {
            params: {
              seudonimo: seudonimo,
              nitempresa: nit,
              titulo: titulo,
              mensaje: mensaje,
              cadena: cadena,
              url: urlPqrs
            },
            headers: new HttpHeaders({
              Authorization: token
            })
          } 
        );
    }
}