import { Component, OnInit } from '@angular/core';
import { AusentismosService } from 'src/app/services/ausentismos.service';

@Component({
  selector: 'app-procesar-ausentismos',
  templateUrl: './procesar-ausentismos.component.html',
  styleUrls: ['./procesar-ausentismos.component.css']
})
export class ProcesarAusentismosComponent implements OnInit {

  constructor(private ausentismosService: AusentismosService) { }

  ngOnInit() {
  }

}
