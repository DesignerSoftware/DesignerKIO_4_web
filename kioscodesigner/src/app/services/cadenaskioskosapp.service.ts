import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CadenaskioskosappService {

  constructor(private http: HttpClient) { }

  // getCadenasKioskosEmp(grupo: string) {
  // const urlMysql= 'com.mysql.jdbc.Driver';
  // const urlDriverMysql='jdbc:mysql://localhost:3306/kiosco';
  // const userMysql = 'root';
  // const passMysql= ''; // www.nominadesigner.co y local
  // //const passMysql= 'Prueba1';  // ability1
  // console.log('grupo recibido: '+grupo);
  // const url = `${environment.urlKioskoDesigner}restKiosco/cadenasKioskos?url=${urlMysql}&driver=${urlDriverMysql}&usuario=${userMysql}&clave=${passMysql}&grupo=${grupo}`;
  // console.log(url);
  // return this.http.get(url);
  // }

  getCadenasKioskosEmp(grupo: string) {
    console.log('grupo recibido: ' + grupo);
    const url = `${environment.urlKioskoReportes}cadenaskioskos/${grupo}`;
    console.log(url);
    return this.http.get(url);
  }

}
