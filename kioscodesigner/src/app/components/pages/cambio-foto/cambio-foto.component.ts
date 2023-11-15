import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import { ManejoArchivosService } from 'src/app/services/manejo-archivos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-foto',
  templateUrl: './cambio-foto.component.html',
  styleUrls: ['./cambio-foto.component.scss']
})
export class CambioFotoComponent implements OnInit {

  formulario: FormGroup;
  url: String = '/assets/images/fotos_empleados/sinFoto.jpg';
  fotoPerfil: any;
  formato: string = '';
  // variable archivo seleccionado 10/septiembre
  fileToUpload: File = {} as File;
  habilitaBtnCargar = false;
  msjValidFotoPerfil = '';
  imageToShow: any;

  // recibe valor de pages.component
  @Input() urlFotoPerfil: string = '';
  // emite a pages.component
  @Output() cambio = new EventEmitter();

  constructor(private usuarioService: UsuarioService,
    private cadenasKioskos: CadenaskioskosappService,
    private fb: FormBuilder,
    private fileUploadService: ManejoArchivosService,
    private http: HttpClient,
    private router: Router) {
    this.formulario = this.fb.group({
      profile: ['']
    });
  }

  ngOnInit() {
    this.getInfoUsuario();
  }

  // obtener la información del usuario del localStorage y guardarla en el service
  getInfoUsuario() {
    const sesion = this.usuarioService.getUserLoggedIn();
    this.usuarioService.setUsuario(sesion['usuario']);
    this.usuarioService.setEmpresa(sesion['empresa']);
    this.usuarioService.setTokenJWT(sesion['JWT']);
    this.usuarioService.setGrupo(sesion['grupo']);
    this.usuarioService.setUrlKiosco(sesion['urlKiosco']);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
      .subscribe(
        (data: any) => {
          for (let i in data) {
            if (data[i][3] === sesion['grupo']) { // GRUPO
              const temp = data[i];
              this.usuarioService.cadenaConexion = temp[4];
              this.cargarDatosIniciales();
            }
          }
        }
      );
  }

  cargarDatosIniciales() {
    this.cargarFotoActual();
  }

  cargarFotoActual() {
    this.url = `${environment.urlKioskoReportes}conexioneskioskos/obtenerFotoPerfil?cadena=${this.usuarioService.cadenaConexion}&usuario=${this.usuarioService.usuario}&nit=${this.usuarioService.empresa}`;
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      console.log('archivo seleccionado');
      const file = event.target.files[0];
      console.log(file);
      this.formulario.get('profile')!.setValue(file);
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
        this.formato = file.type;
        if (event.target.files) {
          const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event: any) => {
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
    //const nombreFoto: any = this.fotoPerfil;
    formData.append('fichero', this.formulario.get('profile')!.value, this.usuarioService.empresa + '_' + this.usuarioService.usuario + '.' + this.formato.slice(6));
    this.http
      .post<any>(
        `${environment.urlKioskoReportes}conexioneskioskos/cargarFoto?seudonimo=${this.usuarioService.usuario}&nit=${this.usuarioService.empresa}&cadena=${this.usuarioService.cadenaConexion}`, formData
      )
      .subscribe(
        (data: any) => {
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

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0)!;
  }

  uploadFileToActivity() {
    this.http.post(`${environment.urlKioskoReportes}conexioneskioskos/cargarFoto`, this.fileToUpload)
      .subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
  }

  close() {
    console.log('close');
    this.cargarFotoActual();
  }

}
