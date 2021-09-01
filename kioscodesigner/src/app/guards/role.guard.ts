import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private usuarioServicio: UsuarioService,
    private router: Router
  ) {
  }
  //this.usuarioServicio.tipoUsuario = "NOMINA";//this.usuarioServicio.isAutenticado()
  texto = "";
  rol = "JEFE";
  canActivate(): boolean {
    this.traerUsuario();
    //console.log("usted tiene usuario: "+ this.rol)
    if (this.rol === "NOMINA" || this.rol === "EMPLEADO" || this.rol === "JEFE" ) { // Trae el rol del localstorage, permite el ingreso
      //this.traertexto();
      return true;
    } /*else if (this.rol === "EMPLEADO") {
      console.log("usted tiene usuario empleado")
      this.traertexto();
      this.router.navigateByUrl(this.router.url);
      return false;
    } else if (this.rol === "JEFE") {
      console.log("usted tiene usuario jefe")
      return true;
    } else if (this.rol === "AUTORIZADOR") {
      console.log("usted tiene usuario autorizador")
      return true;
    }*/ else {
      this.traertexto();
      this.router.navigateByUrl(this.router.url);
      return false;  
    }
  }
  traerUsuario() {
    console.log(this.usuarioServicio.usuario);
    //console.log('ruta prueba: ' + this.router.url);
    this.usuarioServicio.tipoUsuario = this.rol;
    //    console.log('ruta prueba - route: '+ this.router.navigated)
  }
  traertexto() {
    
    Swal.fire({
      title: '¡No tiene el permisos necesarios!',
      text: "",
      icon: 'warning'

    })
  }

}

