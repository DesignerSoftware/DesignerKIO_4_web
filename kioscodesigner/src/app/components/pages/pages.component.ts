import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ThrowStmt } from '@angular/compiler';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  usuario;
  empresa;
  fotoPerfil;
  url = 'assets/images/fotos_empleados/sinFoto.jpg';
  datoHijo = 'Sin datos';

  constructor(public opcionesKioskosServicio: OpcionesKioskosService, private router: Router, private usuarioServicio: UsuarioService) { 
    this.getInfoUsuario();
    this.cargaFoto(); // cargar la foto del usuario conectado
  }

  ngOnInit() {

  }

  getInfoUsuario() {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    // xconsole.log(sesion);
    this.usuario = sesion['usuario'];
    this.empresa = sesion['empresa'];
    this.usuarioServicio.setUsuario(this.usuario);
    this.usuarioServicio.setEmpresa(this.empresa);
    console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
  }

  cargaFoto() {
    console.log('getDocumento');
    this.usuarioServicio.getDocumentoSeudonimo(this.usuarioServicio.usuario
      , this.usuarioServicio.empresa)
    .subscribe(
      data => {
        console.log(data);
        this.fotoPerfil = data['result'];
        console.log('documento: '+this.fotoPerfil);
        this.url=`${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`;
         //this.usuarioServicio.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`;
         //document.getElementById('perfil').setAttribute('src', `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`);
      }
    );
  }

  cambiarRuta(indexOpc: number) {
    this.router.navigate(['/', this.opcionesKioskosServicio.opcionesKioskos[indexOpc]['NOMBRERUTA']]);
  }

  logout() {
    console.log('cerrar sesion');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  mostrarModalCambiarFoto() {
    console.log('presiono botón');
    /*$('#staticBackdrop').modal('show');
    $('#myModal').modal(options);*/
    $('#staticBackdrop').modal('show');
  }

  min() {
    console.log('presionado');
  }

  funCambiar(e) {
    console.log(e);
    this.datoHijo = e;
    this.url = e;
  }

}
