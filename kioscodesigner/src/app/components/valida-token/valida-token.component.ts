import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-valida-token',
  templateUrl: './valida-token.component.html',
  styleUrls: ['./valida-token.component.css']
})
export class ValidaTokenComponent implements OnInit {
  token = 'No se ha recibido token';

  constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService) {
  this.activatedRoute.params
  .subscribe(params => {
    console.log(params);
    this.token = params['token'];
    this.usuarioService.validaToken(params['token'])
    .subscribe(
      data => {
        console.log(data);
        if (data == 0){
           console.log('Token es válido');
        } else {
            swal.fire({
            icon: 'error',
            title: 'Enlace no válido, genere nuevamente el token para validar su cuenta',
            showConfirmButton: true
          });
        }
      },
      (error) => {
        swal.fire({
          icon: 'error',
          title: 'Token no válido',
          text: 'Valide si el enlace es válido o vuelva a generar otro token para validar su cuenta.',
          showConfirmButton: true
        });
      }
    );
  });
}

  ngOnInit() {
  }

}
