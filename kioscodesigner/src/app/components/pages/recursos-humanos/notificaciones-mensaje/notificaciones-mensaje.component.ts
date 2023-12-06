import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { PQRSService } from 'src/app/services/pqrs.service';
import { RecursosHumanosService } from 'src/app/services/recursoshumanos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-notificaciones-mensaje',
  templateUrl: './notificaciones-mensaje.component.html',
  styleUrls: ['./notificaciones-mensaje.component.scss']
})
export class NotificacionesMensajeComponent implements OnInit {

  fotoCargada: string = "";
  mensajeRh: any = [];
  reporteSeleccionado: any = null;
  codigoReporteSeleccionado: any = null;

  formulario: FormGroup = {} as FormGroup;
  opPqrsf: string = '';
  opciones: string[] = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Felicitación'];
  mensaje: string = '';
  habilitaPqrs: boolean = false;
  opcionPQRS: any;

  constructor(private fb: FormBuilder,
    private opcionesKioskosServicio: OpcionesKioskosService,
    public usuarioServicio: UsuarioService,
    private router: Router,
    public recursosHumanosService: RecursosHumanosService,
    private cadenasKioskos: CadenaskioskosappService,
    private pqrsServicio: PQRSService
  ) { }

  ngOnInit() {
    if (this.usuarioServicio.cadenaConexion) {
      this.getMensajesRrHh();
    } else {
      this.getInfoUsuario();
    }
    this.crearFormulario();
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
        data => {
          if (Array.isArray(data)) {
            var val1 = Object.values(data);
            val1.forEach((v1) => {
              if (Array.isArray(v1)) {
                var val2 = Object.values(v1);
                if (val2[3] === sesion['grupo']) { // GRUPO
                  this.usuarioServicio.cadenaConexion = val2[4]; // CADENA
                  this.cargarDatosIniciales();
                }
              }
            });
          }
        }
      );
  }

  cargarDatosIniciales() {
    this.getMensajesRrHh();
    this.filtrarOpcionesKioskos();
  }

  getMensajesRrHh() {
    this.recursosHumanosService
      .getMensajes(
        this.usuarioServicio.empresa,
        this.usuarioServicio.cadenaConexion,
        'S'
      )
      .subscribe((data) => {
        this.mensajeRh = data;
      });
  }

  filtrarOpcionesKioskos() {
    let opkTempo: any = [];

    opkTempo = this.opcionesKioskosServicio
      .getOpcionesKiosco(
        this.usuarioServicio.empresa,
        this.usuarioServicio.usuario,
        this.usuarioServicio.cadenaConexion
      )
      .subscribe((data) => {
        opkTempo = data;
        this.opcionPQRS = opkTempo.filter(
          (opcKio: any) => opcKio["clase"] === "OPCION" && opcKio['codigo'] === "0901" && opcKio['kiorol']['nombre'] === "EMPLEADO"
        );
        if (this.opcionPQRS) {
          this.habilitaPqrs = true;
        } else {
          this.habilitaPqrs = false;
        }
      });
  }

  //RRHH
  cargaFoto(numero: number) {
    let formatoCargado = this.mensajeRh[numero]['formato'];
    let fotoCargada = this.mensajeRh[numero]['nombreadjunto'];
    let url = this.usuarioServicio.getUrlws();
    if (formatoCargado == ".pdf") {
      fotoCargada = 'img_pdf.png'
    }
    let urltemp = `${url}rrhh/obtenerFotoMsj/${fotoCargada}?cadena=${this.usuarioServicio.cadenaConexion}&usuario=${this.usuarioServicio.usuario}&empresa=${this.usuarioServicio.empresa}`;
    return urltemp;
  }

  descargarArchivo(numero: number) {

    swal.fire({
      title: "Descargando reporte, por favor espere...",
      willOpen: () => {
        swal.showLoading();
        //console.log("descargarReporte");
        this.recursosHumanosService
          .getAnexo(
            this.mensajeRh[numero]['nombreadjunto'],
            this.usuarioServicio.empresa,
            this.usuarioServicio.cadenaConexion
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
              let fileUrl = window.URL.createObjectURL(newBlob);
              let nav = (window.navigator as any);
              if (nav.msSaveOrOpenBlob) {
                nav.msSaveOrOpenBlob(
                  newBlob,
                  fileUrl.split(":")[1] + ".pdf"
                );
              } else {
                window.open(fileUrl);
              }
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
                this.mensajeRh[numero]['nombreadjunto'] +
                "_" +
                this.usuarioServicio.usuario +
                "_" +
                f.getTime() +
                ".pdf";
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

  isPQRS(): boolean {
    return this.habilitaPqrs;
  }

  crearFormulario() {
    this.formulario = this.fb.group(
      {
        opPqrsf: ["", Validators.required],
        mensaje: ["", Validators.required]
      }
    );
  }

  abrirModal() {
    $("#staticBackdrop").modal("show");
    this.formulario.get('opPqrsf')!.setValue('');
    this.formulario.get('mensaje')!.setValue('');
    console.log('abriendo dialogo');
  }

  enviarReporteNovedad() {
    console.log('tipo: ' + this.formulario.get('opPqrsf')!.value);
    console.log('mensaje: ' + this.formulario.get('mensaje')!.value);
    let tipoPqrs: String = this.formulario.get('opPqrsf')!.value;
    tipoPqrs = tipoPqrs.replace('ó', 'o');
    //let urlPQRS = this.usuarioServicio.getUrl() + '/#/login/' + this.usuarioServicio.grupoEmpresarial;
    const sesion = this.usuarioServicio.getUserLoggedIn();
    if (this.formulario.valid) {
      swal.fire({
        title: "Enviando mensaje al Comité de Convivencia, por favor espere...",
        willOpen: () => {
          swal.showLoading();
          this.pqrsServicio.crearMensaje('', this.usuarioServicio.usuario, this.usuarioServicio.empresa,
            tipoPqrs.toUpperCase(), this.formulario.get('mensaje')!.value,
            this.usuarioServicio.cadenaConexion,
            sesion['urlKiosco'])
            .subscribe(
              (data: any) => {
                if (data) {
                  swal
                    .fire({
                      icon: "success",
                      title:
                        "Mensaje enviado exitosamente al Comité de Convivencia para su validación.",
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#staticBackdrop").modal("hide");
                      this.formulario.get('opPqrsf')!.setValue('');
                      this.formulario.get('mensaje')!.setValue('');
                    });
                } else {
                  swal.fire({
                    icon: "error",
                    title: "No fue posible enviar el correo",
                    text: 'Por favor inténtelo de nuevo más tarde.',
                    showConfirmButton: true,
                  })
                    .then((res: any) => {
                      $("#staticBackdrop").modal("hide");
                      this.formulario.get('opPqrsf')!.setValue('');
                      this.formulario.get('mensaje')!.setValue('');
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
                  .then((res: any) => {
                    $("#staticBackdrop").modal("hide");
                    this.formulario.get('opPqrsf')!.setValue('');
                    this.formulario.get('mensaje')!.setValue('');
                  });
              }
            );
        },
        allowOutsideClick: () => !swal.isLoading(),
      });
    } else {
      swal.fire({
        icon: "error",
        title: "No ha diligenciado el formulario correctamente",
        text:
          "Por favor diligencie el formulario correctamente sobre la PQRSF que desea enviar.",
        showConfirmButton: true
      })
    }
  }

}
