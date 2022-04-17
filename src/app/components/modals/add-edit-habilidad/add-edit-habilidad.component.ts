import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HabilidadModel } from 'src/app/models/Habilidad';
import { PersonaModel } from 'src/app/models/Persona';
import { HabilidadService } from 'src/app/services/habilidad.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
	selector: 'app-add-edit-habilidad',
	templateUrl: './add-edit-habilidad.component.html',
	styleUrls: ['./add-edit-habilidad.component.css']
})
export class AddEditHabilidadComponent implements OnInit {

	@Input() userLoggedIn: boolean = false;
	@Input() persona: PersonaModel = new PersonaModel();
	habilidad: HabilidadModel = new HabilidadModel();
	action: string = '';
	showHabilidadModal: boolean = false;
	showBody: boolean = false;
	loadingState: boolean = false;
	form: FormGroup;

	constructor(private modalService: ModalService, private habilidadService: HabilidadService, private fb: FormBuilder) {
		this.form = this.fb.group({
			nombre: ['', Validators.required],
			porcentaje: ['', Validators.required],
		});
	}

	ngOnInit(): void {
		this.modalService.$modalHabilidad.subscribe(value => {
			if (value == true) {
				this.showHabilidadModal = value;
				setTimeout(() => {
					this.showBody = value;
				}, 5);
			} else {
				this.showBody = value;
				setTimeout(() => {
					this.showHabilidadModal = value;
				}, 1400);
			}
		});

		this.modalService.$modalHabilidadAction.subscribe(value => {
			if(value == 'edit')
				this.action = 'Modificar';
			else
				this.action = 'Agregar';
		});

		this.modalService.$modalHabilidadData.subscribe(value => {
			this.form.reset();
			
			this.habilidad.id = value.id;
			this.habilidad.nombre = value.nombre;
			this.habilidad.porcentaje = value.porcentaje;
			this.habilidad.url_imagen = value.url_imagen;
			this.habilidad.orden = value.orden;
			
			this.form.patchValue({
				nombre: value.nombre,
				porcentaje: value.porcentaje,
				url_imagen: value.url_imagen
			});
		});
	
	}

	onSubmit(): void {
		
		this.loadingState = true;
		
		const nombre = this.form.value.nombre;
		const porcentaje = this.form.value.porcentaje;

		this.habilidad.nombre = nombre;
		this.habilidad.porcentaje = porcentaje;

		if(this.action == 'Modificar') {
			this.habilidadService.updateHabilidad(this.persona.id!, this.habilidad.id!,this.habilidad).subscribe({
				next: (data) => {
					this.closeModal();
					const index : any = this.persona.habilidades.indexOf(this.persona.habilidades.find(elem => elem.id == this.habilidad.id)!);
					this.persona.habilidades[index] = data;
				},
				error: (e) => { 
					console.log(e);
					this.closeModal();
				}
			});
		} else {
			this.habilidad.orden = this.persona.habilidades.length;

			this.habilidadService.createHabilidad(this.persona.id!, this.habilidad).subscribe({
				next: (data) => {
					this.closeModal();
					this.persona.habilidades.push(data);
				},
				error: (e) => {
					console.log(e)
					this.closeModal();
				}
			});
		}
	}

	closeModal(): void {
		this.modalService.$modalHabilidad.emit(false);
		setTimeout(() => {
			this.loadingState = false;
		}, 1500);
	}
}