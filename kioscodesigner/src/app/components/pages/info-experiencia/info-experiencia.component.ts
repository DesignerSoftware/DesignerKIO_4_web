import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-info-experiencia',
  templateUrl: './info-experiencia.component.html',
  styleUrls: ['./info-experiencia.component.css']
})
export class InfoExperienciaComponent implements OnInit {
 
  experienciaSeleccionado = null;
  fotoPerfil;
  url = 'assets/images/fotos_empleados/sinFoto.jpg';
  formularioEl: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    public usuarioServicio: UsuarioService, 
    private cadenasKioskos: CadenaskioskosappService, 
    ) {
      this.crearFormulario();
    }

  ngOnInit() {
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    } 
  }

  
  crearFormulario() {
    this.formularioEl = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
  }  

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenasKioskosEmp(sesion['grupo'])
    .subscribe(
      data => {
        console.log('getInfoUsuario', data);
        console.log(sesion['grupo']);
        
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
          this.cargarDatosIniciales();
          }
        }
      }
    );
  }

  cargarDatosIniciales(){
    this.cargarDatos();
    this.cargarExperienciaLaboral();  
  }

  cargarDatos() {
    if (this.usuarioServicio.datosPersonales == null) {
      this.usuarioServicio.getDatosUsuario(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.usuarioServicio.datosPersonales = data;
            console.log('datos', this.usuarioServicio.datosPersonales);
          }
        );
    }
  }

  cargarExperienciaLaboral() {
    if (this.usuarioServicio.datosExperienciaLab == null) {
      this.usuarioServicio.getDatosExpLabEmpleado(this.usuarioServicio.usuario, this.usuarioServicio.empresa,  this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.usuarioServicio.datosExperienciaLab = data;
            console.log('datosExperienciaLab', this.usuarioServicio.datosExperienciaLab);          }
        );
    }
  }

  abrirModal() {
    document.getElementById('staticBackdropELab').style.display = 'block';
    $("#staticBackdropELab").modal("show");
  }
  
  enviarReporteNovedad() {
    console.log('enviar', this.formularioEl.controls);
    if (this.formularioEl.valid) {
      swal.fire({
        title: "Enviando mensaje al área de nómina y RRHH, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          this.usuarioServicio.enviaCorreoNovedadRRHH(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.formularioEl.get('mensaje').value,
          'Solicitud para Corrección de Experiencia Laboral',
            this.usuarioServicio.urlKioscoDomain, this.usuarioServicio.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
            .subscribe(
              (data) => {
               // console.log(data);
                if (data) {
                  swal
                    .fire({
                      icon: "success",
                      title:
                        "Mensaje enviado exitosamente al área de nómina y RRHH para su validación.",
                      showConfirmButton: true,
                    })
                    .then((res) => {
                      $("#staticBackdropELab").modal("hide");
                      this.formularioEl.get('mensaje').setValue('');
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
                      $("#staticBackdropELab").modal("hide");
                      this.formularioEl.get('mensaje').setValue('');
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
                    $("#staticBackdropELab").modal("hide");
                    this.formularioEl.get('mensaje').setValue('');
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
