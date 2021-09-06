import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { environment } from 'src/environments/environment';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-procesar-ausentismos',
  templateUrl: './procesar-ausentismos.component.html',
  styleUrls: ['./procesar-ausentismos.component.css']
})
export class ProcesarAusentismosComponent implements OnInit {
  public dataFilt: any = "";
  public p: number = 1;
  public p1: number = 1;
  formulario: FormGroup;
  solicitudSeleccionada = null;
  fotoPerfil;
  url ='assets/images/fotos_empleados/sinFoto.jpg';
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  anexoSeleccionado = null;
  estadoNovEmple = null;
  msjNovEmple = null;
  
  constructor( 
    public usuarioServicio: UsuarioService, 
    private cadenasKioskos: CadenaskioskosappService,
    private usuarioService: UsuarioService, 
    private router: Router,
    public ausentismoService: AusentismosService, 
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getInfoUsuario();
    this.crearFormulario();
    this.cargarDatosSolicitudesProcesadas();
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      motivo: [''],
    })
  }
  getInfoUsuario(){
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'])
    .subscribe(
      data => {
        //console.log('getInfoUsuario', data);
        //console.log(sesion['grupo']);
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          //console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          //console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
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
    if (this.ausentismoService.SolicitudesJefe == null) {
      this.ausentismoService.getSoliciAusentSinProcesarJefe(this.usuarioService.empresa, this.usuarioService.usuario, 'ENVIADO', this.usuarioService.cadenaConexion)
        .subscribe(
          data => {
            this.ausentismoService.SolicitudesJefe = data;
            /*console.log('impresive', this.ausentismoService.SolicitudesJefe);
            console.log("Datos iniciales");
            console.log(data);*/            
          }
        );
    }
  }

  validaFechaNovedadEmpleadoXJefe(seudonimo: string, fecha: string){
    this.ausentismoService.getvalidaFechaNovedadEmpleadoXJefe(this.usuarioService.empresa, seudonimo, fecha, this.usuarioService.cadenaConexion)
        .subscribe(
          data => {
            console.log(data);
            this.estadoNovEmple=data['valida'];
            if(this.estadoNovEmple== 'SA'){
              this.msjNovEmple = 'La fecha de ausentismo coincide con otra novedad de ausentismo';
            } else if (this.estadoNovEmple== 'SV'){
              this.msjNovEmple = 'La fecha de ausentismo coincide con una novedad de vacaciones';
            } else {
              this.msjNovEmple = '';
            }
            ;
            /*console.log('impresive', this.ausentismoService.SolicitudesJefe);
            console.log("Datos iniciales");
            console.log(data);*/            
          }
        );
  }

  detalleSolicitud(index: string) {
    this.solicitudSeleccionada = this.ausentismoService.SolicitudesJefe[index];
    this.anexoSeleccionado = this.ausentismoService.SolicitudesJefe[index][21];    
    this.validaFechaNovedadEmpleadoXJefe(this.ausentismoService.SolicitudesJefe[index][22],this.ausentismoService.SolicitudesJefe[index][4]);
  }

  navigate() {
    this.router.navigate(['/ausentismos']);
  }

  cargaFoto(documento: string) {
          this.fotoPerfil = documento;
          //console.log('documento: ' + this.fotoPerfil);
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        // informa que la solicitud ya tiene novedades de nomina en ese rango de fechas 
        if(this.estadoNovEmple=='SA' || this.estadoNovEmple=='SV'){
          //console.log('Entre a validar aprobarEnvio()');
          swal.fire({
            title: this.msjNovEmple,
            text: '¿Desea continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if(result.isConfirmed){
              swal.fire({
                title: "Procesando solicitud, por favor espere...",
                onBeforeOpen: () => {
                  swal.showLoading();
                  this.ausentismoService.setNuevoEstadoSolicio(
                    this.usuarioService.usuario, 
                    this.usuarioService.empresa, 
                    this.usuarioService.cadenaConexion,
                    'AUTORIZADO', 
                    this.solicitudSeleccionada[4] ,
                    this.solicitudSeleccionada[20], 
                    null, 
                    this.usuarioService.urlKioscoDomain, 
                    this.usuarioService.grupoEmpresarial)
                    .subscribe(
                      (data) => {
                        console.log(data);
                        if (data) {
                          swal
                            .fire({
                              icon: "success",
                              title:
                                "¡La solicitud de ausentismo ha sido autorizada exitosamente!",
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
        
        } else {
          /*this.ausentismoService.setNuevoEstadoSolicio(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion,
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
                this.ausentismoService.setNuevoEstadoSolicio(
                  this.usuarioService.usuario, 
                  this.usuarioService.empresa, 
                  this.usuarioService.cadenaConexion,
                  'AUTORIZADO', 
                  this.solicitudSeleccionada[4] ,
                  this.solicitudSeleccionada[20], 
                  null, 
                  this.usuarioService.urlKioscoDomain, 
                  this.usuarioService.grupoEmpresarial)
                  .subscribe(
                    (data) => {
                      console.log(data);
                      if (data) {
                        swal
                          .fire({
                            icon: "success",
                            title:
                              "¡La solicitud de ausentismo ha sido autorizada exitosamente!",
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
      }
    });
               
      }


  reloadPage() {
    this.ausentismoService.SolicitudesJefe = null;
    this.navigate();
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
        /*this.ausentismoService
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
            this.ausentismoService
            .setNuevoEstadoSolicio(
              this.usuarioService.usuario,
              this.usuarioService.empresa,
              this.usuarioService.cadenaConexion,
              'RECHAZADO',
              this.solicitudSeleccionada[4],
              this.solicitudSeleccionada[20],
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
                          "Solicitud de ausentismo rechazada exitosamente",
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

  descargarArchivo() {
    console.log("cadenaReporte: ", this.usuarioServicio.cadenaConexion);
    console.log(
      "this.usuarioServicio.secuenciaEmpleado: " +
        this.usuarioServicio.secuenciaEmpleado
    );
    swal.fire({
      title: "Descargando reporte, por favor espere...",
      onBeforeOpen: () => {
        swal.showLoading();
        console.log("descargarReporte");
        this.ausentismoService
          .getAnexoAusentismo(
            //this.reporteServicio.reporteSeleccionado["nombreruta"],
            //this.usuarioServicio.secuenciaEmpleado,
            //this.formulario.get("enviocorreo").value,
            //this.usuarioServicio.correo,
            //this.correo,
            //this.reporteServicio.reporteSeleccionado["descripcion"],
            //this.reporteServicio.codigoReporteSeleccionado,
            this.anexoSeleccionado,
            this.usuarioServicio.empresa,
            this.usuarioServicio.cadenaConexion
            //this.usuarioServicio.usuario,
            //this.usuarioServicio.grupoEmpresarial,
            //this.usuarioServicio.urlKioscoDomain
          )
          .subscribe(
            (res) => {
              //console.log("ejemplo 1 : ",res);
              swal.fire({
                icon: "success",
                title:
                  "Reporte generado exitosamente, se descargará en un momento",
                showConfirmButton: false,
                timer: 1500,
              });
              const newBlob = new Blob([res], { type: "application/pdf" });
              let fileUrl = window.URL.createObjectURL(newBlob); // add 290920

              //if (window.navigator && window.navigator.msSaveOrOpenBlob) { 290920
              //window.navigator.msSaveOrOpenBlob(newBlob);
              if (window.navigator.msSaveOrOpenBlob) {
                // add 290920
                window.navigator.msSaveOrOpenBlob(
                  newBlob,
                  fileUrl.split(":")[1] + ".pdf"
                );
              } else {
                window.open(fileUrl);
              }
              //return;
              ///}
              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
                //this.reporteServicio.reporteSeleccionado["nombreruta"] +
                this.anexoSeleccionado +
                "_" +
                this.usuarioServicio.usuario +
                "_" +
                f.getTime() +
                ".pdf";
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );

              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            },
            (error) => {
              console.log(error);
              swal.fire(
                "Se ha presentado un error",
                "Se presentó un error al generar el reporte, por favor intentelo de nuevo más tarde!",
                "info"
              );
            }
          );
      },
      allowOutsideClick: () => !swal.isLoading(),
    });
  }
  descargarArchivo1(){
    swal.fire({
      title: '¡Botón para descargar arhivos!',
      text: "",
      icon: 'warning'

    })
  }
}
