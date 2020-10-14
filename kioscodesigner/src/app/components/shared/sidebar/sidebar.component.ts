import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() urlFotoPerfil = 'assets/images/fotos_empleados/sinFoto.jpg'; // recibe valor de pages.component
  opcionesKioskos: any;
  nombreUsuario;
  fotoPerfil;
  datos;

  constructor(private opcionesKioskosService: OpcionesKioskosService,
              public usuarioServicio: UsuarioService, private loginService: LoginService, private router: Router, private reporteService: ReportesService) {
    console.log(this.usuarioServicio.tokenJWT);
    this.cargarOpciones();
    this.cargaFoto();
    this.nombreUsuario = this.usuarioServicio.nombrePersona;
    // this.cargarDatos();
  }

  ngOnInit() {
  }

  clic() {
    console.log('hiciste clic');
    this.reporteService.reporteSeleccionado = null;
  }

  cargarOpciones() {
    if (this.opcionesKioskosService.opcionesKioskos.length === 0 || this.opcionesKioskosService.opcionesKioskos == null
      || this.opcionesKioskosService.opcionesKioskos === []) {
      this.opcionesKioskosService.getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario)
        .subscribe(
          data => {
            this.opcionesKioskos = data;
            this.opcionesKioskosService.opcionesKioskos = data;
            this.usuarioServicio.datos = data;
            console.log('opcionesKioskos', this.opcionesKioskos);
          });
    } else {
      this.opcionesKioskos = this.opcionesKioskosService.opcionesKioskos;
      console.log('opcionesKioskos', this.opcionesKioskos);
    }
  }

  cargaFoto() {
    console.log('getDocumentoSidebar');
    this.usuarioServicio.getDocumentoSeudonimo(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
    .subscribe(
      data => {
        console.log(data);
        this.fotoPerfil = data['result'];
        console.log('documento: ' + this.fotoPerfil);
        document.getElementById('fotoPerfil').setAttribute('src',
        `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`);
      }
    );
  }

  logout() {
    console.log('cerrar sesion');
    localStorage.removeItem('currentUser');
    // this.router.navigate(['/login']);
    this.router.navigate(['/']);
  }


}
