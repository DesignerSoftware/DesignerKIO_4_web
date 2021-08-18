import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { environment } from 'src/environments/environment';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';

@Component({
  selector: 'app-ver-solici-sin-proc-persona',
  templateUrl: './ver-solici-sin-proc-persona.component.html',
  styleUrls: ['./ver-solici-sin-proc-persona.component.css']
})
export class VerSoliciSinProcPersonaComponent implements OnInit {
  formulario: FormGroup;
  solicitudSeleccionada = null;
  fotoPerfil;
  url ='assets/images/fotos_empleados/sinFoto.jpg';

  constructor(public vacacionesService: VacacionesService, private usuarioService: UsuarioService, private cadenasKioskos: CadenaskioskosappService,
     private fb: FormBuilder) {
      this.crearFormulario();
  }

  ngOnInit() {
    if (this.usuarioService.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }    
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      motivo: [''],
    })
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    console.log('usuario: ' + this.usuarioService.usuario + ' empresa: ' + this.usuarioService.empresa);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
    .subscribe(
      data => {
        console.log('getInfoUsuario', data);
        console.log(sesion['grupo']);
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          console.log('cadena: ', temp[4]) // CADENA
          this.usuarioService.cadenaConexion=temp[4];
          console.log('pages CADENA: ', this.usuarioService.cadenaConexion)
          this.cargarDatosIniciales();
          }
        }
      }
    );
  }    

  cargarDatosIniciales(){
    this.cargarDatosSolicitudesProcesadas();
  }  

  cargarDatosSolicitudesProcesadas() {
    if (this.vacacionesService.SolicitudesJefe == null) {
      this.vacacionesService.getSoliciSinProcesarAutorizador(this.usuarioService.empresa, this.usuarioService.usuario, this.usuarioService.cadenaConexion)
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
            this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg?cadena=${this.usuarioService.cadenaConexion}&usuario=${this.usuarioService.usuario}&empresa=${this.usuarioService.empresa}`;
            return this.url;
  }

  aprobarEnvio() {
    console.log('Motivo: '+this.formulario.get('motivo').value);
    let aprobado;
    swal.fire({
      title: '¿Desea aprobar la solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Sec: '+ this.solicitudSeleccionada[18]);
        /*this.vacacionesService.setNuevoEstadoSolicio(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion,
          'AUTORIZADO', this.solicitudSeleccionada[18], null, this.usuarioService.urlKioscoDomain, this.usuarioService.grupoEmpresarial)
          .subscribe(
            data => {
              aprobado = data.toString();
              console.log('Envio aprobado', data);
              if (data) {
                swal
                  .fire({
                    title: "Aprobada!",
                    text: "La solicitud ha sido Aprobada. ",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok",
                  })
                  .then((result2) => {
                    if (result2.isConfirmed) {
                      $("#exampleModalCenter").modal("hide");
                      this.reloadPage();
                    }
                  });
              } else {
                swal.fire(
                  "Ha ocurrido un problema!",
                  "La solicitud  no ha podido ser aprobada.",
                  "error"
                );
              }
            }
          );*/

          swal.fire({
            title: "Procesando solicitud, por favor espere...",
            onBeforeOpen: () => {
              swal.showLoading();
              this.vacacionesService.setNuevoEstadoSolicio(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion,
                'AUTORIZADO', this.solicitudSeleccionada[18], null, this.usuarioService.urlKioscoDomain, this.usuarioService.grupoEmpresarial)
                .subscribe(
                  (data) => {
                    console.log(data);
                    if (data) {
                      swal
                        .fire({
                          icon: "success",
                          title:
                            "¡La solicitud de vacaciones ha sido autorizada exitosamente!",
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          $("#exampleModalCenter").modal("hide");
                          this.reloadPage();
                        });
                    } else {
                      swal
                        .fire({
                          icon: "error",
                          title: "Ha ocurrido un error al autorizar la solicitud",
                          text:
                          "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                          showConfirmButton: true,
                        })
                        .then((res) => {
                          $("#exampleModalCenter").modal("hide");
                          this.reloadPage();                        
                        });
                    }
                  },
                  (error) => {
                    swal
                      .fire({
                        icon: "error",
                        title: "Ha ocurrido un error al autorizar la solicitud",
                        text:
                          "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        $("#exampleModalCenter").modal("hide");
                        this.reloadPage();                     
                      });
                  }
                );
            },
            allowOutsideClick: () => !swal.isLoading(),
          });
        }
      });
               
      }


  reloadPage() {
    this.vacacionesService.SolicitudesJefe = null;
    this.ngOnInit();
  }


  rechazarEnvio() {
    let rechazado
    swal.fire({
      title: '¿Desea rechazar la solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        /*this.vacacionesService
          .setNuevoEstadoSolicio(
            this.usuarioService.usuario,
            this.usuarioService.empresa,
            this.usuarioService.cadenaConexion,
            "RECHAZADO",
            this.solicitudSeleccionada[18],
            this.formulario.get("motivo").value,
            this.usuarioService.urlKioscoDomain,
            this.usuarioService.grupoEmpresarial
          )
          .subscribe((data) => {
            rechazado = data.toString();
            console.log("enviaoRechazado", data);
            if (data) {
              swal
                .fire({
                  title: "Rechazada!",
                  text: "La solicitud ha sido rechazada. ",
                  icon: "success",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "Ok",
                })
                .then((result2) => {
                  if (result2.isConfirmed) {
                    this.reloadPage();
                    $("#exampleModalCenter").modal("hide");
                  }
                });
            } else {
              swal.fire(
                "Ha ocurrido un problema",
                "La solicitud no ha podido ser Rechazada.",
                "error"
              );
            }
          });*/


      if (this.formulario.get('motivo').value=='') {
        swal.fire({
          title: 'Por favor especifique el motivo por el que rechaza la solicitud',
          icon: 'warning',
          showConfirmButton: true
        });

      } else {
        swal.fire({
          title: "Enviando la solicitud al sistema, por favor espere...",
          onBeforeOpen: () => {
            swal.showLoading();
            this.vacacionesService
            .setNuevoEstadoSolicio(
              this.usuarioService.usuario,
              this.usuarioService.empresa,
              this.usuarioService.cadenaConexion,
              'RECHAZADO',
              this.solicitudSeleccionada[18],
              this.formulario.get('motivo').value,
              this.usuarioService.urlKioscoDomain,
              this.usuarioService.grupoEmpresarial
            )
            .subscribe(
                (data) => {
                  console.log('solicitud rechazada:', data);
                  if (data) {
                    swal
                      .fire({
                        icon: "success",
                        title:
                          "Solicitud de vacaciones rechazada exitosamente",
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        $("#exampleModalCenter").modal("hide");
                        this.reloadPage();
                      });
                  } else {
                    swal
                      .fire({
                        icon: "error",
                        title: data["mensaje"],
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        $("#exampleModalCenter").modal("hide");
                        this.reloadPage();                        
                      });
                  }
                },
                (error) => {
                  swal
                    .fire({
                      icon: "error",
                      title: "Ha ocurrido un error al rechazar la solicitud",
                      text:
                        "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#exampleModalCenter").modal("hide");
                      this.reloadPage();                      });
                }
              );
          },
          allowOutsideClick: () => !swal.isLoading(),
        });
      }


      }

    })

  }


  procesarSolicitud() {
    console.log('procesar solicitud');
  }
}
