import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UsuarioService } from "../services/usuario.service";
import swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
  })
  export class RoleGuard implements CanActivate {
    constructor(private usuarioServicio: UsuarioService,
      private router: Router
    ) {
    }
    texto = "";
    rol = "JEFE";
    canActivate(): boolean {
      this.traerUsuario();
      if (this.rol === "NOMINA" || this.rol === "EMPLEADO" || this.rol === "JEFE" ) { // Trae el rol del localstorage, permite el ingreso
        return true;
      } else {
        this.traertexto();
        this.router.navigateByUrl(this.router.url);
        return false;  
      }
    }
    traerUsuario() {
      console.log(this.usuarioServicio.usuario);
      this.usuarioServicio.tipoUsuario = this.rol;
    }
    traertexto() {
      
      swal.fire({
        title: '¡No tiene el permisos necesarios!',
        text: "",
        icon: 'warning'
  
      })
    }
  
  }
  
  