import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { PersonaModel } from 'src/app/models/Persona';
import { ProyectoModel } from 'src/app/models/Proyecto';
import { ModalService } from 'src/app/services/modal.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-add-edit-proyecto',
	templateUrl: './add-edit-proyecto.component.html',
	styleUrls: ['./add-edit-proyecto.component.css']
})

export class AddEditProyectoComponent implements OnInit {

	@Input() userLoggedIn: boolean = false;
	persona: PersonaModel = new PersonaModel();
	proyecto: ProyectoModel = new ProyectoModel();
	action: string = '';
	showProyectoModal: boolean = false;
	showBody: boolean = false;
	loadingState: boolean = false;
	form: FormGroup;
	previewImageUrl: string = '';
	fileToUpload: File = new File([], '');

	@ViewChild('labelImagen') labelImagen: any;

	constructor(
		private modalService: ModalService,
		private proyectoService: ProyectoService,
		private fb: FormBuilder,
		private sanitizer: DomSanitizer,
		private toastr: ToastrService) {
		this.form = this.fb.group({
			nombre: ['', Validators.required],
			descripcion: ['', Validators.required],
			link: ['', Validators.required],
			// file: ['', ''],
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
			if (value == 'edit')
				this.action = 'Modificar';
			else
				this.action = 'Agregar';
		});

		this.modalService.$modalProyectoData.subscribe(value => {
			this.form.reset();
			this.previewImageUrl = '';
			this.fileToUpload = new File([], '');

			this.proyecto.id = value.id;
			this.proyecto.nombre = value.nombre;
			this.proyecto.descripcion = value.descripcion;
			this.proyecto.link = value.link;
			this.proyecto.extension = value.extension;
			this.proyecto.orden = value.orden;

			this.form.patchValue({
				nombre: value.nombre,
				descripcion: value.descripcion,
				link: value.link
			});

			if (this.action === 'Modificar' && this.proyecto.extension !== '') {
				this.previewImageUrl = environment.downloadImageBaseUrl + this.persona.id! + '/proyecto/' + this.proyecto.id + '/downloadImage/' + this.proyecto.id + '.' + this.proyecto.extension;
			} else {
				this.fileToUpload = new File([], '');
				this.form.patchValue({
					file: this.fileToUpload
				});
			}
		});

		this.modalService.$modalPersonaData.subscribe(value => {
			this.persona = value;
		});
	}

	onSubmit(): void {

		this.loadingState = true;

		const nombre = this.form.value.nombre;
		const descripcion = this.form.value.descripcion;
		const link = this.form.value.link;
		const orden = this.proyecto.orden.toString();

		this.proyecto.nombre = nombre;
		this.proyecto.descripcion = descripcion;
		this.proyecto.link = link;
		
		let fileType = '';

		if(this.fileToUpload.name != '') {
			fileType = this.fileToUpload.name.substring(this.fileToUpload.name.lastIndexOf('.') + 1, this.fileToUpload.name.length);
			fileType = fileType.toLowerCase();
		} else {
			fileType = this.proyecto.extension;
		}

		if (this.action == 'Modificar') {
			const formData = new FormData();
			formData.append('file', this.fileToUpload);
			formData.append('nombre', nombre);
			formData.append('descripcion', descripcion);
			formData.append('extension', fileType);
			formData.append('orden', orden);
			formData.append('link', link);

			this.proyectoService.updateProyecto(this.persona.id!, this.proyecto.id!, formData).subscribe({
				next: (data) => {
					const index: any = this.persona.proyectos.indexOf(this.persona.proyectos.find(elem => elem.id == this.proyecto.id)!);
					this.persona.proyectos[index] = data;
					this.closeModal();
					this.toastr.success('Proyecto acualizado correctamente');
					this.modalService.$modalPersonaData.emit(this.persona);
				},
				error: (e) => {
					this.closeModal();
					this.toastr.error('Ocurrió un error inesperado');
				}
			});
		} else {

			let auxOrden : any = [];
			this.persona.proyectos.map(elem => {
				auxOrden.push(elem.orden);
			});

			let max: number = Math.max(...auxOrden);

			const formData = new FormData();
			formData.append('file', this.fileToUpload);
			formData.append('nombre', nombre);
			formData.append('descripcion', descripcion);
			formData.append('extension', fileType);
			formData.append('orden', (max + 1).toString());
			formData.append('link', link);

			this.proyectoService.createProyecto(this.persona.id!, formData).subscribe({
				next: (data) => {
					this.persona.proyectos.push(data);
					this.closeModal();
					this.toastr.success('Proyecto agregado correctamente');
					this.modalService.$modalPersonaData.emit(this.persona);
				},
				error: (e) => {
					this.closeModal();
					this.toastr.error('Ocurrió un error inesperado');
				}
			});
		}
	}

	onFileSelect(event: any): any {
		if (event.target.files.length > 0) {
			this.fileToUpload = event.target.files[0];
			this.extraerBase64(this.fileToUpload).then((imagen: any) => {
				this.previewImageUrl = imagen.base;
			});
			this.labelImagen.nativeElement.innerText = event.target.files[0].name;
		}
	}

	extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
		try {
			const unsafeImg = window.URL.createObjectURL($event);
			const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
			const reader = new FileReader();
			reader.readAsDataURL($event);
			reader.onload = () => {
				resolve({
					base: reader.result
				});
			};
			reader.onerror = error => {
				resolve({
					base: null
				});
			};
		} catch (e) {
			reject({
				base: null
			});
			//return null
		}
	});

	closeModal(): void {
		this.modalService.$modalProyecto.emit(false);
		setTimeout(() => {
			this.loadingState = false;
		}, 1500);
	}
}