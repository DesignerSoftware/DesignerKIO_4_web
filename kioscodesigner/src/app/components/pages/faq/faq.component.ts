import { Component, OnInit } from '@angular/core';
import { KiopreguntasfrecuentesService } from 'src/app/services/kiopreguntasfrecuentes.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(private kioPreguntasFrecuentes: KiopreguntasfrecuentesService ) { }

  ngOnInit() {

  }

}
