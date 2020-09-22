import { Component, OnInit } from '@angular/core';
import { KiopreguntasfrecuentesService } from 'src/app/services/kiopreguntasfrecuentes.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  kioPregF;

  constructor(private kioPreguntasFrecuentes: KiopreguntasfrecuentesService ) { }

  ngOnInit() {
    this.kioPreguntasFrecuentes.getKioPreguntasFrecuentes('811025446')
    .subscribe(
      data => {
        console.log(data);
        this.kioPregF = data;
      }
    );
  }

}
