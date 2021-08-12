import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AusentismosService } from 'src/app/services/ausentismos.service';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-reportar-ausentismo',
  templateUrl: './reportar-ausentismo.component.html',
  styleUrls: ['./reportar-ausentismo.component.css']
})
export class ReportarAusentismoComponent implements OnInit {
  fileToUpload: File = null; // variable archivo seleccionado 
  fotoPerfil;
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, private usuarioService: UsuarioService, private ausentismosService: AusentismosService, private cadenasKioskos: CadenaskioskosappService) { }
  formulario: FormGroup;
  causasAusentismos = null;
  causaSelec = null;
  claseSelec = null;
  tipoSelec = null;

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
      dias: [, [Validators.required]],
      fechafin: [],
      causa: [, Validators.required],
      codigo: [],
      clase: [],
      tipo: [],
      prorroga: [false],
      observaciones: [''],
      anexo: []
    });
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    //console.log('usuario: ' + this.usuarioService.usuario + ' empresa: ' + this.usuarioService.empresa);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'])
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
          console.log('Autorizador vacaciones: ', data['resultado']);
          this.autorizadorVacaciones = data['resultado'];
        },
        (error) => {
          console.log("se ha presentado un error al consultar autorizador vacaciones: " + JSON.stringify(error.statusText));
        }
      );
  }

  getOpcionesDiagnosticos() {
    if (!this.ausentismosService.codigosAusentismos || this.ausentismosService.codigosAusentismos == null) {
      this.ausentismosService.getCodigosAusentismos(this.usuarioService.empresa, this.usuarioService.cadenaConexion)
        .subscribe(
          data => {
            this.ausentismosService.codigosAusentismos = data;
            console.log(data);
          }
        )
    }
  }

  getProrrogas() {
    console.log("entre a validar");
    let indexCausa = this.formulario.get('causa').value;
    let secuenciaCausa = this.causasAusentismos[indexCausa].causa.secuencia;
    console.log(secuenciaCausa)
    this.ausentismosService.getProrroga(this.usuarioService.usuario, secuenciaCausa, this.usuarioService.empresa, "DEFAULT1")
      .subscribe(
        data => {
          this.ausentismosService.datosProrroga = data;
          //console.log(data);
        }
      )
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
      console.log('ERROR AL ABRIR VENTANA MODAL!!!');
      document.getElementById('exampleModal').style.display = 'block';
    }

  }

  ocultarListaCod() {
    $("#exampleModal").modal("hide");
  }

  seleccionarCodDiag(secuencia, codigo, descripcion, index) {
    this.formulario.get('codigo').setValue(codigo + " - " + descripcion);
    this.ocultarListaCod();
  }

  seleccionaPro(index) {
    //console.log('cambio');
    //console.log(this.ausentismosService.datosProrroga[index][0]);
    this.prorrogaSeleccionada = this.ausentismosService.datosProrroga[index];
    //console.log(this.prorrogaSeleccionada);
  }

  quitarSeleccionPro() {
    this.prorrogaSeleccionada = null;
  }

  validarCheckProrroga() {
    console.log('cambio');
    if (this.formulario.get('prorroga').value == false) {
      this.quitarSeleccionPro();
    }
  }

  cambioSeleccion() {
    let secCausa = this.formulario.get('causa').value;
    this.activaProrroga = false;
    console.log('index', secCausa);
    this.claseSelec = this.causasAusentismos[secCausa].causa.clase.descripcion;
    console.log('clase ' + this.claseSelec);
    this.tipoSelec = this.causasAusentismos[secCausa].causa.clase.tipo.descripcion;
    console.log('tipo ' + this.tipoSelec);
    let descripcionCausa = this.causasAusentismos[secCausa].causa.descripcion;
    console.log('causa seleccinada', descripcionCausa);
    if (descripcionCausa.indexOf("ENFERMEDAD") > -1 || this.causasAusentismos[secCausa].causa.clase.tipo.descripcion.indexOf("INCAPACIDAD") > -1) {
      console.log('Selecciono alguna causa relacionada a una enfermedad o tipo incapacidad');
      this.habilitaBtnCodDiag = true;
    } else {
      this.habilitaBtnCodDiag = false;
    }
    //let clase = this.causasAusentismos;
    //console.log(clase);
  }

  cargarCausas() {
    this.ausentismosService.getCausasEmpresa(this.usuarioService.empresa, this.usuarioService.cadenaConexion)
      .subscribe(
        data => {
          console.log('causas', data);
          this.causasAusentismos = data;
        }
      )
  }

  enviarNovedad() {
    console.log(" formulario valido", this.formulario.valid);
    console.log("Valores: ", this.formulario.controls);
    Object.values(this.formulario.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      if (this.formulario.get('dias').value <= 0) {
        swal.fire({
          title: "¡Valide la cantidad de días del ausentismo!",
          text: 'La cantidad mínima de días a reportar debe ser 1.',
          icon: "error"
        });
      } else if (this.formulario.get('prorroga').value && this.prorrogaSeleccionada == null) {
        swal.fire({
          title: "¡Seleccione una prórroga!",
          text: 'Ha seleccionado que esta reportando un ausentismo con prórroga pero no ha indicado a cual hace referencia.',
          icon: "error",
        });
      } else if (this.formulario.valid) {
        swal
          .fire({
            title: "Confirmación",
            text: "¿Esta seguro(a) de que desea enviar la novedad?",
            icon: "info",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
          })
          .then((result) => {
            if (result.value) {
              console.log("enviar solicitud");
              console.log(
                "ruta Kiosco: " + this.usuarioService.urlKioscoDomain
              );
              console.log(
                "grupoEmpresarial: " + this.usuarioService.grupoEmpresarial
              );
              let incluyeAnexo = 'N';
              if (this.formulario.get('anexo').value != null) {
                incluyeAnexo = 'S';
              }
              let indexCausa = this.formulario.get('causa').value;
              console.log('index', indexCausa);
              let secuenciaClase = this.causasAusentismos[indexCausa].causa.clase.secuencia;
              let secuenciaTipo = this.causasAusentismos[indexCausa].causa.clase.tipo.secuencia;
              let secuenciaCausa = this.causasAusentismos[indexCausa].causa.secuencia;
              let secuenciaProrroga = this.ausentismosService.datosProrroga[indexCausa][0];
              swal.fire({
                title: "Enviando la solicitud al sistema, por favor espere...",
                onBeforeOpen: () => {
                  swal.showLoading();
                  this.ausentismosService.crearNovedadAusentismo(this.usuarioService.usuario,
                    this.usuarioService.empresa, 'ENVIADO', this.formulario.get('fechainicio').value,
                    this.formulario.get('fechafin').value, this.formulario.get('dias').value,
                    secuenciaCausa, secuenciaClase,
                    secuenciaTipo, 'prorroga', this.formulario.get('observaciones').value, incluyeAnexo,
                    this.usuarioService.cadenaConexion,
                    this.usuarioService.urlKioscoDomain,
                    this.usuarioService.grupoEmpresarial)
                    .subscribe(
                      data => {
                        console.log('rta: ', data);
                      }
                    );
                },
                allowOutsideClick: () => !swal.isLoading(),
              });
            }
          });
      } else {
        console.log(this.formulario.controls);
        swal.fire({
          title: "¡Por favor valide el formulario!",
          text:
            "Por favor valide que todos los campos obligatorios del formulario estén diligenciados.",
          icon: "error",
        });
      }
    } else {
      console.log(this.formulario.controls);
      swal.fire({
        title: "¡Por favor valide el formulario!",
        text:
          "Por favor valide que todos los campos obligatorios del formulario estén diligenciados.",
        icon: "error",
      });
    }
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      console.log('archivo seleccionado');
      const file = event.target.files[0];
      console.log(file);
      this.formulario.get('anexo').setValue(file);
      if (file.type === 'application/pdf') {
        console.log('Es .pdf');
        let sizeArchivo = (file.size / 1048576);
        let sizeArchivo2 = parseFloat(parseFloat(sizeArchivo.toString()).toFixed(2));
        this.msjValidArchivoAnexo = '';
        if (sizeArchivo > 1) {
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

}
