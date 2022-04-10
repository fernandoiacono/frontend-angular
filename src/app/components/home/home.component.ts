import { Component, OnInit } from '@angular/core';
import { EducacionModel } from 'src/app/models/Educacion';
import { ExperienciaLaboralModel } from 'src/app/models/ExperienciaLaboral';
import { HabilidadModel } from 'src/app/models/Habilidad';
import { PersonaModel } from 'src/app/models/Persona';
import { ProyectoModel } from 'src/app/models/Proyecto';
import { AuthService } from 'src/app/services/auth.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Main } from 'tsparticles';
import { Container } from 'tsparticles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  
  id = "tsparticles";
  particlesUrl = "http://localhost:4200/assets/json/partOptions.json";

  persona : PersonaModel = new PersonaModel();
  personaEducacion: EducacionModel[] = [];
  personaExperienciaLaboral: ExperienciaLaboralModel[] = [];
  personaHabilidades : HabilidadModel[] = [];
  personaProyectos: ProyectoModel[] = [];
  
  userLoggedIn: boolean = false;

  constructor(private _personaService : PersonaService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getPersonaById(1);
    this.userLoggedIn = this.checkAuthentication();
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

  checkAuthentication() : boolean{
    if(this.authService.logIn)
      return true;
    else
      return false;
  }

}