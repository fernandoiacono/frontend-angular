import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaModel } from 'src/app/models/Persona';
import { ProyectoModel } from 'src/app/models/Proyecto';
import { ModalService } from 'src/app/services/modal.service';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Component({
	selector: 'app-add-edit-proyecto',
	templateUrl: './add-edit-proyecto.component.html',
	styleUrls: ['./add-edit-proyecto.component.css']
})
export class AddEditProyectoComponent implements OnInit {

	@Input() userLoggedIn: boolean = false;
	@Input() persona: PersonaModel = new PersonaModel();
	proyecto: ProyectoModel = new ProyectoModel();
	action: string = '';
	showProyectoModal: boolean = false;
	showBody: boolean = false;
	loadingState: boolean = false;
	form: FormGroup;

	constructor(
		private modalService: ModalService,
		private proyectoService : ProyectoService,
		private fb: FormBuilder) {
			this.form = this.fb.group({
				nombre: ['', Validators.required],
				descripcion: ['', Validators.required],
				link: ['', Validators.required],
				file: ['', Validators.required],
			});
		}

	ngOnInit(): void {
		this.modalService.$modalProyecto.subscribe(value => {
			if (value == true) {
				this.showProyectoModal = value;
				setTimeout(() => {
					this.showBody = value;
				}, 5);
			} else {
				this.showBody = value;
				setTimeout(() => {
					this.showProyectoModal = value;
				}, 1400);
			}
		});

		this.modalService.$modalProyectoAction.subscribe(value => {
			if(value == 'edit')
				this.action = 'Modificar';
			else
				this.action = 'Agregar';
		});

		this.modalService.$modalProyectoData.subscribe(value => {

			this.proyecto.id = value.id;
			this.proyecto.descripcion = value.descripcion;
			this.proyecto.link = value.link;
			this.proyecto.url_imagen = value.url_imagen;
			this.proyecto.orden = value.orden;
		
			this.form.patchValue({
				nombre: value.nombre,
				descripcion: value.descripcion,
				link: value.link
			});

			// if(this.action === 'Modificar') {
			// 	this.form.patchValue({
			// 		tipo_empleo: value.tipo_empleo.id,
			// 		fecha_inicio: auxDate1,
			// 		fecha_fin: auxDate2,
			// 	})
			// } else {
			// 	this.form.patchValue({
			// 		tipo_empleo: '',
			// 		fecha_inicio: '',
			// 		fecha_fin: '',
			// 	})
			// }
		});
	}

	onSubmit(): void {
		
		this.loadingState = true;
		
		const nombre = this.form.value.nombre;
		const descripcion = this.form.value.descripcion;
		const link = this.form.value.link;
		const file = this.form.value.file;

		console.log(file);

		this.proyecto.nombre = nombre;
		this.proyecto.descripcion = descripcion;
		this.proyecto.link = link;
		

		//console.log(this.proyecto);

		if(this.action == 'Modificar') {
			this.proyectoService.updateProyecto(this.persona.id!, this.proyecto.id!,this.proyecto).subscribe({
				next: (data) => {
					this.closeModal();
					const index : any = this.persona.proyectos.indexOf(this.persona.proyectos.find(elem => elem.id == this.proyecto.id)!);
					this.persona.proyectos[index] = data;
				},
				error: (e) => { 
					console.log(e);
					this.closeModal();
				}
			});
		} else {
			this.proyecto.orden = this.persona.proyectos.length;
			this.proyecto.url_imagen = 'proyecto-placeholder.png';

			this.proyectoService.createProyecto(this.persona.id!, this.proyecto).subscribe({
				next: (data) => {
					this.closeModal();
					this.persona.proyectos.push(data);
				},
				error: (e) => {
					console.log(e)
					this.closeModal();
				}
			});
		}
	}

	closeModal(): void {
		this.modalService.$modalProyecto.emit(false);
		setTimeout(() => {
			this.loadingState = false;
		}, 1500);
	}
}