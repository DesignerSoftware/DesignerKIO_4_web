import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  usuario;
  empresa;

  constructor(public opcionesKioskosServicio: OpcionesKioskosService, private router: Router, private usuarioServicio: UsuarioService) { 
    const sesion = this.usuarioServicio.getUserLoggedIn();
    console.log(sesion);
    this.usuario = sesion['usuario'];
    this.empresa = sesion['empresa'];
    console.log('usuario: ' + this.usuario + ' empresa: ' + this.empresa);
  }

  ngOnInit() {
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

}
