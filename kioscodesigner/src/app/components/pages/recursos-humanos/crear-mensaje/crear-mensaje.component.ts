import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { RecursosHumanosService } from 'src/app/services/recursoshumanos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crear-mensaje',
  templateUrl: './crear-mensaje.component.html',
  styleUrls: ['./crear-mensaje.component.scss']
})
export class CrearMensajeComponent implements OnInit {

  habilitaBtnCargar = false;
  msjValidArchivoAnexo = '';
  msjNovEmpleTitle = null;
  msjNovEmpleDetalle = null;
  nomArchivo = null;
  formato = "";
  url = "";
  formulario: FormGroup = {} as FormGroup;
  //formularioReporteNov: FormGroup;
  causasAusentismos = null;
  causaSelec = null;
  claseSelec = null;
  tipoSelec = null;
  secCodDiagSelec = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, private router: Router,
    private route: ActivatedRoute, public usuarioService: UsuarioService,
    public recursosHumanosService: RecursosHumanosService, private cadenasKioskos: CadenaskioskosappService,
  ) { }

  ngOnInit() {
    this.crearFormulario();
    if (this.usuarioService.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      titulo: [, Validators.required],
      descripcion: [, Validators.required],
      fechainicio: [, Validators.required],
      fechafin: [, Validators.required],
      anexo: [null, []],
      enviocorreo: [false]
    });
  }

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() {
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        data => {
          if (Array.isArray(data)) {
            var val1 = Object.values(data);
            val1.forEach((v1) => {
              if (Array.isArray(v1)) {
                var val2 = Object.values(v1);
                if (val2[3] === sesion['grupo']) { // GRUPO
                  this.usuarioService.cadenaConexion = val2[4]; // CADENA
                  this.cargarDatosIniciales();
                }
              }
            });
          }
        }
      );
  }

  cargarDatosIniciales() {
    this.cargarNotificaciones();
  }

  enviarNovedad() {
    Object.values(this.formulario.controls).forEach((control: any) => {
      control.markAsTouched();
    });
    this.formato = '';
    let correo = 'N';
    if (this.formulario.valid) {
      let incluyeAnexo = 'N';
      if (this.formulario.get('anexo')!.value != null && this.formulario.get('anexo')!.value != "") {
        incluyeAnexo = 'S';
        if (this.formulario.get('anexo')!.value.type == 'image/png') {
          this.formato = '.png';
        } else if (this.formulario.get('anexo')!.value.type == 'image/jpeg') {
          this.formato = '.jpg';
        } else if (this.formulario.get('anexo')!.value.type == 'application/pdf') {
          this.formato = '.pdf';
        }
      }
      if (this.formulario.get('enviocorreo')!.value == true) {
        correo = 'S';
      }
      this.url = this.usuarioService.getUrl() + '/#/login/' + this.usuarioService.grupoEmpresarial;
      swal.fire({
        title: "Enviando la solicitud al sistema, por favor espere...",
        willOpen: () => {
          swal.showLoading();
          this.recursosHumanosService.crearMensaje(
            this.usuarioService.tokenJWT,
            this.usuarioService.usuario,
            this.usuarioService.empresa,
            this.formatoddmmyyyy(this.formulario.get('fechainicio')!.value),
            this.formatoddmmyyyy(this.formulario.get('fechafin')!.value),
            this.formulario.get('titulo')!.value,
            this.formulario.get('descripcion')!.value,
            incluyeAnexo,
            this.usuarioService.cadenaConexion,
            this.formato,
            correo,
            this.url)
            .subscribe(
              (data: any) => {
                if (data["NovedadCreada"]) {
                  if (incluyeAnexo == 'S') {
                    this.subirAnexo(data["anexo"]);
                  }
                  else {
                    swal
                      .fire({
                        icon: "success",
                        title:
                          data["mensaje"],
                        showConfirmButton: true,
                      })
                      .then((res: any) => {
                        this.router.navigate(['/mensajesrh']);
                      });
                  }
                } else {
                  swal
                    .fire({
                      icon: "error",
                      title: data["mensaje"],
                      showConfirmButton: true,
                    })
                    .then((res: any) => {
                    });
                }

              }
            );
        },
        allowOutsideClick: () => !swal.isLoading(),
      });
    } else {
      swal.fire({
        title: "¡Por favor valide el formulario!",
        text:
          "Por favor valide que todos los campos obligatorios del formulario estén diligenciados.",
        icon: "error",
      });
    }
  }

  subirAnexo(nombreAnexo: string) {
    const formData = new FormData();
    this.formato = '';

    formData.append('fichero', this.formulario.get('anexo')!.value, nombreAnexo);

    this.http
      .post<any>(
        `${environment.urlKioskoReportes}rrhh/cargarAnexoPdf?nit=${this.usuarioService.empresa}&cadena=${this.usuarioService.cadenaConexion}`, formData
      )
      .subscribe(
        (data: any) => {
        },
        (error: any) => {
          if (error.status === 200) {
            swal
              .fire({
                icon: 'success',
                title: 'Se ha subido el documento anexo exitosamente.',
                showConfirmButton: false,
                timer: 1500
              })
              .then((result: any) => {
                this.router.navigate(['/mensajesrh']);
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
              });
          }
        }
      );
  }


  formatoddmmyyyy(fecha: string) {
    let anio = fecha.substring(0, 4);
    let mes = fecha.substring(5, 7);
    let dia = fecha.substring(8, 11);
    let ensamble = dia + "/" + mes + "/" + anio;
    return ensamble;
  }

  formatommddyyyy(fecha: string) {
    var momentVariable = moment(fecha, 'DD/MM/YYYY');
    var stringvalue = momentVariable.format('YYYY-MM-DD');
    return stringvalue;
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formulario.get('anexo')!.setValue(file);
      if (this.validaTipoArchivoAnexo()) {
        this.msjValidArchivoAnexo = '';
        this.nomArchivo = this.formulario.get('anexo')!.value.name;
        if (!this.validaSizeAnexo()) {
          this.msjValidArchivoAnexo = 'El tamaño del archivo es demasiado grande. Seleccione un archivo de máximo 5MB.'
          swal.fire('Tamaño de archivo demasiado grande', 'Por favor seleccione un archivo de máximo 5MB', 'error');
        }
      } else {
        this.msjValidArchivoAnexo = 'El tipo de archivo seleccionado no es válido';
        swal.fire('Tipo de archivo no válido', 'Por favor Seleccione un archivo valido', 'error');
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
    let sizeArchivo = (this.formulario.get('anexo')!.value.size / 1048576);
    let sizeArchivo2 = parseFloat(parseFloat(sizeArchivo.toString()).toFixed(2));
    if (sizeArchivo2 <= 2.5) {
      valid = true;
    }
    return valid;
  }

  // Método que retorna true si el archivo anexo corresponde a un pdf
  validaTipoArchivoAnexo() {
    console.log("this.formulario.get('anexo').value", this.formulario.get('anexo')!.value);
    let valid = false;
    if (this.formulario.get('anexo')!.value.type == 'image/png'
      || this.formulario.get('anexo')!.value.type == 'image/jpeg'
      || this.formulario.get('anexo')!.value.type == 'application/pdf'
    ) {
      valid = true;
    }
    return valid;
  }

  // Método que quitar  el archivo seleccionado del campo de anexo,
  quitarArchivoSeleccionado() {
    this.msjValidArchivoAnexo = '';
    this.formulario.get('anexo')!.setValue('');
    this.nomArchivo = null;
  }

  asigFecha() {
    let datetemp = this.formatoddmmyyyy(this.formulario.get('fechainicio')!.value);
    this.formulario.get("fechainiciodt")!.setValue(datetemp);
    document.getElementById("fechainiciodt")!.hidden = false;
    document.getElementById("fechainicio")!.hidden = true;
  }

  backDt() {
    document.getElementById("fechainiciodt")!.hidden = true;
    document.getElementById("fechainicio")!.hidden = false;
  }

  backText() {
    document.getElementById("fechainiciodt")!.hidden = false;
    document.getElementById("fechainicio")!.hidden = true;
  }

  cargarNotificaciones() {
    this.usuarioService.loadAllNotifications();
  }

}
