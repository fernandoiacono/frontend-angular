import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HabilidadModel } from 'src/app/models/Habilidad';
import { PersonaModel } from 'src/app/models/Persona';
import { HabilidadService } from 'src/app/services/habilidad.service';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-add-edit-habilidad',
	templateUrl: './add-edit-habilidad.component.html',
	styleUrls: ['./add-edit-habilidad.component.css']
})
export class AddEditHabilidadComponent implements OnInit {

	@Input() userLoggedIn: boolean = false;
	persona: PersonaModel = new PersonaModel();
	habilidad: HabilidadModel = new HabilidadModel();
	action: string = '';
	showHabilidadModal: boolean = false;
	showBody: boolean = false;
	loadingState: boolean = false;
	form: FormGroup;
	previewImageUrl: string = '';
	fileToUpload: File = new File([], '');

	@ViewChild('labelImagen') labelImagen: any;

	constructor(private modalService: ModalService,
				private habilidadService: HabilidadService,
				private fb: FormBuilder,
				private toastr: ToastrService,
				private sanitizer: DomSanitizer,) {
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

		this.modalService.$modalPersonaData.subscribe(value => {
			this.persona = value;
		});

		this.modalService.$modalHabilidadAction.subscribe(value => {
			if(value == 'edit')
				this.action = 'Modificar';
			else
				this.action = 'Agregar';
		});

		this.modalService.$modalHabilidadData.subscribe(value => {
			this.form.reset();
			this.previewImageUrl = '';
			this.fileToUpload = new File([], '');
			
			this.habilidad.id = value.id;
			this.habilidad.nombre = value.nombre;
			this.habilidad.porcentaje = value.porcentaje;
			this.habilidad.extension = value.extension;
			this.habilidad.orden = value.orden;
		
			this.form.patchValue({
				nombre: value.nombre,
				porcentaje: value.porcentaje,
				url_imagen: value.extension
			});

			if (this.action === 'Modificar' && this.habilidad.extension !== '') {
				this.previewImageUrl = environment.downloadImageBaseUrl + this.persona.id! + '/habilidad/' + this.habilidad.id + '/downloadImage/' + this.habilidad.extension;
			} else {
				this.fileToUpload = new File([], '');
				this.form.patchValue({
					file: this.fileToUpload
				});
			}
		});
	

	}

	onSubmit(): void {
		
		this.loadingState = true;
		
		const nombre = this.form.value.nombre;
		const porcentaje = this.form.value.porcentaje;
		const orden = this.habilidad.orden.toString();

		this.habilidad.nombre = nombre;
		this.habilidad.porcentaje = porcentaje;

		let fileType = '';

		if(this.fileToUpload.name != '') {
			fileType = this.fileToUpload.name.substring(this.fileToUpload.name.lastIndexOf('.') + 1, this.fileToUpload.name.length);
			fileType = fileType.toLowerCase();
		} else {
			fileType = this.habilidad.extension;
		}

		if(this.action == 'Modificar') {
			
			const formData = new FormData();
			formData.append('file', this.fileToUpload);
			formData.append('nombre', nombre);
			formData.append('porcentaje', porcentaje);
			formData.append('extension', fileType);
			formData.append('orden', orden);
			
			this.habilidadService.updateHabilidad(this.persona.id!, this.habilidad.id!, formData).subscribe({
				next: (data) => {
					const index : any = this.persona.habilidades.indexOf(this.persona.habilidades.find(elem => elem.id == this.habilidad.id)!);
					this.persona.habilidades[index] = data;
					this.closeModal();
					this.toastr.success('Habilidad acualizada correctamente');
					this.modalService.$modalPersonaData.emit(this.persona);
				},
				error: (e) => { 
					//console.log(e);
					this.closeModal();
					this.toastr.error('Ocurrió un error inesperado');
				}
			});
		} else {

			let auxOrden : any = [];
			this.persona.habilidades.map(elem => {
				auxOrden.push(elem.orden);
			});

			let max: number = Math.max(...auxOrden);

			const formData = new FormData();
			formData.append('file', this.fileToUpload);
			formData.append('nombre', nombre);
			formData.append('porcentaje', porcentaje);
			formData.append('extension', fileType);
			formData.append('orden', (max + 1).toString());

			this.habilidadService.createHabilidad(this.persona.id!, formData).subscribe({
				next: (data) => {
					this.persona.habilidades.push(data);
					this.closeModal();
					this.toastr.success('Habilidad agregada correctamente');
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
		this.modalService.$modalHabilidad.emit(false);
		setTimeout(() => {
			this.loadingState = false;
		}, 1500);
	}
}