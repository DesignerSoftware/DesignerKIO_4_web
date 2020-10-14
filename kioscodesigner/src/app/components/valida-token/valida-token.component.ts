import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-valida-token',
  templateUrl: './valida-token.component.html',
  styleUrls: ['./valida-token.component.css']
})
export class ValidaTokenComponent implements OnInit {
  token = 'No se ha recibido token';
  mensaje1 = '';
  mensaje2 = 'Estamos validando tu cuenta, por favor espere un momento.';
  respuesta = false;

  constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService) {
  this.activatedRoute.params
  .subscribe(params => {
    // console.log(params);
    this.token = params['token'];
    console.log('token recuperado', this.token);
    this.validarToken(params['token']);
  });
}

  ngOnInit() {

  }

  validarToken(token: string) {
        // verifica si el token es válido
        this.usuarioService.validaToken(token)
        .subscribe(
          (data) => {
            console.log('data', data);
            if (data['validoToken'] === true) {
              console.log('Token es válido');
              console.log(data["usuario"]);
              this.mensaje1 = 'Activando usuario...';
              this.usuarioService
              // habilita cuenta kiosco
                .cambiaEstadoUsuario(data['usuario'], data['empresa'], 'S')
                .subscribe((data) => {
                  if (data['modificado'] === true) {
                    console.log('Se ha activado el usuario');
                     // inhabilita token
                    this.usuarioService.inactivaToken(this.token).subscribe(
                      (data) => {
                        if (data['modificado'] === true) {
                          console.log('Se ha inhabilita el token');
                          this.mensaje1 = '¡Felicitaciones!';
                          this.mensaje2 =
                            'Tu cuenta se ha validado correctamente y ya puedes ingresar a tu Kiosco.';
                          this.respuesta = true;
                          /*swal.fire({
                            icon: 'error',
                            title: 'Se ha inhabilitado Token',
                            showConfirmButton: true
                          });*/
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
              /*swal.fire({
                icon: 'error',
                title: data['mensaje'],
                showConfirmButton: true
              });*/
            }
          },
          (error) => {
           /* swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error de conexión.',
              text: 'Por favor intentélo de nuevo más tarde.',
              showConfirmButton: true,
            });*/
            this.respuesta = true;
            this.mensaje2 = 'Ha ocurrido un error de conexión, por favor inténtalo de nuevo más tarde.';
          }
        );
  }

}
