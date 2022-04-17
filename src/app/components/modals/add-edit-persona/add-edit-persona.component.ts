import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PersonaModel } from 'src/app/models/Persona';
import { ModalService } from 'src/app/services/modal.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-add-edit-persona',
    templateUrl: './add-edit-persona.component.html',
    styleUrls: ['./add-edit-persona.component.css']
})
export class AddEditPersonaComponent implements OnInit {

    @Input() userLoggedIn: boolean = false;
    @Input() persona: PersonaModel = new PersonaModel();
    showPersonaModal: boolean = false;
    showBody: boolean = false;
    loadingState: boolean = false;
   
    form: FormGroup;

    constructor(private modalService: ModalService, private personaService: PersonaService, private fb: FormBuilder, private route: ActivatedRoute, private toastr: ToastrService) {
        this.form = this.fb.group({
			nombre: ['', Validators.required],
			apellido: ['', Validators.required],
            descripcion: ['', Validators.required],
            sobre_mi: ['', Validators.required]
		});
     }

    ngOnInit(): void {
        this.modalService.$modalPersona.subscribe(value => {
            if (value == true) {
                this.form.reset();
                
                this.form.patchValue({
                    nombre: this.persona.nombre,
                    apellido: this.persona.apellido,
                    descripcion: this.persona.descripcion,
                    sobre_mi: this.persona.sobre_mi
                });
                
                this.showPersonaModal = value;
                setTimeout(() => {
                    this.showBody = value;
                }, 5);
            } else {
                this.showBody = value;
                setTimeout(() => {
                    this.showPersonaModal = value;
                }, 1400);
            }
        });
    }

    onSubmit() :void {
		this.loadingState = true;
        
        const nombre = this.form.value.nombre;
		const apellido = this.form.value.apellido;
        const descripcion = this.form.value.descripcion;
        const sobreMi = this.form.value.sobre_mi;

        this.persona.nombre = nombre;
        this.persona.apellido = apellido;
        this.persona.descripcion = descripcion;
        this.persona.sobre_mi = sobreMi;

        this.personaService.updatePersona(1, this.persona).subscribe({
            next: data => {
                this.toastr.success('Persona acualizada correctamente');
                this.closeModal();
            },
            error: e => {
                console.log(e);
                this.toastr.error('Ocurrió un error inesperado');
            }
        });
    }

    closeModal(): void {
        this.modalService.$modalPersona.emit(false);
        setTimeout (()=>{
			this.loadingState = false;
		}, 1500);
    }
}