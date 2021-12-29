import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
//import { KiopersonalizacionesService } from 'src/app/services/kiopersonalizaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { ReportesService } from 'src/app/services/reportes.service';
//import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';


@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  fotoPerfil;
  url = 'assets/images/fotos_empleados/sinFoto.jpg';
  formulario: FormGroup;
  public dataFilt: any = "";
  public p1: number = 1;

  // datos = null;

  constructor(
    private fb: FormBuilder,
    public usuarioServicio: UsuarioService,
    private cadenasKioskos: CadenaskioskosappService,
    private opcionesKioskosServicio: OpcionesKioskosService,
    public reporteServicio: ReportesService) {
    this.crearFormulario();
  }

  ngOnInit() {
    //this.cargaFoto();
    //console.log('datos en info:',this.usuarioServicio.cadenaConexion);
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
  }

  cargarDatosIniciales() {
    this.cargarDatos();
    this.filtrarOpcionesReportes();
    this.cargarDatosFamilias();
    this.cargarTelefonosEmpleado();
    this.obtenerAnexosDocumentos();
    //this.cargaFoto();
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    //console.log('grupo en datos:' , this.usuarioServicio.setUrlKiosco(sesion['urlKiosco'],));
    //console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        data => {
          //console.log('getInfoUsuario', data);
          //console.log(sesion['grupo']);
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              //console.log('cadena: ', temp[4]) // CADENA
              this.usuarioServicio.cadenaConexion = temp[4];
              //console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  crearFormulario() {
    this.formulario = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  cargarDatos() {
    if (this.usuarioServicio.datosPersonales == null) {
      this.usuarioServicio.getDatosUsuario(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.usuarioServicio.datosPersonales = data;
            //console.log('datos', this.usuarioServicio.datosPersonales);
          }
        );
    }
  }

  cargarDatosFamilias() {
   //console.log(this.usuarioServicio.cadenaConexion);
    if (this.usuarioServicio.datosFamilia == null) {
      this.usuarioServicio.getDatosUsuarioFamilia(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.usuarioServicio.datosFamilia = data;
            //console.log('datosFam', this.usuarioServicio.datosFamilia);
          }
        );
    }
  }

  cargarTelefonosEmpleado() {
   //console.log(this.usuarioServicio.cadenaConexion);
    if (this.usuarioServicio.telefonosEmpleado == null) {
      this.usuarioServicio.getTelefonosEmpleado(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.usuarioServicio.telefonosEmpleado = data;
            //console.log('telefonos', this.usuarioServicio.telefonosEmpleado);
          }
        );
    }
  }
  obtenerAnexosDocumentos() {
    this.usuarioServicio.getObtenerAnexosDocumentos(this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
      .subscribe(
        data => {
          this.usuarioServicio.documentosAnexos = data;
          //console.log('datos documentos ' +data);
        }
      );
  }
  descargarAnexo(index: string) {
    this.usuarioServicio.getObtenerAnexosDocumentos(this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
      .subscribe(
        data => {
          this.usuarioServicio.documentosAnexos = data;
          //console.log('datos documentos ' +data);
        }
      );
  }


  FactorRHp(n) {
    let resultado;
    if (n != 'N') { // true
      resultado = 'POSITIVO';
    } else {
      resultado = 'NEGATIVO';
    }
    return resultado;
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (this.usuarioServicio.carnetSeleccionado == null) {
     //console.log('entre a filtrarOpcionesReportes2');
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion)
        .subscribe((data) => {
         //console.log('opciones Consultadas', data);
          opkTempo = data;
          this.usuarioServicio.carnetSeleccionado = opkTempo.filter(
            //(opcKio) => opcKio['opcionkioskopadre']['codigo'] === '30'
            (opcKio) => {
              if (opcKio.opcionkioskopadre && opcKio.opcionkioskopadre.codigo === '10' && opcKio.codigo == '13') {
                return true;
              }
            }
          );
          //console.log('opciones Filtradas', this.usuarioServicio.carnetSeleccionado);
        });
    } 
    this.cargarFotoActual();
  }

  abrirModal() {
    $("#staticBackdrop").modal("show");
  }

  descargarDocumento(index: string) {
    this.usuarioServicio.documentoSeleccionado = index;
    swal.fire({
      title: "Descargando reporte, por favor espere...",
      onBeforeOpen: () => {
        swal.showLoading();
        this.usuarioServicio
          .getDescargarArchivo(
            this.usuarioServicio.usuario,
            this.usuarioServicio.cadenaConexion,
            this.usuarioServicio.empresa,
            this.usuarioServicio.documentoSeleccionado
          )
          .subscribe(
            (res) => {
              swal.fire({
                icon: "success",
                title:
                  "Reporte generado exitosamente, se descargará en un momento",
                showConfirmButton: false,
                timer: 1500,
              });
              const newBlob = new Blob([res], { type: "application/pdf" });
              let fileUrl = window.URL.createObjectURL(newBlob); // add 290920
              if (window.navigator.msSaveOrOpenBlob) {
                //add 290920
                window.navigator.msSaveOrOpenBlob(
                  newBlob,
                  fileUrl.split(":")[1] + ".pdf"
                );
              } else {
                window.open(fileUrl);
              }

              //For other browsers:
              //Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
                //this.reporteServicio.reporteSeleccionado["nombreruta"] +
                this.usuarioServicio.documentoSeleccionado +
                "_" +
                this.usuarioServicio.usuario +
                "_" +
                f.getTime() +
                ".pdf";
              //this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );

              setTimeout(function () {
                //For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            },
            (error) => {
             //console.log(error);
              swal.fire(
                "Se ha presentado un error",
                "Se presentó un error al descargar el documento, por favor intentelo de nuevo más tarde!",
                "info"
              );
            }
          );
      },
      allowOutsideClick: () => !swal.isLoading(),
    });
  }

  enviarReporteNovedad() {
    //console.log('enviar', this.formulario.controls);
    if (this.formulario.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          this.usuarioServicio.enviaCorreoNovedadRRHH(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.formulario.get('mensaje').value,
            'Solicitud para Corrección de Datos Personales', this.usuarioServicio.urlKioscoDomain, this.usuarioServicio.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
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
                      $("#staticBackdrop").modal("hide");
                      this.formulario.get('mensaje').setValue('');
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
                      $("#staticBackdrop").modal("hide");
                      this.formulario.get('mensaje').setValue('');
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
                    $("#staticBackdrop").modal("hide");
                    this.formulario.get('mensaje').setValue('');
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

  descargarCarnet() {
    //console.log(this.usuarioServicio.datosPersonales[0][17])
    //console.log("empresa ", this.usuarioServicio.empresa)
    //console.log(this.usuarioServicio.carnetSeleccionado[0]["nombreruta"]);    
    this.cargarFotoActual();
    if (!this.usuarioServicio.existefotoPerfil) {
      swal
        .fire({
          icon: "error",
          title: "Por favor actualice su foto",
          text:"",
          showConfirmButton: true,
        })
    } else {
      swal.fire({
        title: "Generando carnet, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          //console.log("descargarReporte");
          this.usuarioServicio.getGenerarQR(
            this.usuarioServicio.usuario,
            this.usuarioServicio.telefonosEmpleado[0][0],
            this.usuarioServicio.datosPersonales[0][12],
            this.usuarioServicio.datosPersonales[0][20],
            this.usuarioServicio.datosPersonales[0][17],
            this.usuarioServicio.cadenaConexion,
            this.usuarioServicio.empresa
          )
            .subscribe(
              (data) => {
               //console.log(data);
                this.reporteServicio
                  .generarReporte(
                    this.usuarioServicio.carnetSeleccionado[0]["nombreruta"],
              /*this.formulario.get("enviocorreo").value*/false,
                    this.usuarioServicio.correo,
                    //this.correo,
                    this.usuarioServicio.carnetSeleccionado[0]["descripcion"],
                    this.usuarioServicio.carnetSeleccionado[0]["codigo"],
                    this.usuarioServicio.empresa,
                    this.usuarioServicio.cadenaConexion,
                    this.usuarioServicio.usuario,
                    this.usuarioServicio.grupoEmpresarial,
                    this.usuarioServicio.urlKioscoDomain
                  )
                  .subscribe(
                    (res) => {
                      //console.log(res);
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
                        this.reporteServicio.reporteSeleccionado["nombreruta"] +
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
                     //console.log(error);
                      swal.fire(
                        "Se ha presentado un error",
                        "Se presentó un error al generar el reporte, por favor intentelo de nuevo más tarde!",
                        "info"
                      );
                    }
                  );
              },
              (error) => {
                swal
                  .fire({
                    icon: "error",
                    title: "Hubo un error al generar el carnet",
                    text:
                      "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                    showConfirmButton: true,
                  })
                  .then((res) => {
                    $("#staticBackdrop").modal("hide");
                    this.formulario.get('mensaje').setValue('');
                  });
              }
            );
        },
        allowOutsideClick: () => !swal.isLoading(),
      });

    }
    
  }
  cargarFotoActual() {
    this.usuarioServicio.getValidaFoto(this.usuarioServicio.usuario, this.usuarioServicio.cadenaConexion, this.usuarioServicio.empresa)
      .subscribe(
        data => {
          //console.log('data: ' , data);
          this.usuarioServicio.existefotoPerfil = data;
          //console.log(this.usuarioServicio,existefotoPerfil);
        }
      );
  }
}