import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { KiopersonalizacionesService } from 'src/app/services/kiopersonalizaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  fotoPerfil;
  url = 'assets/images/fotos_empleados/sinFoto.jpg';
  formulario: FormGroup;

  // datos = null;

  constructor(
    private fb: FormBuilder,
    public usuarioServicio: UsuarioService, private kioPersonalizaciones: KiopersonalizacionesService, private cadenasKioskos: CadenaskioskosappService) {
    this.crearFormulario();
  }

  ngOnInit() {
    //this.cargaFoto();
    this.getInfoUsuario();
  }

  cargarDatosIniciales(){
    this.cargarDatos();
    this.cargarDatosFamilias();  
    this.cargarTelefonosEmpleado();
    //this.cargaFoto();
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

  crearFormulario() {
    this.formulario = this.fb.group(
      {
        mensaje: ["", Validators.required]
      }
    );
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

  cargarDatosFamilias() {
    if (this.usuarioServicio.datosFamilia == null) {
      this.usuarioServicio.getDatosUsuarioFamilia(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.usuarioServicio.datosFamilia = data;
            console.log('datosFam', this.usuarioServicio.datosFamilia);
          }
        );
    }
  }

  cargarTelefonosEmpleado() {
    if (this.usuarioServicio.telefonosEmpleado == null) {
      this.usuarioServicio.getTelefonosEmpleado(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
        .subscribe(
          data => {
            this.usuarioServicio.telefonosEmpleado = data;
            console.log('telefonos', this.usuarioServicio.telefonosEmpleado);
          }
        );
    }
  } 

  FactorRHp(n) {
    let resultado;
    if (n != 'N') { // true
      resultado = 'POSITIVO';
    } else {
      resultado = 'NEGATIVO';
    }
    return resultado;
  }

  cargaFoto() {
    /*console.log('getDocumentoDatosPersonales');
    this.usuarioServicio.getDocumentoSeudonimo(this.usuarioServicio.usuario, this.usuarioServicio.empresa)
      .subscribe(
        data => {
          console.log(data);
          this.fotoPerfil = data['result'];
          console.log('documento: ' + this.fotoPerfil);
          document.getElementById('fotoPerfilEmpl1').setAttribute('src',
            `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`);
        }
      );*/
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
          this.usuarioServicio.enviaCorreoNovedadRRHH(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.formulario.get('mensaje').value,
            'Solicitud para Corrección de Datos Personales', this.usuarioServicio.urlKioscoDomain, this.usuarioServicio.grupoEmpresarial, this.usuarioServicio.cadenaConexion)
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



