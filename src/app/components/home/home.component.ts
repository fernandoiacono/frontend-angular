import { Component, OnInit } from '@angular/core';
import { EducacionModel } from 'src/app/models/Educacion';
import { ExperienciaLaboralModel } from 'src/app/models/ExperienciaLaboral';
import { HabilidadModel } from 'src/app/models/Habilidad';
import { PersonaModel } from 'src/app/models/Persona';
import { ProyectoModel } from 'src/app/models/Proyecto';
import { AuthService } from 'src/app/services/auth.service';
import { EducacionService } from 'src/app/services/educacion.service';
import { ModalService } from 'src/app/services/modal.service';
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

	persona: PersonaModel = new PersonaModel();
	personaEducacion: EducacionModel[] = [];
	personaExperienciaLaboral: ExperienciaLaboralModel[] = [];
	personaHabilidades: HabilidadModel[] = [];
	personaProyectos: ProyectoModel[] = [];
	userLoggedIn: boolean = false;
	showPersonaModal: boolean = false;
	showBody: boolean = false;
	fotoUrl: string = '';
	action: string = '';

	constructor(
		private _personaService: PersonaService,
		private educacionService: EducacionService,
		private authService: AuthService,
		private modalService: ModalService) { }

	ngOnInit(): void {
		this.getPersonaById(1);
		this.userLoggedIn = this.checkAuthentication();
		//console.log(this.persona.educacion.find(elem => elem.id === 2));
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
			this.fotoUrl = '/assets/img/' + this.persona.url_foto;
		});
	}

	sortArray(a: any, b: any): number {
		if (a.orden > b.orden) {
			return 1;
		}

		if (a.orden < b.orden) {
			return -1;
		}
		return 0;
	}

	checkAuthentication(): boolean {
		if (this.authService.logIn)
			return true;
		else
			return false;
	}

	showModal(modal: string, action: string, obj?: any): void {
		switch (modal) {
			case 'Persona':
				this.modalService.$modalPersona.emit(true);
				break;
			case 'Educacion':
				this.action = action;
				if(action === 'edit')
					this.modalService.$modalEducacionData.emit(obj);
				else {
					const ed: EducacionModel = new EducacionModel();
					this.modalService.$modalEducacionData.emit(ed);
				}
				this.modalService.$modalEducacion.emit(true);
				this.modalService.$modalEducacionAction.emit(action)
				break;
		}
	}

	/*DELETE*/
	deleteItem(id: number, item: string) {
		switch(item) {
			case 'educacion':
				this.educacionService.deleteEducacion(this.persona.id!,id).subscribe({
					next: res => {
						if(res.code == 1) {
							let index = this.persona.educacion.indexOf(this.persona.educacion.find(elem => elem.id === id)!);
							this.persona.educacion.splice(index,1)
							alert(res.msg);
						}
					},
					error: e => {
						console.log(e);
					}
				});
			break;
		}
	}
}