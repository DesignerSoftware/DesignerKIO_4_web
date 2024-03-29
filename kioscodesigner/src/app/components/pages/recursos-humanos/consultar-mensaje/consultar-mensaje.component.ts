import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { RecursosHumanosService } from 'src/app/services/recursoshumanos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-consultar-mensaje',
  templateUrl: './consultar-mensaje.component.html',
  styleUrls: ['./consultar-mensaje.component.scss']
})
export class ConsultarMensajeComponent implements OnInit {

  formulario: FormGroup = {} as FormGroup;
  mensajeCosulatdos: any = null;
  mensajeCosulatdosFilter: any = null;
  //public dataFilt: any = "";
  public p: number = 1;
  //solicitudes = null;
  //anexo: any = null;
  //solicitudSeleccionada: any = null;
  mensajeSeleccionado: any = null;
  url: string = '';

  _searchTerm: string = '';
  direccion = 'DESC';
  arrow = "up";
  orderSelect = 'fechacreacion1';

  mensajeTitulo: string = '';
  mensajeMensaje: string = '';
  mensajeFechaInicio: string = '';
  mensajeFechaFin: string = '';
  mensajeAnexo: string = '';
  mensajeEstado: string = '';
  mensajeSecuencia: string = '';

  fileToUpload: File = {} as File; // variable archivo seleccionado 
  //habilitaBtnCargar = false;
  msjValidArchivoAnexo = '';
  nomArchivo = null;
  formato = "";

