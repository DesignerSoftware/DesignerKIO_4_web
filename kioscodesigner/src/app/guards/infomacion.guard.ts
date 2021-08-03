import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class InfomacionGuard implements CanActivate {
  constructor(private usuarioServicio: UsuarioService,
    private router: Router
  ) {
  }
  //this.usuarioServicio.tipoUsuario = "NOMINA";//this.usuarioServicio.isAutenticado()
  texto = "";
  rol = "AUTORIZADOR";
  canActivate(): boolean {
    this.traerUsuario();
    console.log("usted tiene usuario: "+ this.rol)
    if (this.rol === "NOMINA" || this.rol === "EMPLEADO" || this.rol === "JEFE" ) { // Trae el rol del localstorage, permite el ingreso
      //this.traertexto();
      return true;
    } else {
      this.traertexto();
      this.router.navigateByUrl(this.router.url);
      return false;
      
    }
  }
  traerUsuario() {
    console.log(this.usuarioServicio.usuario);
    console.log('ruta prueba: ' + this.router.url);
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
