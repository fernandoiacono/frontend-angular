import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
/*Models*/
import { EducacionModel } from 'src/app/models/Educacion';
import { ExperienciaLaboralModel } from 'src/app/models/ExperienciaLaboral';
import { HabilidadModel } from 'src/app/models/Habilidad';
import { PersonaModel } from 'src/app/models/Persona';
import { ProyectoModel } from 'src/app/models/Proyecto';
/*TsParticles*/
//import { Main } from 'tsparticles';
import { Container } from 'tsparticles';
/*SweetAlert 2*/
import Swal from 'sweetalert2'
/*Serivces*/
import { AuthService } from 'src/app/services/auth.service';
import { EducacionService } from 'src/app/services/educacion.service';
import { ExperiencialaboralService } from 'src/app/services/experiencialaboral.service';
import { ModalService } from 'src/app/services/modal.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	id = "tsparticles";
	particlesUrl = environment.particlesUrl;
	persona: PersonaModel = new PersonaModel();
	personaEducacion: EducacionModel[] = [];
	personaExperienciaLaboral: ExperienciaLaboralModel[] = [];
	personaHabilidades: HabilidadModel[] = [];
	personaProyectos: ProyectoModel[] = [];
	userLoggedIn: boolean = false;
	showPersonaModal: boolean = false;
	showBody: boolean = false;
	fotoUrl: string = '';
	proyectoBaseUrl: string = '';
	action: string = '';
	loaderState: boolean = true;

	@ViewChild('profilePhoto') profilePhoto : any;

	constructor(
		private personaService: PersonaService,
		private educacionService: EducacionService,
		private expLaboralService: ExperiencialaboralService,
		private proyectoService: ProyectoService,
		private authService: AuthService,
		private modalService: ModalService,
		private loaderService: LoaderService,
		private toastr: ToastrService) { }

	ngOnInit(): void {
		this.getPersonaById(1);
		
		this.userLoggedIn = this.checkAuthentication();
		
		this.modalService.$modalPersonaData.subscribe(value => {
			this.persona = value;
		});

		this.modalService.$modalPersonaProfilePhoto.subscribe(value => {
			if(value !== '' && value !== null && value !== undefined) {
				this.fotoUrl = value;
				this.profilePhoto.nativeElement.src = value;
			} else if (value === '') {
				this.fotoUrl = '';
			}
		});

		this.loaderService.$loaderState.subscribe(value => {
			if(!value) {
				this.loaderState = value;
			}
		});

		// this.authService.$authEmitter.subscribe(value => {
		// 	this.userLoggedIn = value;
		// });
	}

	particlesLoaded(container: Container): void {
		document.querySelector('#tsparticles canvas')?.setAttribute('height', '1080');
	}

	// particlesInit(main: Main): void {
	// 	console.log(main);
	// }

	getPersonaById(id: number) {
		this.personaService.getPersonaById(id).subscribe(data => {
			this.persona = data;
			this.personaEducacion = this.persona.educacion;
			this.personaExperienciaLaboral = this.persona.experiencia_laboral;//.sort(this.sortArray);
			this.personaHabilidades = this.persona.habilidades;//.sort(this.sortArray);
			this.personaProyectos = this.persona.proyectos;//.sort(this.sortArray);
			if(this.persona.extension !== '' && this.persona.extension !== null)
				this.fotoUrl = `${environment.downloadImageBaseUrl}${this.persona.id}/downloadProfileImage/${this.persona.extension}`;
			this.proyectoBaseUrl = environment.downloadImageBaseUrl + this.persona.id! + '/proyecto/';
			this.loaderService.$showLoader.emit(false);
		});
	}

	sortArray(a: any, b: any): number {
		if (a.orden > b.orden)
			return 1;
		if (a.orden < b.orden)
			return -1;
		return 0;
	}

	checkAuthentication(): boolean {
		return this.authService.logIn;
	}

	showModal(modal: string, action: string, obj?: any): void {
		switch (modal) {
			case 'Persona':
				this.modalService.$modalPersonaData.emit(this.persona);
				this.modalService.$modalPersona.emit(true);
				break;
			case 'Educacion':
				this.modalService.$modalPersonaData.emit(this.persona);
				this.action = action;
				this.modalService.$modalEducacionAction.emit(action)
				if (action === 'edit')
					this.modalService.$modalEducacionData.emit(obj);
				else {
					const ed: EducacionModel = new EducacionModel();
					this.modalService.$modalEducacionData.emit(ed);
				}
				this.modalService.$modalEducacion.emit(true);
				break;
			case 'ExpLaboral':
				this.modalService.$modalPersonaData.emit(this.persona);
				this.action = action;
				this.modalService.$modalExpLaboralAction.emit(action);
				if (action === 'edit')
					this.modalService.$modalExpLaboralData.emit(obj);
				else {
					const el: ExperienciaLaboralModel = new ExperienciaLaboralModel();
					this.modalService.$modalExpLaboralData.emit(el);
				}
				this.modalService.$modalExpLaboral.emit(true);
				break;
			case 'Habilidad':
				this.modalService.$modalPersonaData.emit(this.persona);
				this.action = action;
				this.modalService.$modalHabilidadAction.emit(action);
				if (action === 'edit')
					this.modalService.$modalHabilidadData.emit(obj);
				else {
					const ha: HabilidadModel = new HabilidadModel();
					this.modalService.$modalHabilidadData.emit(ha);
				}
				this.modalService.$modalHabilidad.emit(true);
				break;
			case 'Proyecto':
				this.modalService.$modalPersonaData.emit(this.persona);
				this.action = action;
				this.modalService.$modalProyectoAction.emit(action);
				if (action === 'edit')
					this.modalService.$modalProyectoData.emit(obj);
				else {
					const pr: ProyectoModel = new ProyectoModel();
					this.modalService.$modalProyectoData.emit(pr);
				}
				this.modalService.$modalProyecto.emit(true);
				break;
			case 'ProfilePhoto':
				this.modalService.$modalPhoto.emit(true);
				this.modalService.$modalPersonaData.emit(this.persona);
				break;
		}
	}

	/*DELETE*/
	deleteDialog(id: number, item: string): void {
		Swal.fire({
			title: 'Atenci??n!',
			text: '??Esta serguro de eliminar este registro?',
			icon: 'question',
			confirmButtonText: 'S??',
			denyButtonText: 'No',
			showDenyButton: true
		}).then((result) => {
			if (result.isConfirmed) {
				this.deleteItem(id, item);
			} else if (result.isDenied) {
				return;
			}
		})
	}

	deleteItem(id: number, item: string): void {
		switch (item) {
			case 'Educacion':
				this.educacionService.deleteEducacion(this.persona.id!, id).subscribe({
					next: res => {
						if (res.code == 1) {
							let index = this.persona.educacion.indexOf(this.persona.educacion.find(elem => elem.id === id)!);
							this.persona.educacion.splice(index, 1)
							this.toastr.success(res.msg);
						}
					},
					error: e => {
						this.toastr.error('Ocurri?? un error inesperado');
					}
				});
				break;
			case 'ExpLaboral':
				this.expLaboralService.deleteExperienciaLaboral(this.persona.id!, id).subscribe({
					next: res => {
						if (res.code == 1) {
							let index = this.persona.experiencia_laboral.indexOf(this.persona.experiencia_laboral.find(elem => elem.id === id)!);
							this.persona.experiencia_laboral.splice(index, 1)
							this.toastr.success(res.msg);
						}
					},
					error: e => {
						this.toastr.error('Ocurri?? un error inesperado');
					}
				});
				break;
			case 'Proyecto':
				this.proyectoService.deleteProyecto(this.persona.id!, id).subscribe({
					next: res => {
						if (res.code == 1) {
							let index = this.persona.proyectos.indexOf(this.persona.proyectos.find(elem => elem.id === id)!);
							this.persona.proyectos.splice(index, 1)
							this.toastr.success(res.msg);
							// this.modalService.$modalPersonaData.emit(this.persona);
						}
					},
					error: e => {
						this.toastr.error('Ocurri?? un error inesperado');
					}
				});
				break;
		}
	}
}