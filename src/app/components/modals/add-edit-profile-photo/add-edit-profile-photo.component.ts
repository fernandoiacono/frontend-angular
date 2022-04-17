import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { PersonaModel } from 'src/app/models/Persona';
import { ModalService } from 'src/app/services/modal.service';
import { PersonaService } from 'src/app/services/persona.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-add-edit-profile-photo',
	templateUrl: './add-edit-profile-photo.component.html',
	styleUrls: ['./add-edit-profile-photo.component.css']
})
export class AddEditProfilePhotoComponent implements OnInit {

	@Input() userLoggedIn: boolean = false;
	@Input() persona: PersonaModel = new PersonaModel();
	showPhotoModal: boolean = false;
	showBody: boolean = false;
	loadingState: boolean = false;
	//form: FormGroup;
	previewImageUrl: string = '';
	fileToUpload: File = new File([], '');
	@ViewChild('labelImagen') labelImagen: any;
	
	constructor(/*private fb: FormBuilder,*/
				private modalService: ModalService,
				private personaService: PersonaService,
				private sanitizer: DomSanitizer,
				private toastr: ToastrService) {
		// this.form = this.fb.group({
		// 	nombre: ['', Validators.required],
		// 	porcentaje: ['', Validators.required],
		// });
	}

	ngOnInit(): void {
		this.fileToUpload = new File([], '');

		this.modalService.$modalPersonaData.subscribe(value => {
			this.persona = value;
			if(this.persona.file_type !== '' && this.persona.file_type !== null) {
				this.previewImageUrl = `${environment.proyImgBaseUrl}${this.persona.id}/downloadProfileImage/${this.persona.file_type}`;
			}
		});

		this.modalService.$modalPhoto.subscribe(value => {
			if (value == true) {
				this.showPhotoModal = value;
                setTimeout(() => {
                    this.showBody = value;
                }, 5);
            } else {
                this.showBody = value;
                setTimeout(() => {
                    this.showPhotoModal = value;
                }, 1400);
            }
        });
	}

	onSubmit(event: any): void {
		
		event.preventDefault();
		
		this.loadingState = true;

		const formData = new FormData();
		formData.append('file', this.fileToUpload);

		this.personaService.updateProfilePhoto(this.persona.id!, formData).subscribe({
			next: res => {
				this.persona = res;
				this.previewImageUrl = `${environment.proyImgBaseUrl}${this.persona.id}/downloadProfileImage/${this.persona.file_type}`;
				this.modalService.$modalPersonaProfilePhoto.emit(this.previewImageUrl);
				this.modalService.$modalPersonaData.emit(this.persona);
				this.toastr.success('Foto de perfil acualizada correctamente');
				this.closeModal();
			},
			error: e => {
				this.toastr.error('Ocurrió un error inesperado');
				this.closeModal();
			}
		});
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

	deleteProfilePhoto(event: any): void {
		event.preventDefault();

		this.loadingState = true;

		this.personaService.deleteProfilePhoto(this.persona.id!).subscribe({
			next: res => {
				if (res.code == 1) {
					this.persona.file_type = '';
					this.previewImageUrl = '';
					this.modalService.$modalPersonaData.emit(this.persona);
					this.modalService.$modalPersonaProfilePhoto.emit('');
					this.closeModal();
					this.toastr.success(res.msg);
				}
			},
			error: e => {
				this.closeModal();
				this.toastr.error('Ocurrió un error inesperado');
			}
		});
	}

	closeModal(): void {
		this.modalService.$modalPhoto.emit(false);
		setTimeout(() => {
			this.loadingState = false;
		}, 1500);
	}
}
