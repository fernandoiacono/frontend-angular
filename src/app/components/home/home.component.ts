import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, ElementRef, Directive } from '@angular/core';
import { EducacionModel } from 'src/app/models/Educacion';
import { ExperienciaLaboralModel } from 'src/app/models/ExperienciaLaboral';
import { HabilidadModel } from 'src/app/models/Habilidad';
import { PersonaModel } from 'src/app/models/Persona';
import { ProyectoModel } from 'src/app/models/Proyecto';
import { PersonaService } from 'src/app/services/persona.service';
import { Main } from 'tsparticles';
import { Container } from 'tsparticles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit {
  
  id = "tsparticles";
  particlesUrl = "http://localhost:4200/assets/json/partOptions.json";

  persona : PersonaModel = new PersonaModel();
  personaEducacion: EducacionModel[] = [];
  personaExperienciaLaboral: ExperienciaLaboralModel[] = [];
  personaHabilidades : HabilidadModel[] = [];
  personaProyectos: ProyectoModel[] = [];
  proyectosCss: string[] = ['proy-laautopista-img', 'proy-malvinas-img', 'proy-lab-img'];
  
  @ViewChild('countup') numerosPorcentaje! : ElementRef;


  constructor(private _personaService : PersonaService) { }

  ngOnInit(): void {
    this.getPersonaById(1);
	//this.animateCountUp(document.querySelectorAll('.countup'));
	// document.querySelectorAll('.countup').forEach( elem => {
	// 	console.log('hola')
	// 	this.animateCountUp(elem);
	// });
  }

  ngAfterViewInit(): void {
	console.log(this.numerosPorcentaje.nativeElement);
  }
  
  particlesLoaded(container: Container): void {
    document.querySelector('#tsparticles canvas')?.setAttribute('height', '1080');
  }
  
  particlesInit(main: Main): void {
      //console.log(main);
  }

	getPersonaById(id: number) {
		this._personaService.getPersonaById(id).subscribe(data => {
			this.persona = data;
      		this.personaEducacion = this.persona.educacion;
      		this.personaExperienciaLaboral = this.persona.experiencia_laboral.sort(this.sortArray);
      		this.personaHabilidades = this.persona.habilidades.sort(this.sortArray);
      		this.personaProyectos = this.persona.proyectos.sort(this.sortArray);
		});
	}

  sortArray(a: any, b: any) {
    
	if (a.orden > b.orden) {
    	return 1;
    }
    
	if (a.orden < b.orden) {
    	return -1;
    }
    
	return 0;
  }

  // Contador Numeros
  animationDuration: number = 1500;
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
}