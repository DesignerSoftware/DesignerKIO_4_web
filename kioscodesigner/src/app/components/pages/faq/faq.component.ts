import { Component, OnInit } from '@angular/core';
import { KiopreguntasfrecuentesService } from 'src/app/services/kiopreguntasfrecuentes.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(private kioPreguntasFrecuentes: KiopreguntasfrecuentesService ) { }

  ngOnInit() {}

}
