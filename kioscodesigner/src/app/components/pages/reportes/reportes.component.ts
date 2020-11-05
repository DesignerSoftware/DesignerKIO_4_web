import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  formulario: FormGroup;
  //opcionesReportes: any = [];
  //reporteSeleccionado = null;
  fechaDesde: Date = null;
  fechaHasta: Date = null;
  enviocorreo: boolean;
  correo: string = null;
  //codigoReporteSeleccionado;

  constructor(private opcionesKioskosServicio: OpcionesKioskosService, private router: Router, private fb: FormBuilder,
              private usuarioServicio: UsuarioService, public reporteServicio: ReportesService, public datepipe: DatePipe) {
    console.log('constructor');
    this.crearFormulario();
    this.reporteServicio.reporteSeleccionado = null;

    // let date: Date= new Date(datepipe.transform('2019-04-13T00:00:00', 'yyyy-MM-dd'));
    // console.log('transformada', date);
    // console.log(this.conviertefecha('2019-04-13'));
    /*this.activatedRoute.params
    .subscribe(params => {
    console.log(params);
  	console.log(params['id']);
    });*/

    this.filtrarOpcionesReportes();
    this.consultarParametrosReportes();
    this.getCorreoConexioneskioskos();
  }

  conviertefecha(fecharecibidatexto) {
        let fec = fecharecibidatexto;

        let anio = fec.substring(0, 4);
        let mes = fec.substring(500,7);
        let dia = fec.substring(8,10);

        let ensamble = dia +  "-" + mes +  "-" + anio;
        let fecha = new Date(ensamble).toLocaleDateString('es-CO');
        return fecha;
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  crearFormulario() {
    console.log('crearFormulario()');
    this.formulario = this.fb.group({
      fechadesde: [, Validators.required],
      fechahasta: [, Validators.required],
      enviocorreo: [false]
    });
  }

  consultarParametrosReportes() {
    this.usuarioServicio.getParametros(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
    .subscribe(
      data => {
        console.log('data', data);
        console.log('fecha desde: ' + data[0][0]);
        this.fechaDesde =  data[0][0];
        this.fechaHasta = data[0][1];
        this.enviocorreo = data[0][2];
        this.formulario.get('fechadesde').setValue(this.fechaDesde);
        this.formulario.get('fechahasta').setValue(this.fechaHasta);
        this.formulario.get('enviocorreo').setValue(data[0][2] === 'S' ? true : false);
      }
    );
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (this.reporteServicio.opcionesReportes == null || this.reporteServicio.opcionesReportes.length === 0 || this.reporteServicio.opcionesReportes === []) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.usuarioServicio.empresa, this.usuarioServicio.usuario)
        .subscribe((data) => {
          console.log('opciones Consultadas', data);
          opkTempo = data;
          this.reporteServicio.opcionesReportes = opkTempo.filter(
            (opcKio) => opcKio['CODIGO'] === '20'
          );
          // console.log('filter 1', this.opcionesReportes[0]['SUBOPCION']);
        });
    } else {
      /*opkTempo = this.opcionesKioskosServicio.opcionesKioskos;
      this.opcionesReportes = opkTempo.filter(
        (opcKio) => opcKio['CODIGO'] === '20'
      );
      console.log('filter 2', this.opcionesReportes[0]['SUBOPCION']);*/
    }
  }

  getCorreoConexioneskioskos() {
    this.usuarioServicio.consultarCorreoConexioneskioskos(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
    .subscribe(
      data => {
        this.correo = data['result'];
        console.log('correo: ' + this.correo);
      }
    );
  }

  seleccionarReporte(index: number) {
    console.log('seleccionarReporte');
    console.log('opcionesActuales', this.reporteServicio.opcionesReportes);
    console.log(index);
    this.reporteServicio.reporteSeleccionado = this.reporteServicio.opcionesReportes[0]['SUBOPCION'][index];
    // this.router.navigateByUrl(`/reportes/${index}`);
    this.reporteServicio.codigoReporteSeleccionado = this.reporteServicio.opcionesReportes[0]['SUBOPCION'][index]['CODIGO'];
    this.reporteServicio.nombreReporteSeleccionado = this.reporteServicio.opcionesReportes[0]['SUBOPCION'][index]['DESCRIPCION'];
  }

  limpiarSeleccionado() {
    console.log('clear seleccionado');
    this.reporteServicio.reporteSeleccionado = null;
  }

  enviar() {
    console.log(this.formulario);
    Object.values( this.formulario.controls ).forEach( control => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      const fechadesde: Date = new Date(this.formulario.get('fechadesde').value);
      const fechahasta: Date = new Date(this.formulario.get('fechahasta').value);
      if (fechadesde >= fechahasta) {
        const text =
        '<div class=\'alert alert-danger alert-dismissible fade show\' role=\'alert\'>' +
        '<i class="fa fa-exclamation-circle"></i>' +
        'Error: La fecha hasta debe ser mayor a la fecha desde.' +
        '<button type=\'button\' class=\'close\' data-dismiss=\'alert\' aria-label=\'Close\'>' +
        '<span aria-hidden=\'true\'>&times;</span>' +
        '</button>' +
        '</div>';
        document.getElementById('divm').innerHTML = text;
        document.getElementById('divm').style.display = '';
        swal.fire(
          '¡Validar fechas!',
          'La fecha hasta debe ser mayor a la fecha desde.',
          'error'
        );
        return false;
      } else {
        document.getElementById('divm').innerHTML = '';
        document.getElementById('divm').style.display = 'none';

        if (this.reporteServicio.reporteSeleccionado['CODIGO'] === '22') { // si el reporte seleccionado es certingresos
          // let fechaDesde: Date = new Date(this.conviertefecha(this.formulario.get('fechadesde').value)/* + 'T00:00:00'*/);
          // let fechaHasta: Date = new Date(this.conviertefecha(this.formulario.get('fechahasta').value)/* + 'T00:00:00'*/);
          this.reporteServicio.validaFechasCertingresos(
            this.formulario.get('fechadesde').value, this.formulario.get('fechahasta').value
          )
          .subscribe(
            data => {
              console.log(data);
              if (data['result'] === 'true') {
                console.log('fechas correctas');
                this.obtenerSecuenciaEmpleado();
              } else {
                swal.fire(
                  '¡Validar Fechas!',
                  'Para generar el Certificado de Ingresos y Retenciones se requiere que seleccione las fechas de todo un año ' +
                  '(1 de enero a 31 de diciembre).',
                  'info'
                );
                return false;
              }
            }
          );
        } else {
          this.obtenerSecuenciaEmpleado();
        }
      }

    }
  }

  obtenerSecuenciaEmpleado() {
            if (this.usuarioServicio.secuenciaEmpleado == null) {
          this.usuarioServicio.getSecuenciaEmpl(this.usuarioServicio.usuario)
          .subscribe(
            info => {
              this.usuarioServicio.secuenciaEmpleado = info;
              this.actualizaParametros();
            }
          );
        } else {
         this.actualizaParametros();
        }
  }

  formatoddmmyyyy(fecha){
    let anio = fecha.substring(0, 4);
    let mes = fecha.substring(5,7);
    let dia = fecha.substring(8,11);
    let ensamble = dia +"-"+ mes+"-"+ anio;
    return ensamble;
  }


  actualizaParametros() {
    console.log('actualizaParametros(): ');
    let msjConfirmacion = '';
    if (this.reporteServicio.codigoReporteSeleccionado=='25' || this.reporteServicio.codigoReporteSeleccionado=='26' || this.reporteServicio.codigoReporteSeleccionado=='27' || this.reporteServicio.codigoReporteSeleccionado=='28') {
      msjConfirmacion = 'Se dispone a generar el reporte '+this.reporteServicio.nombreReporteSeleccionado+'. Tenga presente que para los valores de la certificación se tiene en cuenta la fecha de generación del reporte.';
    } else {
      msjConfirmacion = 'Se dispone a generar el reporte '+this.reporteServicio.nombreReporteSeleccionado+' con fechas desde el '+
      this.formatoddmmyyyy(this.formulario.get('fechadesde').value)+
      ' hasta el '+
      this.formatoddmmyyyy(this.formulario.get('fechahasta').value);
    }
    swal.fire({
      title: 'Confirmación',
      text: msjConfirmacion,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        this.usuarioServicio.actualizaParametrosReportes(this.usuarioServicio.usuario, this.usuarioServicio.empresa,
            this.formulario.get('fechadesde').value,
            this.formulario.get('fechahasta').value,
            this.formulario.get('enviocorreo').value )
            .subscribe(
              data => {
                console.log(data);
                if (data === 1) {
                  console.log('parametros actualizados');
                  this.descargarReporte();
                }
              },
              error => {
                swal.fire(
                  '¡Se ha presentado un error!',
                  'Se presentó un error al actualizar las fechas del reporte, por favor inténtelo de nuevo más tarde.',
                  'error'
                );
              }
            );
      }
    });

  }


  descargarReporte() {
    console.log('cadenaReporte: ',this.usuarioServicio.cadenaConexion);
    this.fechaDesde = this.formulario.get('fechadesde').value;
    this.fechaHasta = this.formulario.get('fechahasta').value;
    console.log('this.usuarioServicio.secuenciaEmpleado: '+this.usuarioServicio.secuenciaEmpleado);
    swal.fire({
      title: 'Generando reporte, por favor espere...',
      onBeforeOpen: () => {
        swal.showLoading();
        console.log('descargarReporte');
        this.reporteServicio
          .generarReporte(
            this.reporteServicio.reporteSeleccionado['NOMBRERUTA'],
            this.usuarioServicio.secuenciaEmpleado,
            this.formulario.get('enviocorreo').value,
            this.correo,
            this.reporteServicio.reporteSeleccionado['DESCRIPCION'],
            this.reporteServicio.codigoReporteSeleccionado,
            this.usuarioServicio.empresa,
            this.usuarioServicio.cadenaConexion
          )
          .subscribe(
            (res) => {
              console.log(res);
              swal.fire({
                icon: 'success',
                title:
                  'Reporte generado exitosamente, se descargará en un momento',
                showConfirmButton: false,
                timer: 1500,
              });
              const newBlob = new Blob([res], { type: 'application/pdf' });
              let fileUrl = window.URL.createObjectURL(newBlob); // add 290920

              //if (window.navigator && window.navigator.msSaveOrOpenBlob) { 290920
                //window.navigator.msSaveOrOpenBlob(newBlob);
              if (window.navigator.msSaveOrOpenBlob) { // add 290920
                  window.navigator.msSaveOrOpenBlob(newBlob, fileUrl.split(':')[1] + '.pdf');
              } else {
                window.open(fileUrl);
              }
                //return;
              ///}
              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement('a');
              link.href = data;
              let f = new Date();
              link.download =
                this.reporteServicio.reporteSeleccionado['NOMBRERUTA'] +
                '_' +
                this.usuarioServicio.usuario +
                '_' +
                f.getTime() +
                '.pdf';
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent('click', {
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
                'Se ha presentado un error',
                'Se presentó un error al generar el reporte, por favor intentelo de nuevo más tarde!',
                'info'
              );
            }
          );
  },
  allowOutsideClick: () => !swal.isLoading()
});
  }


}
