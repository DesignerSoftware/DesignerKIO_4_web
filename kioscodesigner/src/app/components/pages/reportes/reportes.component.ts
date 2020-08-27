import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ReportesService } from 'src/app/services/reportes.service';
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

  constructor(private opcionesKioskosServicio: OpcionesKioskosService, private router: Router, private fb: FormBuilder,
              private usuarioServicio: UsuarioService, private reporteServicio: ReportesService) {
    console.log('constructor');
    this.crearFormulario();
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
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      fechadesde: [, Validators.required],
      fechahasta: [, Validators.required],
      enviocorreo: [false]
    });
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
          console.log('filter 1', this.opcionesReportes[0]['SUBOPCION']);
        });
    } else {
      opkTempo = this.opcionesKioskosServicio.opcionesKioskos;
      this.opcionesReportes = opkTempo.filter(
        (opcKio) => opcKio['CODIGO'] === '20'
      );
      console.log('filter 2', this.opcionesReportes[0]['SUBOPCION']);
    }
  }


  seleccionarReporte(index: number) {
    console.log('opcionesActuales', this.opcionesReportes);
    console.log(index);
    this.reporteSeleccionado = this.opcionesReportes[0]['SUBOPCION'][index];
    // this.router.navigateByUrl(`/reportes/${index}`);
  }

  limpiarSeleccionado() {
    console.log('seleccio');
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
        return false;
      } else {
        document.getElementById('divm').innerHTML = '';
        document.getElementById('divm').style.display = 'none';

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

    }
  }

  actualizaParametros() {
    this.usuarioServicio.actualizaParametrosReportes(this.usuario, this.empresa, this.formulario.get('fechadesde').value,
    this.formulario.get('fechahasta').value, this.formulario.get('enviocorreo').value )
    .subscribe(
      data => {
        if (data['update'] === true) {
          console.log('parametros actualizados');
          this.descargarReporte();
        }
      }
    );
  }


  descargarReporte() {
    console.log('descargarReporte');
    swal.fire(
      'Generando reporte!',
      'Su reporte se descargará automaticamente en un momento!',
      'info'
    );
    this.reporteServicio.generarReporte(this.reporteSeleccionado['NOMBRERUTA'], this.usuarioServicio.secuenciaEmpleado, 
    this.formulario.get('enviocorreo').value)
    .subscribe(
      (res) => {
        console.log(res);
        const newBlob = new Blob([res], { type: 'application/pdf' });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }
        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = data;
        let f = new Date();
        link.download = this.reporteSeleccionado['NOMBRERUTA'] +  '_' + this.usuario + '_' + f.getTime() + '.pdf';
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
          'Error!',
          'Se presentó un error al generar el reporte, por favor intentelo de nuevo más tarde!',
          'info'
        );
      }
    );
  }


}