  prueba1 = [new Date('04/21/2022'), new Date('03/25/2022')];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private router: Router,
    private recursosHumanosService: RecursosHumanosService,
    private cadenasKioskos: CadenaskioskosappService
  ) {

  }

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
      estado: [],
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
    //console.log('usuario: ' + this.usuarioService.usuario + ' empresa: ' + this.usuarioService.empresa);
    //this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'], this.usuarioService.urlKioscoDomain)
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        (data: any) => {
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
    if (
      this.usuarioService.documento == null ||
      this.usuarioService.documento.lenght === 0
    ) {
      this.usuarioService
        .getDocumentoSeudonimo(
          this.usuarioService.usuario,
          this.usuarioService.empresa,
          this.usuarioService.cadenaConexion
        )
        .subscribe((data: any) => {
          //console.log(data["result"]);
          this.usuarioService.documento = data["result"];
          //console.log("ng OnInit:", this.usuarioService.documento);
          this.consultarSolici();
        });
    } else {
      this.consultarSolici();
    }
    this.cargarNotificaciones();
  }

  consultarSolici() {
    this.getSolicitudes();
  }


  getSolicitudes() {
    this.recursosHumanosService
      .getMensajes(
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion,
        'N'
      )
      .subscribe((data: any) => {
        console.log('mensajeCosulatdos ', data);
        this.mensajeCosulatdosFilter = data;
        for (let i = 0; i < this.mensajeCosulatdosFilter.length; i++) {
          this.mensajeCosulatdosFilter[i].fechacreacion1 = new Date(data[i].fechacreacion1);
          this.mensajeCosulatdosFilter[i].fechafin1 = new Date(data[i].fechafin1);
          this.mensajeCosulatdosFilter[i].fechainicio1 = new Date(data[i].fechainicio1);
        }
        //console.log('mensajeCosulatdosFilter: ',this.mensajeCosulatdosFilter);

        this.mensajeCosulatdos = data;
        //this.ordenarAsc();
      });
  }

  detalleSolicitud(index: number) {
    //console.log("index seleccionado: " + index);
    this.limpiarMensaje();
    this.mesajeSeleccionado(index);
    //console.log('this.mensajeSeleccionado :', this.mensajeSeleccionado['titulo']  ,this.mensajeSeleccionado );
    this.completarMensaje();
    $("#exampleModal").modal("show");
    //document.getElementById('staticBackdrop2').style.display = 'block';
  }

  mesajeSeleccionado(index: number) {
    //console.log("index seleccionado: " + index);
    this.mensajeSeleccionado = this.mensajeCosulatdos[index]
  }

  limpiarMensaje() {
    this.mensajeTitulo = '';
    this.mensajeMensaje = '';
    this.mensajeFechaInicio = '';
    this.mensajeFechaFin = '';
    this.mensajeAnexo = '';
    this.mensajeEstado = '';
  }

  completarMensaje() {
    //console.log('this.mensajeSeleccionado: ', this.mensajeSeleccionado);
    this.mensajeTitulo = this.mensajeSeleccionado['titulo'];
    //console.log('this.mensajeTitulo: ', this.mensajeTitulo);
    this.mensajeMensaje = this.mensajeSeleccionado['descripcion'];
    this.mensajeFechaInicio = this.formatoyyyymmdd(this.mensajeSeleccionado['fechainicio']);
    this.mensajeFechaFin = this.formatoyyyymmdd(this.mensajeSeleccionado['fechafin']);
    this.nomArchivo = this.mensajeSeleccionado['nombreadjunto'];
    this.mensajeAnexo = this.mensajeSeleccionado['nombreadjunto'];
    this.mensajeEstado = this.mensajeSeleccionado['estado'];
    this.mensajeSecuencia = this.mensajeSeleccionado['secuencia'];
  }

  reloadPage() {
    //this.ngOnInit();
    this.router.navigate(['/recursoshumanos']);
  }
  // Método que retorna true si el tamaño del archivo no supera los 5MB
  validaSizeAnexo() {
    let valid = false;
    let sizeArchivo = (this.formulario.get('anexo')!.value.size / 1048576);
    let sizeArchivo2 = parseFloat(parseFloat(sizeArchivo.toString()).toFixed(2));
    if (sizeArchivo2 <= 5) {
      valid = true;
      //console.log('El anexo no supera los 5 MB');
    }
    return valid;
  }

  // Método que retorna true si el archivo anexo corresponde a un pdf
  validaTipoArchivoAnexo() {
    //console.log("this.formulario.get('anexo').value", this.formulario.get('anexo').value);
    let valid = false;
    if (this.formulario.get('anexo')!.value.type == 'image/png'
      || this.formulario.get('anexo')!.value.type == 'image/jpeg'
      || this.formulario.get('anexo')!.value.type == 'application/pdf'
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
    this.formulario.get('anexo')!.setValue('');
    this.nomArchivo = null;
  }

  formatoyyyymmdd(fecha: string) {
    let dia = fecha.substring(0, 2);
    let mes = fecha.substring(3, 5);
    let anio = fecha.substring(6, 10);
    let ensamble = anio + "-" + mes + "-" + dia;
    //console.log('ensamble:' , ensamble, 'fecha: ', fecha);
    return ensamble;
  }

  prueba() {
    //console.log('fechainicio' , this.mensajeFechaInicio);  
  }
  formatoddmmyyyy(fecha: string) {
    let anio = fecha.substring(0, 4);
    let mes = fecha.substring(5, 7);
    let dia = fecha.substring(8, 11);
    let ensamble = dia + "/" + mes + "/" + anio;
    return ensamble;
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      //console.log('archivo seleccionado');
      const file = event.target.files[0];
      //console.log(file);
      this.formulario.get('anexo')!.setValue(file);
      //console.log('Name File' + file.name);
      if (this.validaTipoArchivoAnexo()) {
        //console.log('Es .pdf');
        this.msjValidArchivoAnexo = '';
        this.nomArchivo = this.formulario.get('anexo')!.value.name;
        if (!this.validaSizeAnexo()) {
          this.msjValidArchivoAnexo = 'El tamaño del archivo es demasiado grande. Seleccione un archivo de máximo 5MB.';
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

  updateNovedad() {
    //console.log('value adjunto: ', this.formulario.get('anexo').value, ' fechaInicio: ', this.formulario.get('fechainicio').value);
    //console.log("this.formulario.get('anexo')", this.formulario.get('anexo'));  
    //console.log('valor Estado:' , this.mensajeEstado , ' / ' , this.formulario.get('estado').value);

    /////////////////////////
    Object.values(this.formulario.controls).forEach((control) => {
      control.markAsTouched();
    });

    this.formato = '';

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
      } else if (this.nomArchivo !== 'N' && this.nomArchivo !== null) {
        incluyeAnexo = this.nomArchivo;
      }
      swal.fire({
        title: "Enviando la solicitud al sistema, por favor espere...",
        willOpen: () => {
          swal.showLoading();
          this.recursosHumanosService.updateMensaje(
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
            this.mensajeSecuencia,
            this.mensajeEstado)
            .subscribe(
              (data: any) => {
                //console.log('rta: ', data);
                if (data["NovedadModificada"]) {
                  if (incluyeAnexo == 'S') {
                    //console.log('Novedad reportada incluye anexo');
                    this.subirAnexo(data["anexo"]);
                  }
                  else {
                    swal
                      .fire({
                        icon: "success",
                        title:
                          "Se ha modificado correctamente el comunicado",
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        $("#exampleModal").modal("hide");
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

  resendEmail(index: number) {
    this.limpiarMensaje();
    this.mesajeSeleccionado(index);
    this.completarMensaje();
    this.url = this.usuarioService.getUrl() + '/#/login/' + this.usuarioService.grupoEmpresarial;
    swal.fire({
      title: '¿Desea Enviar Correo del Comunicado Selecionado?.',
      text: '¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        swal.fire({
          title: "Procesando solicitud, por favor espere...",
          willOpen: () => {
            swal.showLoading();
            this.recursosHumanosService.getResendEmail(
              this.usuarioService.tokenJWT,
              this.usuarioService.usuario,
              this.usuarioService.empresa,
              this.mensajeTitulo,
              this.mensajeMensaje,
              this.usuarioService.cadenaConexion,
              this.url)
              .subscribe(
                (data: any) => {
                  if (data["correoEnviado"]) {
                    swal
                      .fire({
                        icon: "success",
                        title:
                          "Se ha enviado correctamente el comunicado",
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        $("#exampleModal").modal("hide");
                        this.router.navigate(['/mensajesrh']);
                      });
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
                });
          },
          allowOutsideClick: () => !swal.isLoading(),
        });
      }
    });
  }

  eliminarMensaje(index: number) {
    this.mesajeSeleccionado(index);
    this.completarMensaje();
    swal.fire({
      title: '¿Desea Eliminar el Comunicado?. Los comunicados mantienen'
        + 'trazabilidad indistintamente si se eliminan.',
      text: '¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        swal.fire({
          title: "Procesando solicitud, por favor espere...",
          willOpen: () => {
            swal.showLoading();
            this.recursosHumanosService.deleteMsj(
              this.usuarioService.tokenJWT,
              this.usuarioService.usuario,
              this.mensajeSecuencia,
              this.usuarioService.empresa,
              this.usuarioService.cadenaConexion)
              .subscribe(
                (data: any) => {
                  if (data["NovedadModificada"]) {
                    swal
                      .fire({
                        icon: "success",
                        title:
                          "Se ha eliminado correctamente el comunicado",
                        showConfirmButton: true,
                      })
                      .then((res) => {
                        $("#exampleModal").modal("hide");
                        this.router.navigate(['/mensajesrh']);
                      });
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
                });
          },
          allowOutsideClick: () => !swal.isLoading(),
        });
      }
    });
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
                $("#exampleModal").modal("hide");
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
  cargarNotificaciones() {
    this.usuarioService.loadAllNotifications();
  }

  ordenar(atributo: string) {
    this.orderSelect = atributo;
    //console.log('orderSelect: ', this.orderSelect);
    this.direccion = this.direccion === 'ASC' ? 'DESC' : 'ASC'
    if (this.direccion == 'ASC') {
      this.arrow = 'down';
      this.ordenarAsc(atributo);
    } else {
      this.arrow = 'up';
      this.ordenarDesc(atributo);
    }
  }

  ordenarAsc(atributo: string) {
    this.prueba1 = this.prueba1.sort(function (a, b) {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0; // a must be equal to b
    });
    //console.log('prueba1: ' , this.prueba1);

    this.mensajeCosulatdos = this.mensajeCosulatdos.sort(function (a: any, b: any) {
      let atrTemp = atributo
      if (a[atrTemp] > b[atrTemp]) {
        return 1;
      }
      if (a[atrTemp] < b[atrTemp]) {
        return -1;
      }
      return 0; // a must be equal to b
    });
  }
  ordenarDesc(atributo: string) {
    this.mensajeCosulatdos = this.mensajeCosulatdos.sort(function (a: any, b: any) {
      let atrTemp = atributo
      if (a[atrTemp] < b[atrTemp]) {
        return 1;
      }
      if (a[atrTemp] > b[atrTemp]) {
        return -1;
      }
      return 0; // a must be equal to b
    });
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(val: string) {
    this._searchTerm = val;
    this.mensajeCosulatdos = this.filter(val);
  }

  filter(v: string) {
    return this.mensajeCosulatdosFilter.filter((x: any) => x.titulo?.toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x.descripcion.toString()?.toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x.estado?.toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x.fechainicio?.toLowerCase().indexOf(v.toLowerCase()) !== -1
      || x.fechafin?.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }

}
