import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManejoArchivosService } from '../../../services/manejo-archivos.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-cambio-foto',
  templateUrl: './cambio-foto.component.html',
  styleUrls: ['./cambio-foto.component.css']
})
export class CambioFotoComponent implements OnInit {
  imageToShow: any;
  url = '../../assets/images/fotos_empleados/sinFoto.jpg';
  isImageLoading = false;
  formulario: FormGroup;

  fileToUpload: File = null; // variable archivo seleccionado 10/septiembre


  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private fileUploadService: ManejoArchivosService,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.formulario = this.fb.group({
      profile: ['']
    });
  }

  // crearFormulario() {
  //   this.formulario = this.fb.group({
  //     passActual: ['', Validators.required],
  //   });
  // }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formulario.get('profile').setValue(file);
    }
  }
  // onSelectFile(e) {
  //   if (e.target.files) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(e.target.files[0]);
  //     reader.onload=(event: any)=>{
  //       this.url = event.target.result;
  //     }
  //   }
  // }

  onSubmit() {
    // const formData = new FormData();
    // formData.append('file', this.formulario.get('profile').value);

    // this.http.post<any>('http://www.nominadesigner.co:8080/wsreporte/webresources/conexioneskioskos/cargarFoto', formData  ).subscribe(
    //   (res) => console.log(res),
    //   (err) => console.log(err)
    // );
    console.log(this.formulario.value);
  }

createImageFromBlob(image: Blob) {
   let reader = new FileReader();
   reader.addEventListener("load", () => {
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
  console.log(this.fileToUpload);
}

uploadFileToActivity() { // 10 sep
  console.log('envio');
  /*this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
    // do something, if upload success
    }, error => {
      console.log(error);
    });*/
    /*const fd = new FormData();
    fd.append('file', this.fileToUpload, 'miarchivo.jpg');*/
    this.http.post('http://www.nominadesigner.co:8080/wsreporte/webresources/conexioneskioskos/cargarFoto', this.fileToUpload)
    .subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )
}

}
