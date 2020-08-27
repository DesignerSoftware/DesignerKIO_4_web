import { Component, OnInit, Injectable } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


@Injectable()
export class HomeComponent implements OnInit {

  constructor(private usuarioServicio: UsuarioService, private router: Router, private opcionesKioskosService: OpcionesKioskosService) { }

  ngOnInit() {
  }

}
