import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-cambio-foto',
  templateUrl: './cambio-foto.component.html',
  styleUrls: ['./cambio-foto.component.css']
})
export class CambioFotoComponent implements OnInit {
  imageToShow: any;
  url = '../../assets/images/fotos_empleados/sinFoto.jpg';
  isImageLoading = false;

  constructor(private usuarioService: UsuarioService) {
  }

  ngOnInit() {
  }

  onSelectFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event: any)=>{
        this.url = event.target.result;
      }
    }
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

}
