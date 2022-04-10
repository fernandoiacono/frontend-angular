import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaModel } from 'src/app/models/Persona';
import { ModalService } from 'src/app/services/modal.service';
import { PersonaService } from 'src/app/services/persona.service';

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
   
    form: FormGroup;

    constructor(private modalService: ModalService, private personaService: PersonaService, private fb: FormBuilder) {
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
		const nombre = this.form.value.nombre;
		const apellido = this.form.value.apellido;
        const descripcion = this.form.value.descripcion;
        const sobreMi = this.form.value.sobre_mi;

        this.persona.nombre = nombre;
        this.persona.apellido = apellido;
        this.persona.descripcion = descripcion;
        this.persona.sobre_mi = sobreMi;

        this.personaService.updatePersona(1, this.persona).subscribe(data => {
            console.log(data);
            // if(data.token !== null && data.token !== undefined && data.token !== '') {
            //     localStorage.setItem('token', data.token);
            //     this.router.navigate(['/home']);
            // } else {
            //     alert('Ocurrio un error');
            // }
        });
    }

    closeModal(): void {
        this.modalService.$modalPersona.emit(false);
    }
}
