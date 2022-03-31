import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ManejoArchivosService } from '../../../services/manejo-archivos.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';

@Component({
  selector: 'app-cambio-foto',
  templateUrl: './cambio-foto.component.html',
  styleUrls: ['./cambio-foto.component.css']
})
export class CambioFotoComponent implements OnInit {

  imageToShow: any;
  url = 'assets/images/fotos_empleados/sinFoto.jpg';
  isImageLoading = false;
  formulario: FormGroup;

  fileToUpload: File = null; // variable archivo seleccionado 10/septiembre
  fotoPerfil;
  habilitaBtnCargar = false;
  msjValidFotoPerfil = '';
  @Input() urlFotoPerfil: string; // recibe valor de pages.component
  @Output() cambio = new EventEmitter(); // emite a pages.component

  constructor(private usuarioService: UsuarioService, private cadenasKioskos: CadenaskioskosappService, private fb: FormBuilder, private fileUploadService: ManejoArchivosService,
              private http: HttpClient, private router: Router) {
      //this.cargarFotoActual();
      this.formulario = this.fb.group({
        profile: ['']
      });
  }

  ngOnInit() {
    this.getInfoUsuario();
  }

  getInfoUsuario() { // obtener la información del usuario del localStorage y guardarla en el service
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    // console.log('usuario: ' + this.usuarioService.usuario + ' empresa: ' + this.usuarioService.empresa);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
    .subscribe(
      data => {
        //console.log('getInfoUsuario', data);
        //console.log(sesion['grupo']);
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          //console.log('cadena: ', temp[4]) // CADENA
          this.usuarioService.cadenaConexion=temp[4];
          //console.log('pages CADENA: ', this.usuarioService.cadenaConexion)
          this.cargarDatosIniciales();
          }
        }
      }
    );
  } 

  cargarDatosIniciales(){
    this.cargarFotoActual();
    //this.fotoActual();
  }

  cargarFotoActual() {
    // this.url='http://www.nominadesigner.co:8080/wsreporte/webresources/conexioneskioskos/obtenerFoto/1032508864.jpg';
    this.usuarioService.getDocumentoSeudonimo(this.usuarioService.usuario, this.usuarioService.empresa, this.usuarioService.cadenaConexion)
    .subscribe(
      data => {
        //console.log('foto actual: ' , data);
        this.fotoPerfil = data['result'];
        //console.log('documento: ' + this.fotoPerfil);
        this.usuarioService.documento=this.fotoPerfil;
        this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg?cadena=${this.usuarioService.cadenaConexion}&usuario=${this.usuarioService.usuario}&empresa=${this.usuarioService.empresa}`;
        /* document.getElementById("imgPrevia").setAttribute("src", 
        `http://www.nominadesigner.co:8080/wsreporte/webresources/conexioneskioskos/obtenerFoto/${this.fotoPerfil}.jpg`); */
      }
    );
  }

  // crearFormulario() {
  //   this.formulario = this.fb.group({
  //     passActual: ['', Validators.required],
  //   });
  // }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      console.log('archivo seleccionado');
      const file = event.target.files[0];
      console.log(file);
      this.formulario.get('profile').setValue(file);
      if (file.type === 'image/jpeg' ) {
          //console.log('Es .jpg');
          // cargar foto previa
          if (event.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = ( event: any) => {
            this.url = event.target.result;
            };
          }
          this.msjValidFotoPerfil = '';
          this.habilitaBtnCargar = true;
      } else {
        this.msjValidFotoPerfil = 'El tipo de archivo seleccionado no es válido.';
        this.habilitaBtnCargar = false;
      }

    } else {
      swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        showConfirmButton: true
      });
    }
  }

