import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioServicio: UsuarioService,
              private router: Router) {
  }

  canActivate(): boolean {
    console.log('AuthGuard canActivate');
    if (this.usuarioServicio.isAutenticado()) { // si existe el registro del usuario en el localstorage, permitir el ingreso
      return true;
    } else {
      //this.router.navigateByUrl('/login');
      //this.router.navigate(['login'] );
      this.router.initialNavigation();
      return false;
    }
  }

}
