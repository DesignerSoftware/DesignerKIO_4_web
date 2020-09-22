import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
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
  opcionesReportes: any = [];
  reporteSeleccionado = null;
  private usuario: string;
  private empresa: string;
  fechaDesde: Date = null;
  fechaHasta: Date = null;
  enviocorreo: boolean;
  correo: string = null;

  constructor(private opcionesKioskosServicio: OpcionesKioskosService, private router: Router, private fb: FormBuilder,
              private usuarioServicio: UsuarioService, private reporteServicio: ReportesService, public datepipe: DatePipe) {
    console.log('constructor');
    this.crearFormulario();
      let date: Date= new Date(datepipe.transform('2019-04-13T00:00:00', 'yyyy-MM-dd'));
      console.log('transformada', date);
      console.log(this.conviertefecha('2019-04-13'));
    /*this.activatedRoute.params
    .subscribe(params => {
    console.log(params);
  	console.log(params['id']);
    });*/

    const sesion = this.usuarioServicio.getUserLoggedIn();
    console.log(sesion);
    this.usuario = sesion['usuario'];
    this.empresa = sesion['empresa'];
    console.log('usuario: ' + this.usuario + ' empresa: ' + this.empresa);
    this.filtrarOpcionesReportes();
    this.consultarParametrosReportes();
    this.getCorreoConexioneskioskos();
  }

   conviertefecha(fecharecibidatexto)
{
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
    this.usuarioServicio.getParametros(this.usuario, this.empresa)
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
    if (this.opcionesReportes == null || this.opcionesReportes.length===0 || this.opcionesReportes===[]) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(this.empresa)
        .subscribe((data) => {
          console.log('opciones Consultadas', data);
          opkTempo = data;
          this.opcionesReportes = opkTempo.filter(
            (opcKio) => opcKio['CODIGO'] === '20'
          );
          // console.log('filter 1', this.opcionesReportes[0]['SUBOPCION']);
        });
    } else {
      opkTempo = this.opcionesKioskosServicio.opcionesKioskos;
      this.opcionesReportes = opkTempo.filter(
        (opcKio) => opcKio['CODIGO'] === '20'
      );
      console.log('filter 2', this.opcionesReportes[0]['SUBOPCION']);
    }
  }

  getCorreoConexioneskioskos() {
    this.usuarioServicio.consultarCorreoConexioneskioskos(this.usuario, this.empresa)
    .subscribe(
      data => {
        this.correo = data['result'];
        console.log('correo: ' + this.correo);
      }
    )
  }

  seleccionarReporte(index: number) {
    console.log('opcionesActuales', this.opcionesReportes);
    console.log(index);
    this.reporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index];
    // this.router.navigateByUrl(`/reportes/${index}`);
  }

  limpiarSeleccionado() {
    console.log('clear seleccionado');
    this.reporteSeleccionado = null;
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
          'Error: La fecha hasta debe ser mayor a la fecha desde.!',
          'error'
        );
        return false;
      } else {
        document.getElementById('divm').innerHTML = '';
        document.getElementById('divm').style.display = 'none';

        if (this.reporteSeleccionado['CODIGO'] === '22') { // si el reporte seleccionado es certingresos
          // let fechaDesde: Date = new Date(this.conviertefecha(this.formulario.get('fechadesde').value)/* + 'T00:00:00'*/);
          // let fechaHasta: Date = new Date(this.conviertefecha(this.formulario.get('fechahasta').value)/* + 'T00:00:00'*/);
          this.reporteServicio.validaFechasCertingresos(
            this.formulario.get('fechadesde').value, this.formulario.get('fechahasta').value
          )
          .subscribe(
            data => {
              console.log(data);
              if (data['result']==="true") {
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
          this.usuarioServicio.getSecuenciaEmpl(this.usuario)
          .subscribe(
            info => {
              this.usuarioServicio.secuenciaEmpleado = info['SECUENCIA'];
              this.actualizaParametros();
            }
          );
        } else {
         this.actualizaParametros();
        }
  }

  actualizaParametros() {
    swal.fire({
      title: 'Por favor espere un momento',
      text: 'Su reporte se está generando.',
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.usuarioServicio.actualizaParametrosReportes(this.usuario, this.empresa, this.formulario.get('fechadesde').value,
        this.formulario.get('fechahasta').value, this.formulario.get('enviocorreo').value )
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
              'Error!',
              'Se presentó un error al actualizar las fechas del reporte, por favor inténtelo de nuevo más tarde!',
              'error'
            );
          }
        );
      }
    });

  }


  descargarReporte() {
    swal.fire({
      title: 'Generando reporte, por favor espere...',
      onBeforeOpen: () => {
        swal.showLoading();
        console.log('descargarReporte');
        this.reporteServicio
          .generarReporte(
            this.reporteSeleccionado['NOMBRERUTA'],
            this.usuarioServicio.secuenciaEmpleado,
            this.formulario.get('enviocorreo').value,
            this.correo,
            this.reporteSeleccionado['DESCRIPCION']
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
              const newBlob = new Blob([res], { type: "application/pdf" });
              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
              }
              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);

              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
                this.reporteSeleccionado["NOMBRERUTA"] +
                "_" +
                this.usuario +
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