/*  onSelectFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event: any)=>{
        this.url = event.target.result;
      }
    }
  }*/

  onSubmit() {
    const formData = new FormData();
    const nombreFoto: any = this.fotoPerfil;
    //console.log(nombreFoto);
    formData.append('fichero', this.formulario.get('profile').value, nombreFoto + '.jpg');

    this.http
      .post<any>(
        `${environment.urlKioskoReportes}conexioneskioskos/cargarFoto?nit=${this.usuarioService.empresa}&cadena=${this.usuarioService.cadenaConexion}`, formData
      )
      .subscribe(
        (data) => {
          //console.log(data);
        },
        (error) => {
          if (error.status === 200) {
            this.cambio.emit(this.url);
            swal
              .fire({
                icon: 'success',
                title: 'Se ha actualizado tu foto de perfil exitosamente.',
                showConfirmButton: true,
              })
              .then((result) => {
                $('#modalCambioFoto').modal('hide');
                this.router.navigated = false;
                this.router.navigate([this.router.url]);
              });
          } else if (error.status !== 200) {
            swal
              .fire({
                icon: 'error',
                title: 'Se ha presentado un error',
                text:
                  'No se ha podido cargar la foto de perfil, por favor inténtalo de nuevo más tarde.',
                showConfirmButton: true,
              })
              .then((result) => {
                $('#modalCambioFoto').modal('hide');
                this.router.navigated = false;
                this.router.navigateByUrl('/home');
              });
          }
        }
      );
    //console.log(this.formulario.value);
  }
  

createImageFromBlob(image: Blob) {
   const reader = new FileReader();
   reader.addEventListener('load', () => {
      this.imageToShow = reader.result;
   }, false);

   if (image) {
      reader.readAsDataURL(image);
   }
}

/*getImageFromService() {
      this.isImageLoading = true;
      this.usuarioService.getImage('').subscribe(data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
        console.log(data);
      }, error => {
        this.isImageLoading = false;
        console.log(error);
      });
}*/

// pruebaImagen(image: Blob){
//   console.log('aqui se debe enviar imagen', image);
// }

handleFileInput(files: FileList) { // 10 sep
  this.fileToUpload = files.item(0);
  //console.log(this.fileToUpload);
}

uploadFileToActivity() { // 10 sep
  //console.log('envio');
  /*this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
    // do something, if upload success
    }, error => {
      console.log(error);
    });*/
    /*const fd = new FormData();
    fd.append('file', this.fileToUpload, 'miarchivo.jpg');*/
  this.http.post(`${environment.urlKioskoReportes}conexioneskioskos/cargarFoto`, this.fileToUpload)
  .subscribe(
    (response) => console.log(response),
    (error) => console.log(error)
  );
}


cambiar() {
  //this.cambio.emit('Dato emitido');
}

close() {
  console.log('close');
  this.cargarFotoActual();
}
  //eliminar la foto del usuario 
  /*
  fotoActual(){
    this.usuarioService.getValidaFoto(this.usuarioService.usuario, this.usuarioService.cadenaConexion, this.usuarioService.empresa)
      .subscribe(
        data => {
          console.log('data: ' , data);
          this.usuarioService.existefotoPerfil = data;
        }
      );
  }
  eliminarFoto(){
    if (!this.usuarioService.existefotoPerfil) {
      swal
        .fire({
          icon: "error",
          title: "Por favor actualice su foto",
          text:"",
          showConfirmButton: true,
        })
    } else {
      swal.fire({
        title: "Eliminando Foto, por favor espere...",
        onBeforeOpen: () => {
          swal.showLoading();
          //console.log("descargarReporte");
          this.usuarioService.getGenerarQR(
            this.usuarioService.usuario,
            this.usuarioService.telefonosEmpleado[0][0],
            this.usuarioService.datosPersonales[0][12],
            this.usuarioService.datosPersonales[0][20],
            this.usuarioService.datosPersonales[0][17],
            this.usuarioService.cadenaConexion,
            this.usuarioService.empresa
          )
            .subscribe(
              (data) => {
                swal
                .fire({
                  icon: "success",
                  title: "Su foto se ha eliminado correctamente",
                  showConfirmButton: true,
                })
                .then((res) => {
                  $("#staticBackdrop").modal("hide");
                  this.formulario.get('mensaje').setValue('');
                });
              },
              (error) => {
                swal
                  .fire({
                    icon: "error",
                    title: "Hubo un error al eliminar su foto",
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

    }
  }*/

}
