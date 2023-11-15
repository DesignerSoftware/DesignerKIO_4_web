import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-info-estudios',
  templateUrl: './info-estudios.component.html',
  styleUrls: ['./info-estudios.component.scss']
})
export class InfoEstudiosComponent implements OnInit {

  formularioReporteNov: FormGroup = this.fb.group(
    {
      mensaje: ["", Validators.required]
    }
  );
  estudioSeleccionado = null;

  constructor(public usuarioServicio: UsuarioService,
    private fb: FormBuilder,
    private cadenasKioskos: CadenaskioskosappService) { }

  ngOnInit() {
    this.crearFormulario();
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
  }

  crearFormulario() {
    this.formularioReporteNov = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() {
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        (data: any) => {
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              this.usuarioServicio.cadenaConexion = temp[4];
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  cargarDatosIniciales() {
    this.cargarDatosEstudios();
    this.cargarDatosEstudiosNoFormales();
    this.cargarNotificaciones();
  }

  cargarDatosEstudios() {
    if (this.usuarioServicio.datosEstudios == null) {
      this.usuarioServicio.getEducacionesFormales(this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
        .subscribe(
          data => {
            this.usuarioServicio.datosEstudios = data;
          }
        );
    }
  }

  cargarDatosEstudiosNoFormales() {
    if (this.usuarioServicio.datosEstudiosNF == null) {
      this.usuarioServicio.getEducacionesNoFormales(this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
        .subscribe(
          data => {
            this.usuarioServicio.datosEstudiosNF = data;
          }
        );
    }
  }

  detalleSolicituda(index: string) {
    this.estudioSeleccionado = this.usuarioServicio.datosEstudios[index];

    $('#staticBackdrop3').modal('show');
  }

  abrirModal() {
    $("#staticBackdropFa").modal("show");
  }

  /*Método que envia el correo de notificación de corrección de información*/
  enviarReporteNovedad() {
    if (this.formularioReporteNov.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        willOpen: () => {
          swal.showLoading();
          this.usuarioServicio.enviaCorreoNovedadRRHH(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.formularioReporteNov.get('mensaje')!.value,
            'Solicitud para Corrección de Formación Académica', this.usuarioServicio.urlKioscoDomain, this.usuarioServicio.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
            .subscribe(
              (data) => {
                //console.log(data);
                if (data) {
                  swal
                    .fire({
                      icon: "success",
                      title:
                        "Mensaje enviado exitosamente al área de nómina y RRHH para su validación.",
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#staticBackdropFa").modal("hide");
                      this.formularioReporteNov.get('mensaje')!.setValue('');
                    });
                } else {
                  swal
                    .fire({
                      icon: "error",
                      title: "No fue posible enviar el correo",
                      text: 'Por favor inténtelo de nuevo más tarde.',
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#staticBackdropFa").modal("hide");
                      this.formularioReporteNov.get('mensaje')!.setValue('');
                    });
                }
              },
              (error) => {
                swal
                  .fire({
                    icon: "error",
                    title: "Hubo un error al enviar la petición",
                    text:
                      "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                    showConfirmButton: true,
                  })
                  .then((res) => {
                    $("#staticBackdropFa").modal("hide");
                    this.formularioReporteNov.get('mensaje')!.setValue('');
                  });
              }
            );
        },
        allowOutsideClick: () => !swal.isLoading(),
      });

    } else {
      swal.fire({
        icon: "error",
        title: "No ha digitado la observación",
        text:
          "Por favor digite una observación sobre la información que se debe corregir en el sistema.",
        showConfirmButton: true
      })
    }
  }

  cargarNotificaciones() {
    this.usuarioServicio.loadAllNotifications();
  }
}
