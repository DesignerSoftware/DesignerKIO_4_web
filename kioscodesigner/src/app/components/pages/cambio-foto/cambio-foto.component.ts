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

  formato:string;

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
   
    this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFotoPerfil?cadena=${this.usuarioService.cadenaConexion}&usuario=${this.usuarioService.usuario}&nit=${this.usuarioService.empresa}`;

  }

  
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      console.log('archivo seleccionado');
      const file = event.target.files[0];
      console.log(file);
      this.formulario.get('profile').setValue(file);
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' ) {
        this.formato=file.type;
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



  onSubmit() {
    const formData = new FormData();
    const nombreFoto: any = this.fotoPerfil;
    // console.log('this.usuarioService.usuario'+this.usuarioService.usuario);
    formData.append('fichero', this.formulario.get('profile').value,this.usuarioService.empresa+'_'+this.usuarioService.usuario + '.'+this.formato.slice(6));

    this.http
      .post<any>(
        `${environment.urlKioskoReportes}conexioneskioskos/cargarFoto?seudonimo=${this.usuarioService.usuario}&nit=${this.usuarioService.empresa}&cadena=${this.usuarioService.cadenaConexion}`, formData
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

uploadFileToActivity() { 

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
  

}
