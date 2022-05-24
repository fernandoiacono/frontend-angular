import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { max } from 'rxjs';
import { ExperienciaLaboralModel } from 'src/app/models/ExperienciaLaboral';
import { PersonaModel } from 'src/app/models/Persona';
import { TipoEmpleoModel } from 'src/app/models/TipoEmpleo';
import { ExperiencialaboralService } from 'src/app/services/experiencialaboral.service';
import { ModalService } from 'src/app/services/modal.service';
import { TipoempleoService } from 'src/app/services/tipoempleo.service';
import { __values } from 'tslib';

@Component({
	selector: 'app-add-edit-explaboral',
	templateUrl: './add-edit-explaboral.component.html',
	styleUrls: ['./add-edit-explaboral.component.css']
})
export class AddEditExplaboralComponent implements OnInit {

	@Input() userLoggedIn: boolean = false;
	persona: PersonaModel = new PersonaModel();
	explaboral: ExperienciaLaboralModel = new ExperienciaLaboralModel();
	action: string = '';
	showExpLaboralModal: boolean = false;
	showBody: boolean = false;
	loadingState: boolean = false;
	form: FormGroup;
	tipoEmpleoArr: TipoEmpleoModel[] = [];

	constructor(private modalService: ModalService,
				private experienciaLaboralService : ExperiencialaboralService,
				private tipoEmpleoService: TipoempleoService,
				private fb: FormBuilder,
				private toastr: ToastrService) {
		this.form = this.fb.group({
			nombre_empresa: ['', Validators.required],
			descripcion: ['', Validators.required],
            es_trabajo_actual: ['', Validators.required],
			fecha_inicio: ['', Validators.required],
			fecha_fin: ['', Validators.required],
			tipo_empleo : ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.modalService.$modalExpLaboral.subscribe(value => {
			if (value == true) {
				this.showExpLaboralModal = value;
				setTimeout(() => {
					this.showBody = value;
				}, 5);
			} else {
				this.showBody = value;
				setTimeout(() => {
					this.showExpLaboralModal = value;
				}, 1400);
			}
		});

		this.modalService.$modalExpLaboralAction.subscribe(value => {
			if(value == 'edit')
				this.action = 'Modificar';
			else
				this.action = 'Agregar';
		});

		this.modalService.$modalExpLaboralData.subscribe(value => {
			this.form.reset();

			let auxDate1 : string = this.formatDate(new Date(value.fecha_inicio));
			let auxDate2 : string = this.formatDate(new Date(value.fecha_fin));
			
			this.explaboral.id = value.id;
			this.explaboral.nombre_empresa = value.nombre_empresa;
			this.explaboral.descripcion = value.descripcion;
			this.explaboral.es_trabajo_actual = value.es_trabajo_actual;
			this.explaboral.fecha_inicio = value.fecha_inicio;
			this.explaboral.fecha_fin = value.fecha_fin;
			this.explaboral.tipo_empleo = value.tipo_empleo;
			this.explaboral.orden = value.orden;
		
			this.form.patchValue({
				nombre_empresa: value.nombre_empresa,
				descripcion: value.descripcion,
				es_trabajo_actual: value.es_trabajo_actual,
			});

			if(this.action === 'Modificar') {
				this.form.patchValue({
					tipo_empleo: value.tipo_empleo.id,
					fecha_inicio: auxDate1,
					fecha_fin: auxDate2,
				})
			} else {
				this.form.patchValue({
					tipo_empleo: '',
					fecha_inicio: '',
					fecha_fin: '',
				})
			}
		});

		this.tipoEmpleoService.getAllTipoEmpleo().subscribe({
			next: data => {
				this.tipoEmpleoArr = data;
			},
			error: err => {
				console.log(err);
			}
		});

		this.modalService.$modalPersonaData.subscribe(value => {
			this.persona = value;
		});
	}

	onSubmit(): void {
		
		this.loadingState = true;
		
		const nombre_empresa = this.form.value.nombre_empresa;
		const descripcion = this.form.value.descripcion;
		const es_trabajo_actual = this.form.value.es_trabajo_actual;
		const fecha_inicio = this.form.value.fecha_inicio;
		const fecha_fin = this.form.value.fecha_fin;
		const tipo_empleo_id = this.form.value.tipo_empleo;

		let auxTipoEmpleo: TipoEmpleoModel = new TipoEmpleoModel();
		auxTipoEmpleo.id = tipo_empleo_id;
		auxTipoEmpleo.nombre_tipo = this.tipoEmpleoArr.find(elem => elem.id == tipo_empleo_id)?.nombre_tipo!;

		this.explaboral.nombre_empresa = nombre_empresa;
		this.explaboral.descripcion = descripcion;
		this.explaboral.es_trabajo_actual = es_trabajo_actual;
		this.explaboral.fecha_inicio = new Date(fecha_inicio).toISOString();//.replace('Z', '00:00');
		this.explaboral.tipo_empleo = auxTipoEmpleo;

		if(this.action == 'Modificar') {
			this.explaboral.fecha_fin = new Date(fecha_fin).toISOString();//.replace('Z', '+00:00');
			
			this.experienciaLaboralService.updateExperienciaLaboral(this.persona.id!, this.explaboral.id!,this.explaboral).subscribe({
				next: (data) => {
					const index : any = this.persona.experiencia_laboral.indexOf(this.persona.experiencia_laboral.find(elem => elem.id == this.explaboral.id)!);
					this.persona.experiencia_laboral[index] = data;
					this.closeModal();
					this.toastr.success('Experiencia laboral acualizada correctamente');
					this.modalService.$modalPersonaData.emit(this.persona);
				},
				error: (e) => { 
					this.closeModal();
					this.toastr.error('Ocurrió un error inesperado');
				}
			});
		} else {
			
			let auxOrden : any = [];
			this.persona.experiencia_laboral.map(elem => {
				auxOrden.push(elem.orden);
			});

			let max: number = Math.max(...auxOrden);

			this.explaboral.orden = max + 1;
			
			this.explaboral.fecha_fin = new Date(Date.now()).toISOString();//.replace('Z', '+00:00');

			this.experienciaLaboralService.createExperienciaLaboral(this.persona.id!, this.explaboral).subscribe({
				next: (data) => {
					this.persona.experiencia_laboral.push(data);
					this.closeModal();
					this.toastr.success('Experiencia laboral agregada correctamente');
					this.modalService.$modalPersonaData.emit(this.persona);
				},
				error: (e) => {
					//console.log(e)
					this.closeModal();
					this.toastr.error('Ocurrió un error inesperado');
				}
			});
		}
	}

	closeModal(): void {
		this.modalService.$modalExpLaboral.emit(false);
		setTimeout(() => {
			this.loadingState = false;
		}, 1500);
	}

	private formatDate(date: Date): string {
		return  `${date.getFullYear().toString()}-${date.getMonth() + 1 >= 10 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString()}-${date.getDate() >= 10 ? date.getDate().toString() : '0' + date.getDate().toString()}`;
	}
}
