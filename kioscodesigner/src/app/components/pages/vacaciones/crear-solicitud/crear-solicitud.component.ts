import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

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
        this.diasUltimoPeriodo = data[0]['diasPendientes'];
        console.log(" ultimoPeriodo ", this.ultimoPeriodo);
        console.log(" diasUltimoPeriodo ", this.diasUltimoPeriodo);
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
      periodo: [, Validators.required],
    });
  }
    
  public creaListaDias(){
    for(let i=1; i <= this.diasUltimoPeriodo; i++) {
      this.array.push(i);
    }
    return this.array;
  }

  enviar(){
    console.log('enviar formulario', this.formulario.value);
    
  }

}
