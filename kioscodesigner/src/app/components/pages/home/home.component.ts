import { Component, OnInit, Injectable, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
import { VacacionesService } from 'src/app/services/vacaciones.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


@Injectable()
export class HomeComponent implements OnInit {
  @Input() urlLogoEmpresaDarkXl = 'assets/images/fotos_empleados/logodesigner-dark-xl.png'; // recibe valor de pages.component
  totalDiasVacacionesProv: any = "...";

  constructor(public usuarioServicio: UsuarioService, private router: Router,
              private opcionesKioskosService: OpcionesKioskosService, private vacacionesService: VacacionesService, private usuarioService: UsuarioService) {
              }

  ngOnInit() {
       // consultar total dias provisionados
   this.vacacionesService.getDiasVacacionesProvisionadas(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion )
   .subscribe(
     data => {
       this.totalDiasVacacionesProv = data;
       console.log(" totalDiasVacacionesProv ", data);
     }
   );
  }



}
