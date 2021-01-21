import { Component, OnInit, Injectable, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


@Injectable()
export class HomeComponent implements OnInit {
  @Input() urlLogoEmpresaDarkXl = 'assets/images/fotos_empleados/logodesigner-dark-xl.png'; // recibe valor de pages.component
  totalDiasVacacionesProv: any = "...";
  formulario: FormGroup;

  constructor(private fb: FormBuilder,    public usuarioServicio: UsuarioService, private router: Router,
              private opcionesKioskosService: OpcionesKioskosService, private vacacionesService: VacacionesService, private usuarioService: UsuarioService) {
              }

  ngOnInit() {
    this.crearFormulario();
    this.consultarDiasProvisionados();
  }

  crearFormulario() {
    this.formulario = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }

  consultarDiasProvisionados() {
    // consultar total dias provisionados
    this.vacacionesService
      .getDiasVacacionesProvisionadas(
        this.usuarioService.usuario,
        this.usuarioService.empresa,
        this.usuarioService.cadenaConexion
      )
      .subscribe((data) => {
        this.totalDiasVacacionesProv = data;
        console.log(" totalDiasVacacionesProv ", data);
      });
  }

  abrirModal() {
    $("#staticBackdrop").modal("show");
  }

  enviarReporteNovedad() {
    console.log('enviar', this.formulario.controls);
    if (this.formulario.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          this.usuarioService.enviaCorreoNovedadRRHH(this.usuarioService.usuario, this.usuarioService.empresa, this.formulario.get('mensaje').value,
            this.usuarioService.urlKioscoDomain, this.usuarioService.grupoEmpresarial)
            .subscribe(
              (data) => {
                console.log(data);
                if (data) {
                  swal
                    .fire({
                      icon: "success",
                      title:
                        "Mensaje enviado exitosamente al área de nómina y RRHH para su validación.",
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#staticBackdrop").modal("hide");
                      this.formulario.get('mensaje').setValue('');
                    });
                } else {
                  swal
                    .fire({
                      icon: "error",
                      title: "No fue posible enviar el correo",
                      text: 'Por favor inténtelo de nuevo más tarde.',
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#staticBackdrop").modal("hide");
                      this.formulario.get('mensaje').setValue('');
                    });
                }
              },
              (error) => {
                swal
                  .fire({
                    icon: "error",
                    title: "Hubo un error al enviar la petición",
                    text:
                      "Por favor inténtelo de nuevo más tarde. Si el error persiste contáctese con el área de nómina y recursos humanos de su empresa.",
                    showConfirmButton: true,
                  })
                  .then((res) => {
                    $("#staticBackdrop").modal("hide");
                    this.formulario.get('mensaje').setValue('');
                  });
              }
            );
        },
        allowOutsideClick: () => !swal.isLoading(),
      });

    } else {
      swal.fire({
        icon: "error",
        title: "No ha digitado la observación",
        text:
          "Por favor digite una observación sobre la información que se debe corregir en el sistema.",
        showConfirmButton: true
      })
    }
  }
}
