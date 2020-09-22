import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.css']
})
export class VacacionesComponent implements OnInit {
opcioneskioskoG: any = [];
private usuario: string;
private empresa: string;

  constructor(private opcionesKioskos: OpcionesKioskosService, private usuarioServicio: UsuarioService) {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    console.log(sesion);
    this.usuario = sesion['usuario'];
    this.empresa = sesion['empresa'];
    console.log('usuario: ' + this.usuario + ' empresa: ' + this.empresa);
    this.opcioneskioskoG = this.opcionesKioskos.getOpcionesKiosco(this.empresa);
    console.log(this.opcioneskioskoG);
  }

  ngOnInit() {
  }


}
