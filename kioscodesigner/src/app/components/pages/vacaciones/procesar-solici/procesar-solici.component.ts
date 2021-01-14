import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-procesar-solici',
  templateUrl: './procesar-solici.component.html',
  styleUrls: ['./procesar-solici.component.css']
})
export class ProcesarSoliciComponent implements OnInit {
  formulario: FormGroup;
  solicitudSeleccionada = null;
  fotoPerfil;
  url ='assets/images/fotos_empleados/sinFoto.jpg';

  constructor(public vacacionesService: VacacionesService, private usuarioService: UsuarioService, private fb: FormBuilder) {
    this.cargarDatosSolicitudesProcesadas();
  }

  ngOnInit() {
    this.crearFormulario();
    this.cargarDatosSolicitudesProcesadas();
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      motivo: [''],
    })
  }

  cargarDatosSolicitudesProcesadas() {
    if (this.vacacionesService.SolicitudesJefe == null) {
      this.vacacionesService.getSoliciSinProcesarJefe(this.usuarioService.empresa, this.usuarioService.usuario, 'ENVIADO')
        .subscribe(
          data => {
            this.vacacionesService.SolicitudesJefe = data;
            console.log('impresive', this.vacacionesService.SolicitudesJefe);
          }
        );
    }
  }

  detalleSolicitud(index: string) {
    this.solicitudSeleccionada = this.vacacionesService.SolicitudesJefe[index];

    $('#staticBackdrop3').modal('show');
  }

  cargaFoto(documento: string) {
          this.fotoPerfil = documento;
          console.log('documento: ' + this.fotoPerfil);
         /* document.getElementById('fotoPerfilEmpl').setAttribute('src',
            `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`);*/
            this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`;
            return this.url;
  }

  aprobarEnvio() {
    console.log('Motivo: '+this.formulario.get('motivo').value);
    let aprobado;
    swal.fire({
      title: '¿Desea aprobar la solicitud?',
      text: "Al aprobar la solicitud ocacionará que el estado de esta sea 'Aprobado' ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vacacionesService.setNuevoEstadoSolicio(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion,
          'AUTORIZADO', this.solicitudSeleccionada[18], null)
          .subscribe(
            data => {
              aprobado = data.toString();
              console.log('Envio aprobado', data);
              if (data) {
                swal.fire({
                  title: 'Aprobada!',
                  text: "La solicitud ha sido Aprobada. ",
                  icon: 'success',                  
                  confirmButtonColor: '#3085d6',                  
                  confirmButtonText: 'Ok',
                                   
                }).then((result2) => {
      if (result2.isConfirmed) {
        $('#exampleModalCenter').modal('hide');
        this.reloadPage();
      }})
              } else {
                swal.fire(
                  'Ha ocurrido un problema!',
                  'La solicitud  no ha podido ser aprobada.',
                  'error'
                )
              }
            }
          );
      }

    })

  }

  reloadPage() {
    this.ngOnInit();
  }


  rechazarEnvio() {
    let rechazado
    swal.fire({
      title: '¿Desea cancelar la solicitud?',
      text: "Al Rechazar la solicitud ocacionará que el estado de esta sea 'Rechazado' ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vacacionesService.setNuevoEstadoSolicio(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion,
          'RECHAZADO', this.solicitudSeleccionada[18], this.formulario.get('motivo').value)
          .subscribe(
            data => {
              rechazado = data.toString();
              console.log('enviaoRechazado', data);
              if (data) {
                swal.fire({
                  title: 'Rechazada!',
                  text: "La solicitud ha sido rechazada. ",
                  icon: 'success',                  
                  confirmButtonColor: '#3085d6',                  
                  confirmButtonText: 'Ok',
                                   
                }).then((result2) => {
      if (result2.isConfirmed) {
        this.reloadPage();
        $('#exampleModalCenter').modal('hide');
      }})
              } else {
                swal.fire(
                  'Ha ocurrido un problema',
                  'La solicitud no ha podido ser Rechazada.',
                  'error'
                )
              }
            }
          );
      }

    })

  }


  procesarSolicitud() {
    console.log('procesar solicitud');
  }



}
