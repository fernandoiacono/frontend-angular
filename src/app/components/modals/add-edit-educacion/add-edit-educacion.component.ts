import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EducacionModel } from 'src/app/models/Educacion';
import { PersonaModel } from 'src/app/models/Persona';
import { EducacionService } from 'src/app/services/educacion.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
	selector: 'app-add-edit-educacion',
	templateUrl: './add-edit-educacion.component.html',
	styleUrls: ['./add-edit-educacion.component.css']
})
export class AddEditEducacionComponent implements OnInit {

    @Input() userLoggedIn: boolean = false;
	@Input() persona: PersonaModel = new PersonaModel();
    educacion: EducacionModel = new EducacionModel();
	action: string = '';
    showEducacionModal: boolean = false;
    showBody: boolean = false;
	loadingState: boolean = false;
   
    form: FormGroup;

	constructor(private modalService: ModalService, private educacionService: EducacionService, private fb: FormBuilder) {
        this.form = this.fb.group({
			nivel: ['', Validators.required],
			establecimiento: ['', Validators.required],
            titulo: ['', Validators.required]
		});
	 }

	ngOnInit(): void {
		this.modalService.$modalEducacion.subscribe(value => {
			if (value == true) {
				this.showEducacionModal = value;
				setTimeout(() => {
					this.showBody = value;
				}, 5);
			} else {
				this.showBody = value;
				setTimeout(() => {
					this.showEducacionModal = value;
				}, 1400);
			}
		});

		this.modalService.$modalEducacionAction.subscribe(value => {
			if(value == 'edit')
				this.action = 'Modificar';
			else
				this.action = 'Agregar';
		});

		this.modalService.$modalEducacionData.subscribe(value => {
			this.educacion.id = value.id;
			this.educacion.nivel = value.nivel;
			this.educacion.establecimiento = value.establecimiento;
			this.educacion.titulo = value.titulo;
			this.educacion.orden = value.orden;
			
			this.form.patchValue({
				nivel: value.nivel,
				establecimiento: value.establecimiento,
				titulo: value.titulo
			});
		});

	}

	onSubmit(): void {
		
		this.loadingState = true;
		
		const nivel = this.form.value.nivel;
		const establecimiento = this.form.value.establecimiento;
		const titulo = this.form.value.titulo;

		this.educacion.nivel = nivel;
		this.educacion.establecimiento = establecimiento;
		this.educacion.titulo = titulo;

		if(this.action == 'Modificar') {
			this.educacionService.updateEducacion(this.persona.id!, this.educacion.id!,this.educacion).subscribe({
				next: (data) => {
					this.closeModal();
					this.persona.educacion[this.educacion.id! - 1] = this.educacion;
				},
				error: (e) => { 
					console.log(e);
					this.closeModal();
				}
			});
		} else {
			this.educacion.orden = this.persona.educacion.length;

			this.educacionService.createEducacion(this.persona.id!, this.educacion).subscribe({
				next: (data) => {
					this.closeModal();
					this.persona.educacion.push(data);
				},
				error: (e) => {
					console.log(e)
					this.closeModal();
				}
			});
		}
	}

	closeModal(): void {
		this.modalService.$modalEducacion.emit(false);
		setTimeout (()=>{
			this.loadingState = false;
		}, 1500);
	}
}