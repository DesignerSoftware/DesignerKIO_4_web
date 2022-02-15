import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-reportar-ausentismo',
  templateUrl: './reportar-ausentismo.component.html',
  styleUrls: ['./reportar-ausentismo.component.css']
})
export class ReportarAusentismoComponent implements OnInit {
  fileToUpload: File = null; // variable archivo seleccionado 
  habilitaBtnCargar = false;
  msjValidArchivoAnexo = '';
  prorrogaSeleccionada = null;
  cadenaProvisional = null;
  public dataFilt: any = "";
  public p: number = 1;
  public p1: number = 1;
  public autorizadorVacaciones = '...';
  habilitaBtnCodDiag = false;
  activaProrroga = false;
  estadoNovEmple = null;
  msjNovEmpleTitle = null;
  msjNovEmpleDetalle = null;
  nomArchivo = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, private router: Router,
    private route: ActivatedRoute, public usuarioService: UsuarioService,
     public ausentismosService: AusentismosService, private cadenasKioskos: CadenaskioskosappService,
      ) { }
  formulario: FormGroup;
  formularioReporteNov: FormGroup;
  causasAusentismos = null;
  causaSelec = null;
  claseSelec = null;
  tipoSelec = null;
  secCodDiagSelec = null;

  ngOnInit() {
    this.crearFormulario();
    if (this.usuarioService.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
  }

  crearFormulario() {
    //console.log("crearFormulario()");
    this.formulario = this.fb.group({
      fechainicio: [, Validators.required],
      fechainiciodt: [,],
      dias: [, [Validators.required]],
      fechafin: [],
      causa: [, Validators.required],
      codigo: [],
      clase: [],
      tipo: [],
      prorroga: [false],
      observaciones: [''],
      anexo: [null, []]
    });

    this.formularioReporteNov = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    //console.log('session token localstorage: ', sesion['JWT']);
    //console.log('usuario: ' + this.usuarioService.usuario + ' empresa: ' + this.usuarioService.empresa);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'], this.usuarioService.urlKioscoDomain)
      .subscribe(
        data => {
          //console.log('getInfoUsuario', data);
          //console.log(sesion['grupo']);
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              //console.log('cadena: ', temp[4]) // CADENA
              this.usuarioService.cadenaConexion = temp[4];
              this.cadenaProvisional = temp[4];
              //console.log('pages CADENA: ', this.usuarioService.cadenaConexion)
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  cargarDatosIniciales() {
    this.cargarCausas();
    this.getOpcionesDiagnosticos();
    this.consultarAutorizadorAusentismos();
  }

  consultarAutorizadorAusentismos() {
    // Consultar autorizador de ausentismos
    this.ausentismosService
      .getAutorizadorAusentismos(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe(
        (data) => {
          //console.log('Autorizador vacaciones: ', data['resultado']);
          this.autorizadorVacaciones = data['resultado'];
        },
        (error) => {
          //console.log("se ha presentado un error al consultar autorizador vacaciones: " + JSON.stringify(error.statusText));
        }
      );
  }

  getOpcionesDiagnosticos() {
    if (!this.ausentismosService.codigosAusentismos || this.ausentismosService.codigosAusentismos == null) {
      this.ausentismosService.getCodigosAusentismos(this.usuarioService.empresa, this.usuarioService.cadenaConexion)
        .subscribe(
          data => {
            this.ausentismosService.codigosAusentismos = data;
            //console.log(data);
          }
        )
    }
  }

  getProrrogas() {
    if (this.formulario.get('causa').value != null || this.formulario.get('causa').value != '') {
      //console.log("entre a validar");
      let indexCausa = this.formulario.get('causa').value;
      let secuenciaCausa = this.causasAusentismos[indexCausa].causa.secuencia;
      //console.log(secuenciaCausa)
      this.ausentismosService.getProrroga(this.usuarioService.usuario, secuenciaCausa, this.formulario.get('fechainicio').value, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
        .subscribe(
          data => {
            this.ausentismosService.datosProrroga = data;
            //console.log(data);
          }
        )
    } else {
      swal.fire(
        'No ha seleccionado la causa del ausentismo',
        'Para seleccionar una prorroga debe seleccionar primero la causa de ausentismo',
        'error'
      )
    }
  }

  mostrarListaCod() {
    //alert('Hola');
    //document.getElementById('staticBackdropRA').style.display = 'block';
    /*jQuery.noConflict();
(function( $ ) {
  $(function() {
    // More code using $ as alias to jQuery
    $('button').click(function(){
        $('#exampleModal').modal('show');
    });
  });
})(jQuery);*/

    try {
      $("#exampleModal").modal("show");
    } catch (error) {
      //console.log('ERROR AL ABRIR VENTANA MODAL!!!: ' , error);
      //document.getElementById('exampleModal').style.display = 'block';
    }

  }

  // Desplegar ventana para reportar información importante
  abrirModal() {
    //console.log('Se desplego la venta amodal');
    $("#exampleModalRN").modal("show");
  }

  enviarReporteNovedad() {
    //console.log('enviar', this.formularioReporteNov.controls);
    if (this.formularioReporteNov.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          this.usuarioService.enviaCorreoNovedadRRHH(this.usuarioService.usuario, this.usuarioService.empresa, this.formularioReporteNov.get('mensaje').value,
            'Solicitud de Corrección Jefe Inmediato', this.usuarioService.urlKioscoDomain, this.usuarioService.grupoEmpresarial, this.usuarioService.cadenaConexion)
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
                      $("#exampleModalRN").modal("hide");
                      this.formularioReporteNov.get('mensaje').setValue('');
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
                      $("#exampleModalRN").modal("hide");
                      this.formularioReporteNov.get('mensaje').setValue('');
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
                    $("#exampleModalRN").modal("hide");
                    this.formularioReporteNov.get('mensaje').setValue('');
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

  ocultarListaCod() {
    $("#exampleModal").modal("hide");
  }

  seleccionarCodDiag(secuencia, codigo, descripcion, index) {
    this.formulario.get('codigo').setValue(codigo + " - " + descripcion);
    this.secCodDiagSelec = secuencia;
    //console.log('SecDiagnostico', this.secCodDiagSelec);
    this.ocultarListaCod();
  }

  seleccionaPro(index) {
    //console.log('cambio');
    //console.log(this.ausentismosService.datosProrroga[index][0]);
    this.formulario.get('fechainicio').setValue('');
    this.prorrogaSeleccionada = this.ausentismosService.datosProrroga[index];
    this.formulario.get('fechainicio').setValue(this.ausentismosService.datosProrroga[index][1]);
    this.cargaFechaFin();
   //console.log('this.prorrogaSeleccionada', this.ausentismosService.datosProrroga[index][1]);
   //console.log('this.prorrogaSeleccionada', this.prorrogaSeleccionada);
    //console.log(this.prorrogaSeleccionada);
  }

  quitarSeleccionPro() {
    this.prorrogaSeleccionada = null;
    this.formulario.get('fechainicio').setValue('');
  }

  validarCheckProrroga() {
   //console.log('cambio');
    this.formulario.get('fechafin').setValue(null);
    if (this.formulario.get('prorroga').value == false) {
      this.quitarSeleccionPro();
    } else {
      this.formulario.get('fechainicio').setValue('');
    }
  }

  /*Método que se ejecuta cuando se cambia la selección de la causa de ausentismo*/
  cambioSeleccion() {
    this.formulario.get('prorroga').setValue(false); // Quitar check de prorroga
    this.prorrogaSeleccionada = null; // Quitar la prorroga seleccionada
    let secCausa = this.formulario.get('causa').value;
    this.activaProrroga = false;
    //console.log('index', secCausa);
    this.claseSelec = this.causasAusentismos[secCausa].causa.clase.descripcion;
    //console.log('clase ' + this.claseSelec);
    this.tipoSelec = this.causasAusentismos[secCausa].causa.clase.tipo.descripcion;
    //console.log('tipo ' + this.tipoSelec);
    let descripcionCausa = this.causasAusentismos[secCausa].causa.descripcion;
    //console.log('causa seleccinada', descripcionCausa);
    if (descripcionCausa.indexOf("ENFERMEDAD") > -1 || this.causasAusentismos[secCausa].causa.clase.tipo.descripcion.indexOf("INCAPACIDAD") > -1) {
     //console.log('Selecciono alguna causa relacionada a una enfermedad o tipo incapacidad');
      this.habilitaBtnCodDiag = true;
    } else {
      this.habilitaBtnCodDiag = false;
    }

    this.cargaFechaFin();
    //let clase = this.causasAusentismos;
    //console.log(clase);
  }

  validaFechaNovedadEmpleadoXJefe() {
    this.ausentismosService.getvalidaFechaNovedadEmpleadoXJefe(this.usuarioService.empresa, this.usuarioService.usuario, this.formulario.get('fechafin').value, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
         //console.log(data);
          this.estadoNovEmple = data['valida'];
          if (this.estadoNovEmple == 'KSA') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'Ya reportaste una novedad de ausentismo en ese rango de fechas';
          }
          else if (this.estadoNovEmple == 'SA') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'La fechas coinciden con otra novedad de ausentismo. Por favor validarlo con el área de nómina y recursos humanos de su empresa.';
          } else if (this.estadoNovEmple == 'SV') {
            this.msjNovEmpleTitle = '¡Rango de fechas no válido!';
            this.msjNovEmpleDetalle = 'La fecha de ausentismo coincide con una novedad de vacaciones';
          } else {
            this.msjNovEmpleTitle = '';
            this.msjNovEmpleDetalle = '';
          }
          ;
          /*console.log('impresive', this.ausentismoService.SolicitudesJefe);
         //console.log<("Datos iniciales");
          console.log(data);*/
        }
      );
  }

  cargarCausas() {
    this.ausentismosService.getCausasEmpresa(this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
         //console.log('causas', data);
          this.causasAusentismos = data;
        }
      )
  }

  cargaFechaFin() {
    this.formulario.get('fechafin').setValue('');
    let indexCausa = this.formulario.get('causa').value;
    let secuenciaCausa = this.causasAusentismos[indexCausa].causa.secuencia;
    if (this.formulario.get('causa').value != '' && this.formulario.get('causa').value != null
      && this.formulario.get('dias').value > 0 && this.formulario.get('dias').value != null
      && this.formulario.get('fechainicio').value != null && this.formulario.get('fechainicio').value != '') {
        //let d = new Date(this.formulario.get("fechainicio").value);
     //console.log("fecha inicio ", new Date(this.formulario.get('fechainicio').value));
     //console.log("fecha inicio2 ", this.formulario.get('fechainicio').value);
      this.ausentismosService.getFechaFinAusentismo(this.usuarioService.tokenJWT, this.usuarioService.usuario, this.usuarioService.empresa,
        this.formatoddmmyyyy(this.formulario.get('fechainicio').value), this.formulario.get('dias').value,
        secuenciaCausa, this.usuarioService.cadenaConexion)
        .subscribe(
          data => {
           //console.log(data);
            this.formulario.get('fechafin').setValue(data['fechafin']);
            this.asigFecha();
          }
        )
    }
  }

  validaFecha() {
    //console.log("validaFecha ", this.formulario.get("fechainicio").value);
    let fechaInicio = this.formatoddmmyyyy(
      this.formulario.get("fechainicio").value
    );
    //console.log("validaFecha parseada ", fechaInicio);
    this.ausentismosService
      .validaFechaInicioAusent(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        fechaInicio, this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        //console.log("validaFecha: ", data["valido"]);
        //console.log(data);
        if (data["valido"]) {
          //this.actualizaCampos();
          //console.log('estres')
          this.cargaFechaFin();
        } else {
          this.formulario.get("fechainicio").setErrors({ noValido: true });
          swal.fire({
            icon: "error",
            title: "¡Por favor verifique la fecha de inicio!",
            text: data["mensaje"],
            showConfirmButton: true,
          });
          this.formulario.get("fechafin").setValue("");
        }
      });
  }

  
  enviarNovedad() {
    //console.log(" formulario valido", this.formulario.valid);
    //console.log("Valores: ", this.formulario.controls);
    console.log('value adjunto: ' , this.formulario.get('anexo').value, ' dias: ', this.formulario.get('dias').value);    
    Object.values(this.formulario.controls).forEach((control) => {
      control.markAsTouched();
    });
    this.validaFechaNovedadEmpleadoXJefe();
    if (this.formulario.valid) {
      let indexCausa = this.formulario.get('causa').value;
      console.log('codigoCausa', this.causasAusentismos[indexCausa].causa.codigo);
      if (this.formulario.get('dias').value <= 0) {
        swal.fire({
          title: "¡Valide la cantidad de días del ausentismo!",
          text: 'La cantidad mínima de días a reportar debe ser 1.',
          icon: "error"
        });
      } else if (this.formulario.get('dias').value >= 2 && this.causasAusentismos[indexCausa].causa.codigo==="54") {
        swal.fire({
          title: "¡Ha solicitado mas de un dia familiar.!",
          //text: 'Ha solicitado mas de un dia familiar.',
          icon: "error",
        });
      } else if (this.formulario.get('prorroga').value && this.prorrogaSeleccionada == null) {
        swal.fire({
          title: "¡Seleccione una prórroga!",
          text: 'Ha seleccionado que esta reportando un ausentismo con prórroga pero no ha indicado a cual hace referencia.',
          icon: "error",
        });
      } else if ((this.formulario.get('anexo').value != null && this.formulario.get('anexo').value != '') && (!this.validaTipoArchivoAnexo() || !this.validaSizeAnexo())) {
        if (!this.validaSizeAnexo()) {
          swal.fire('Tamaño de archivo demasiado grande', 'Por favor seleccione un archivo de máximo 5MB', 'error');
        } else if (!this.validaTipoArchivoAnexo()) {
          swal.fire('Tipo de archivo no válido', 'Por favor seleccione un archivo con extensión .pdf', 'error');
        }
      } /*else if ((this.formulario.get('anexo').value == null || this.formulario.get('anexo').value == '') && this.formulario.get('dias').value > 2){
        swal.fire({title: "Aviso",text: "Por favor anexa un documento soporte, debido a que la solicitud supera los dos días de ausentismo", icon: "warning"})
      }*/ else if (this.formulario.valid) {
        let html, foot;
        if ( this.formulario.get('dias').value > 2 && this.causasAusentismos[indexCausa].causa.codigo!=="54"){
          html ='Por favor hacer llegar al área de talento humano o área encargada los documentos físicos originales de la incapacidad e historia clínica debido a que su incapacidad supera los dos días de ausentismo.<br>'
          foot = '¿Esta seguro(a) de que desea enviar la novedad?';
        } else {
          html ='¿Esta seguro(a) de que desea enviar la novedad?'
          foot = '';
        }
        swal
          .fire({
            title: "Aviso",
            html: html,
            icon: "warning",
            footer: foot,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
          })
          .then((result) => {
            if (result.value) {
              //console.log("enviar solicitud");
              /* console.log(
                "ruta Kiosco: " + this.usuarioService.urlKioscoDomain
              );
              console.log(
                "grupoEmpresarial: " + this.usuarioService.grupoEmpresarial
              ); */
              let incluyeAnexo = 'N';
              if (this.formulario.get('anexo').value != null && this.formulario.get('anexo').value != "") {
                incluyeAnexo = 'S';
              }
              //console.log('index', indexCausa);
              console.log('causasAusentismos', this.causasAusentismos);
              let secuenciaClase = this.causasAusentismos[indexCausa].causa.clase.secuencia;
              let secuenciaTipo = this.causasAusentismos[indexCausa].causa.clase.tipo.secuencia;
              let secuenciaCausa = this.causasAusentismos[indexCausa].causa.secuencia;
              let codCausa = this.causasAusentismos[indexCausa].causa.codigo;
              let secuenciaProrroga = null;
              //console.log('fecha de inicio ', this.formulario.get('fechainicio').value)
              if (this.prorrogaSeleccionada && this.prorrogaSeleccionada != null && this.prorrogaSeleccionada != [] && this.formulario.get('prorroga')) {
                secuenciaProrroga = this.prorrogaSeleccionada[0];
              }
              //console.log('prorrogaSeleccionada', secuenciaProrroga);
              //console.log('estado de mensaje ', this.estadoNovEmple);
              /* si la fecha de solicitud coincide con alguna novedad anterior */
              if (this.estadoNovEmple == 'KSA' || this.estadoNovEmple == 'SA' || this.estadoNovEmple == 'SV') {
                swal.fire({
                  title: this.msjNovEmpleTitle,
                  text: this.msjNovEmpleDetalle,
                  icon: 'warning',
                }).then(() => {
                  this.router.navigate(['/ausentismos']);
                });
              } else {
                swal.fire({
                  title: "Enviando la solicitud al sistema, por favor espere...",
                  onBeforeOpen: () => {
                    swal.showLoading();
                    this.ausentismosService.crearNovedadAusentismo(
                      this.usuarioService.tokenJWT,
                      this.usuarioService.usuario,
                      this.usuarioService.empresa,
                      'ENVIADO',
                      this.formatoddmmyyyy(this.formulario.get('fechainicio').value),
                      this.formulario.get('fechafin').value,
                      this.formulario.get('dias').value,
                      secuenciaCausa, this.secCodDiagSelec,
                      secuenciaClase,
                      secuenciaTipo, secuenciaProrroga,
                      this.formulario.get('observaciones').value,
                      incluyeAnexo,
                      this.usuarioService.cadenaConexion,
                      this.usuarioService.urlKioscoDomain,
                      this.usuarioService.grupoEmpresarial,
                      codCausa)
                      .subscribe(
                        data => {
                         //console.log('rta: ', data);
                          if (data["NovedadCreada"]) {
                            swal
                              .fire({
                                icon: "info",
                                title:
                                  "Validando novedad en el sistema...",
                                showConfirmButton: false,
                                timer: 1500
                              })
                              .then((res) => {
                                //this.router.navigate(["/ausentismos"]);
                                // Si se registro correctamente la novedad, subir el anexo:
                                if (incluyeAnexo == 'S') {
                                  //console.log('Novedad reportada incluye anexo');
                                  this.subirAnexo(data["anexo"], data["solicitud"]);
                                } else {
                                  //console.log('Novedad reportada NO incluye anexo');
                                 //console.log('solicitud creada: ' + data["solicitud"])
                                  this.enviarCorreoNovedad(data["solicitud"]);
                                }

                              });
                          } else {
                            swal
                              .fire({
                                icon: "error",
                                title: data["mensaje"],
                                showConfirmButton: true,
                              })
                              .then((res) => {
                                this.router.navigate(["/ausentismos"]);
                              });
                          }
                        }
                      );
                  },
                  allowOutsideClick: () => !swal.isLoading(),
                });
              }
            }
          });
      }
    } else {
      //console.log(this.formulario.controls);
      swal.fire({
        title: "¡Por favor valide el formulario!",
        text:
          "Por favor valide que todos los campos obligatorios del formulario estén diligenciados.",
        icon: "error",
      });
    }
  }

  subirAnexo(nombreAnexo: string, secKioSoliciAusentismo: string) {
    const formData = new FormData();
    formData.append('fichero', this.formulario.get('anexo').value, nombreAnexo + '.pdf');

    this.http
      .post<any>(
        `${environment.urlKioskoReportes}ausentismos/cargarAnexoAusentismo?seudonimo=${this.usuarioService.usuario}&solicitud=${secKioSoliciAusentismo}&nit=${this.usuarioService.empresa}&cadena=${this.usuarioService.cadenaConexion}`, formData
      )
      .subscribe(
        (data) => {
          //console.log(data);
        },
        (error) => {
          if (error.status === 200) {
            swal
              .fire({
                icon: 'success',
                title: 'Se ha subido el documento anexo exitosamente.',
                showConfirmButton: false,
                timer: 1500
              })
              .then((result) => {
                /* setTimeout(function(){
                   swal.close();
                   }, 2000);*/
                //alert('hola');
                this.enviarCorreoNovedad(secKioSoliciAusentismo);
                //this.router.navigated = false;
                //this.router.navigate([this.router.url]);
              });
          } else if (error.status !== 200) {
            swal
              .fire({
                icon: 'error',
                title: 'Se ha presentado un error',
                text:
                  'No se ha podido cargar el archivo, por favor inténtalo de nuevo más tarde.',
                showConfirmButton: true,
              })
              .then((result) => {
                //this.router.navigated = false;
                //this.router.navigateByUrl('/home');
              });
          }
        }
      );
    //console.log(this.formulario.value);
  }

  enviarCorreoNovedad(secSoliciAusentismo: string) {
    //console.log('grupoempresarial ', this.usuarioService.grupoEmpresarial);
    //console.log('cadenaConexion', this.usuarioService.cadenaConexion);
    swal.fire({
      title: "Enviando la solicitud al sistema, por favor espere...",
      onBeforeOpen: () => {
        swal.showLoading();
        this.ausentismosService.enviarCorreoNuevaNovedad(
          this.usuarioService.usuario,
          this.usuarioService.empresa,
          secSoliciAusentismo,
          this.formulario.get('observaciones').value,
          "Asunto prueba",
          this.usuarioService.urlKioscoDomain,
          this.usuarioService.grupoEmpresarial,
          this.usuarioService.cadenaConexion
        )
          .subscribe(
            data => {
              //console.log(data);
              if (data) {
                swal.fire({
                  icon: 'success',
                  title: 'Su novedad de ausentismo ha sido reportada exitosamente',
                  showConfirmButton: true
                }).then((result) => {
                  this.router.navigateByUrl('/ausentismos');
                });
              } else {
                swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error al reportar su novedad de ausentismo',
                  text: 'Por favor intentelo de nuevo más tarde, si el problema persiste comuniquese con el área de nómina y/o Talento humano de su empresa.',
                  showConfirmButton: true
                }).then((result) => {
                  this.router.navigateByUrl('/ausentismos');
                });
              }
            }
          )
      },
      allowOutsideClick: () => !swal.isLoading(),
    });
  }

  formatoddmmyyyy(fecha) {
    let anio = fecha.substring(0, 4);
    let mes = fecha.substring(5, 7);
    let dia = fecha.substring(8, 11);
    let ensamble = dia + "/" + mes + "/" + anio;
    return ensamble;
  }

  formatommddyyyy(fecha) {
    //console.log(fecha);
    var momentVariable = moment(fecha, 'DD/MM/YYYY');
    var stringvalue = momentVariable.format('YYYY-MM-DD');
    //console.log(stringvalue); // outputs 2018-08-25  
    return stringvalue;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      //console.log('archivo seleccionado');
      const file = event.target.files[0];
      //console.log(file);
      this.formulario.get('anexo').setValue(file);
      //console.log('Name File' + file.name);
      if (this.validaTipoArchivoAnexo()) {
        //console.log('Es .pdf');
        this.msjValidArchivoAnexo = '';
        this.nomArchivo = this.formulario.get('anexo').value.name;
        if (!this.validaSizeAnexo()) {
          this.msjValidArchivoAnexo = 'El tamaño del archivo es demasiado grande. Seleccione un archivo de máximo 5MB.'
          swal.fire('Tamaño de archivo demasiado grande', 'Por favor seleccione un archivo de máximo 5MB', 'error');
        }
      } else {
        this.msjValidArchivoAnexo = 'El tipo de archivo seleccionado no es válido. Seleccione un archivo con extensión .pdf';
        swal.fire('Tipo de archivo no válido', 'Por favor seleccione un archivo con extensión .pdf', 'error');
      }

    } else {
      swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        showConfirmButton: true
      });
    }
  }

  // Método que retorna true si el tamaño del archivo no supera los 5MB
  validaSizeAnexo() {
    let valid = false;
    let sizeArchivo = (this.formulario.get('anexo').value.size / 1048576);
    let sizeArchivo2 = parseFloat(parseFloat(sizeArchivo.toString()).toFixed(2));
    if (sizeArchivo2 <= 5) {
      valid = true;
      //console.log('El anexo no supera los 5 MB');
    }
    return valid;
  }

  // Método que retorna true si el archivo anexo corresponde a un pdf
  validaTipoArchivoAnexo() {
    let valid = false;
    if (this.formulario.get('anexo').value.type == 'application/pdf') {
      valid = true;
      //console.log('Es PDF');
    }
    return valid;
  }

  // Método que quitar  el archivo seleccionado del campo de anexo,
  quitarArchivoSeleccionado() {
    //console.log('Quitar archivo seleccionado');
    //var file=(<HTMLInputElement>document.getElementById('file'));
    //file.value=null;
    this.msjValidArchivoAnexo = '';
    this.formulario.get('anexo').setValue('');
    this.nomArchivo = null;
  }
  // 211019 dar formato a fecha 
  asigFecha() {
    //console.log("mydate1()");
    /*let d = new Date(this.formulario.get("fechainicio").value);
    let dt = d.getDate();
    let mn = d.getMonth();
    mn++;
    let yy = d.getFullYear();*/
    //console.log("date ", d + " " + dt + " " + mn + " " + yy);
    //let temp = dt + '/' + mn + '/' + yy;
    //console.log('temp ', temp)
    let datetemp = this.formatoddmmyyyy(this.formulario.get('fechainicio').value);
    //console.log('fecha: ' , datetemp)
    this.formulario.get("fechainiciodt").setValue(datetemp);
    document.getElementById("fechainiciodt").hidden = false;
    document.getElementById("fechainicio").hidden = true;
  }

  backDt() {
    //console.log("prueba1()");
    document.getElementById("fechainiciodt").hidden = true;
    document.getElementById("fechainicio").hidden = false;
  }

  backText() {
    //console.log("prueba2()");
    document.getElementById("fechainiciodt").hidden = false;
    document.getElementById("fechainicio").hidden = true;
  }
}
