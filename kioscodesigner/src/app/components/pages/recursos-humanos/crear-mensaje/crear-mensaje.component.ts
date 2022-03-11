import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { RecursosHumanosService } from 'src/app/services/recursoshumanos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crear-mensaje',
  templateUrl: './crear-mensaje.component.html',
  styleUrls: ['./crear-mensaje.component.css']
})
export class CrearMensajeComponent implements OnInit {

  fileToUpload: File = null; // variable archivo seleccionado 
  habilitaBtnCargar = false;
  msjValidArchivoAnexo = '';
  msjNovEmpleTitle = null;
  msjNovEmpleDetalle = null;
  nomArchivo = null;
  formato = "";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, private router: Router,
    private route: ActivatedRoute, public usuarioService: UsuarioService,
    public recursosHumanosService: RecursosHumanosService, private cadenasKioskos: CadenaskioskosappService,
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
      titulo: [, Validators.required],
      descripcion: [, Validators.required],
      fechainicio: [, Validators.required],
      fechafin: [, Validators.required],
      anexo: [null, []]
    });
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
              //console.log('pages CADENA: ', this.usuarioService.cadenaConexion)
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  cargarDatosIniciales() {

  }


  enviarNovedad() {
    //console.log('value adjunto: ', this.formulario.get('anexo').value, ' fechaInicio: ', this.formulario.get('fechainicio').value);
    Object.values(this.formulario.controls).forEach((control) => {
      control.markAsTouched();
    });

    this.formato = '';
    
    if (this.formulario.valid) {
      let incluyeAnexo = 'N';
      if (this.formulario.get('anexo').value != null && this.formulario.get('anexo').value != "") {
        incluyeAnexo = 'S';
        if (this.formulario.get('anexo').value.type == 'image/png'){
          this.formato = '.png';
        }else if (this.formulario.get('anexo').value.type == 'image/jpeg'){
          this.formato = '.jpg';
        }else if (this.formulario.get('anexo').value.type == 'application/pdf'){
          this.formato = '.pdf';
        }       
      }
      swal.fire({
        title: "Enviando la solicitud al sistema, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          this.recursosHumanosService.crearMensaje(
            this.usuarioService.tokenJWT,
            this.usuarioService.usuario,
            this.usuarioService.empresa,
            this.formatoddmmyyyy(this.formulario.get('fechainicio').value),
            this.formatoddmmyyyy(this.formulario.get('fechafin').value),
            this.formulario.get('titulo').value,
            this.formulario.get('descripcion').value,
            incluyeAnexo,
            this.usuarioService.cadenaConexion,
            this.formato)
            .subscribe(
              data => {
                //console.log('rta: ', data);
                if (data["NovedadCreada"]) {
                  if (incluyeAnexo == 'S') {
                    //console.log('Novedad reportada incluye anexo');
                    this.subirAnexo(data["anexo"]);
                  }
                  else {
                    swal
                      .fire({
                        icon: "success",
                        title:
                          "Se ha creado correctamente el mensaje",
                        showConfirmButton: true,
                      })
                      .then((res) => {
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
                    .then((res) => {
                      
                    });
                }
              }
            );
        },
        allowOutsideClick: () => !swal.isLoading(),
      });



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

  subirAnexo(nombreAnexo: string) {
    const formData = new FormData();
    this.formato = '';
    
    formData.append('fichero', this.formulario.get('anexo').value,nombreAnexo);
    
    this.http
      .post<any>(
        `${environment.urlKioskoReportes}rrhh/cargarAnexoPdf?nit=${this.usuarioService.empresa}&cadena=${this.usuarioService.cadenaConexion}`, formData
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
                //this.router.navigated = false;
                //this.router.navigateByUrl('/mensajesrh');
              });
          }
        }
      );
    //console.log(this.formulario.value);
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
    console.log("this.formulario.get('anexo').value", this.formulario.get('anexo').value);
    let valid = false;
    if (this.formulario.get('anexo').value.type == 'image/png'
    || this.formulario.get('anexo').value.type == 'image/jpeg'
    || this.formulario.get('anexo').value.type == 'application/pdf'
    ) {
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
