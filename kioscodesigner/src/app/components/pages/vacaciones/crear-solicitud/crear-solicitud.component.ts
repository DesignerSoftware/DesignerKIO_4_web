import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  formulario: FormGroup;
  public ultimoPeriodo;
  public periodosPendientes;
  public diasUltimoPeriodo;
  public totalDiasVacacionesProv; // días provisionados
  public totalDiasVacacionesSolici; // días provisionados
  public totalDiasVacacionesLiquidados; // días provisionados
  public totalDiasVacacionesRechazados; // días provisionados
  public array = [];
  public campoFechaInicioValido = false;
  public mensajeValidacionFechaInicio = '';
  public vacacion=null;

  constructor(private vacacionesService: VacacionesService, private usuarioService: UsuarioService, private fb: FormBuilder) { }

  ngOnInit() {
    this.crearFormulario();
    // consultar todos los periodos de vacaciones y sus correspondientes dias
    this.vacacionesService.getPeriodosvacacionesPendientes(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion )
    .subscribe(
      data => {
        this.periodosPendientes = data;
        console.log(" periodosPendientes ", data);
      }
    );
    
    // consultar el periodo de vacaciones más antiguo
    this.vacacionesService.getUltimoPeriodoVacacionesPendientes(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion )
    .subscribe(
      data => {
        this.ultimoPeriodo = data[0]['periodoCausado'];
        console.log(" ultimoPeriodo ", this.ultimoPeriodo);
        this.vacacion = data[0]["rfVacacion"];
        console.log("rfVacacion", this.vacacion);
        this.creaListaDias();
      }
    ); 

    // Consultar dias disponibles para solicitar ultimo periodo
     this.vacacionesService.getDiasUltimoPeriodoVacacionesPendientes(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
     .subscribe(
       data=> {
         this.diasUltimoPeriodo = data;
         console.log('dias ultimo periodo vacaciones: ', this.diasUltimoPeriodo);
         this.creaListaDias();
       }
     );

    // consultar total dias provisionados
    this.vacacionesService.getDiasVacacionesProvisionadas(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion )
    .subscribe(
      data => {
        this.totalDiasVacacionesProv = data;
        console.log(" totalDiasVacacionesProv ", data);
      }
    );

    // consultar total de dias de vacaciones solicitados
    this.vacacionesService.getTotalDiasSolicitados(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
    .subscribe(
      data => {
        this.totalDiasVacacionesSolici = data;
        console.log(" totalDiasVacacionesSolicitados ", data);
      }
    );

    // consultar total de dias de vacaciones con ultimo estado AUTORIZADO
    this.vacacionesService.getTotalDiasSolicitadosXUltimoEstado(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion, 'LIQUIDADO')
    .subscribe(
      data => {
        this.totalDiasVacacionesLiquidados = data;
        console.log(" totalDiasVacacioneLiquidados ", data);
      }
    );

    // consultar total de dias de vacaciones con ultimo estado RECHAZADO
    this.vacacionesService.getTotalDiasSolicitadosXUltimoEstado(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion, 'RECHAZADO')
    .subscribe(
      data => {
        this.totalDiasVacacionesRechazados = data;
        console.log(" totalDiasVacacionesRechazados ", data);
      }
    );
  }

  crearFormulario() {
    console.log('crearFormulario()');
    this.formulario = this.fb.group({
      fechainicio: [, Validators.required],
      dias: [, Validators.required],
      fechafin: [, Validators.required],
      fecharegreso: [, Validators.required],
      tipo: ["TIEMPO", Validators.required],
      periodo: [],
    });
  }
    
  public creaListaDias(){
    this.array = [];
    for(let i=1; i <= this.diasUltimoPeriodo; i++) {
      this.array.push(i);
    }
    return this.array;
  }

  calcularFechasSolicitud(){
    console.log('calcula fecha regreso');
    let diasASolicitar: number= this.formulario.get('dias').value;
    console.log('dias a solicitar: ', diasASolicitar);
    const fechaInicioVacaciones: Date = new Date(this.formulario.get('fechainicio').value);
    this.vacacionesService.calculaFechasSolicitud(this.usuarioService.usuario, this.usuarioService.empresa, this.formulario.get('fechainicio').value, diasASolicitar)
    .subscribe(
      data => {
        console.log('fecha a regresar: '+data);
        this.formulario.get('fechafin').setValue(data[0][0]);
        this.formulario.get('fecharegreso').setValue(data[0][1]);
      }
    )
  }

  validaFecha() {
    console.log('validaFecha ', this.formulario.get('fechainicio').value);
    let fechaInicio =  this.formatoddmmyyyy(this.formulario.get('fechainicio').value)
    console.log('validaFecha parseada ', fechaInicio);
    this.vacacionesService.validaFechaInicio(this.usuarioService.usuario, this.usuarioService.empresa, fechaInicio)
    .subscribe(
      data=> {
        console.log('validaFecha: ', data['valido']);
        if (data['valido']) {
          this.campoFechaInicioValido = true;
          this.mensajeValidacionFechaInicio = '';
          this.actualizaCampos();
        } else {
          this.campoFechaInicioValido = false;
          this.mensajeValidacionFechaInicio = data['mensaje'];
          this.formulario.get('fechainicio').setErrors({noValido: true})
          swal.fire({
            icon: 'error',
            title:
              '¡Por favor verifique la fecha de inicio!',
            text: data['mensaje'],
            showConfirmButton: true
          });
          this.formulario.get('fechafin').setValue('');
          this.formulario.get('fecharegreso').setValue('');
        }
      }
    )
  }

  actualizaCampos() {
    console.log(this.formulario.get('dias').errors);
    if(this.formulario.get('dias').errors) {
      this.formulario.get('fechafin').setValue('');
      this.formulario.get('fecharegreso').setValue('');
    } else {
      this.calcularFechasSolicitud();
    }
  }

  enviarSolicitud() {
    console.log(' formulario valido', this.formulario.valid);
    console.log('Valores: ', this.formulario.controls)
    Object.values( this.formulario.controls ).forEach( control => {
      control.markAsTouched();
    });
    if(this.formulario.valid){
      if (!this.campoFechaInicioValido) {
        swal.fire({
          title: '¡Por favor valide la fecha de inicio!',
          text: this.mensajeValidacionFechaInicio,
          icon: 'error'
        })
      } else if (this.formulario.valid){
        swal.fire({
          title: 'Confirmación',
          text: '¿Esta seguro(a) de que desea enviar la solicitud?',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            console.log('enviar solicitud');
          }
        });
      } else {
        console.log(this.formulario.controls);
        swal.fire({
          title: '¡Por favor valide el formulario!',
          text: 'Verifique que los campos de fecha de inicio y total de dias a solicitar no esten vacios',
          icon: 'error'
        })
      }
    }
  }

  formatoddmmyyyy(fecha){
    let anio = fecha.substring(0, 4);
    let mes = fecha.substring(5,7);
    let dia = fecha.substring(8,11);
    let ensamble = dia +"/"+ mes+"/"+ anio;
    return ensamble;
  }
}
