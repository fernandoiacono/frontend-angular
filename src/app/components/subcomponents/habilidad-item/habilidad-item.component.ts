import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { HabilidadModel } from 'src/app/models/Habilidad';

@Component({
  selector: 'app-habilidad-item',
  templateUrl: './habilidad-item.component.html',
  styleUrls: ['./habilidad-item.component.css']
})
export class HabilidadItemComponent implements OnInit, AfterViewInit {

  @Input() habilidad: HabilidadModel = new HabilidadModel;
  @Input() userLoggedIn: boolean = false;
  
  @ViewChild ('countup') numeroPorcentaje: any;
  @ViewChild ('circle') barraPorcentaje: any;


  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      this.animateCountUp(this.numeroPorcentaje.nativeElement);
      this.animateCircle(this.barraPorcentaje.nativeElement, this.habilidad.porcentaje);
  }

  // Contador Numeros
  animationDuration: number = 1200;
  frameDuration:number = 1000 / 60;
  totalFrames: any = Math.round( this.animationDuration / this.frameDuration );

  easeOutQuad(t: number) {
    return t * ( 2 - t );
  }

  animateCountUp(el: any) {
	let frame = 0;
    const countTo = parseInt( el.innerText, 10 );
    const counter = setInterval( () => {
      frame++;
      const progress = this.easeOutQuad( frame / this.totalFrames );
      const currentCount = Math.round( countTo * progress );
      if ( parseInt( el.innerText, 10 ) !== currentCount ) {
        el.innerText = currentCount;
      }
      if ( frame === this.totalFrames ) {
        clearInterval( counter );
      }
    }, this.frameDuration );
  };

  animateCircle(element: any, percent : number) {
    element.style.strokeDasharray = `${percent}, 100`;
  }
}
