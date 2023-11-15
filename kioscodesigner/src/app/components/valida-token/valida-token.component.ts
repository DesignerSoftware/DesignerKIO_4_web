import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-valida-token',
  templateUrl: './valida-token.component.html',
  styleUrls: ['./valida-token.component.scss']
})
export class ValidaTokenComponent implements OnInit {

  token = 'No se ha recibido token';
  mensaje1 = '';
  mensaje2 = 'Estamos validando tu cuenta, por favor espere un momento.';
  respuesta = false;
  jwt: string = '';

  constructor(private activatedRoute: ActivatedRoute, 
    public usuarioService: UsuarioService, 
    private router: Router) {
    this.activatedRoute.params
      .subscribe(params => {
        console.log(params);
        this.token = params['token'];
        console.log('token recuperado', this.token);
        this.validarToken(params['token']);
      });
  }

  ngOnInit() {

  }

  validarToken(token: string) {
    // verifica si el token es válido
    this.usuarioService.validaToken(token, this.usuarioService.cadenaConexion)
      .subscribe(
        (data: any) => {
          console.log('data', data);
          this.usuarioService.cadenaConexion = data["cadena"];
          this.usuarioService.grupoEmpresarial = data["grupo"];
          this.usuarioService.empresa = data['empresa'];
          if (data['validoToken'] === true) {
            console.log('Token es válido');
            console.log(data["usuario"]);
            console.log('cadena', data["cadena"]);
            console.log('grupo recibido: ' + this.usuarioService.grupoEmpresarial);
            this.mensaje1 = 'Activando usuario...';
            this.usuarioService
              // habilita cuenta kiosco
              .cambiaEstadoUsuario(data['usuario'], data['empresa'], 'S', data["cadena"])
              .subscribe((data: any) => {
                if (data['modificado'] === true) {
                  console.log('Se ha activado el usuario');
                  // inhabilita token
                  this.usuarioService.inactivaToken(this.token, this.usuarioService.empresa, this.usuarioService.cadenaConexion).subscribe(
                    (data: any) => {
                      if (data['modificado'] === true) {
                        console.log('Se ha inhabilitado el token');
                        this.mensaje1 = '¡Felicitaciones!';
                        this.mensaje2 =
                          'Tu cuenta se ha validado correctamente y ya puedes ingresar a tu Kiosco.';
                        this.respuesta = true;
                      }
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
                }
              });
          } else {
            this.respuesta = true;
            this.mensaje2 = data['mensaje'];
          }
        },
        (error) => {
          this.respuesta = true;
          this.mensaje2 = 'Ha ocurrido un error de conexión, por favor inténtalo de nuevo más tarde.';
        }
      );
  }

  dirigirLogin() {
    console.log('enviar a Login grupo: ', this.usuarioService.grupoEmpresarial)
    if (this.usuarioService.grupoEmpresarial != null) {
      this.router.navigate(['/login', this.usuarioService.grupoEmpresarial]);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
