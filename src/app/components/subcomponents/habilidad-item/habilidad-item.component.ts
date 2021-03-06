import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HabilidadModel } from 'src/app/models/Habilidad';
import { PersonaModel } from 'src/app/models/Persona';
import { HabilidadService } from 'src/app/services/habilidad.service';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';
/*SweetAlert 2*/
import Swal from 'sweetalert2'

@Component({
	selector: 'app-habilidad-item',
	templateUrl: './habilidad-item.component.html',
	styleUrls: ['./habilidad-item.component.css']
})
export class HabilidadItemComponent implements OnInit, AfterViewInit {

	@Input() habilidad: HabilidadModel = new HabilidadModel;
	@Input() userLoggedIn: boolean = false;
	@Input() persona: PersonaModel = new PersonaModel();
	action: string = '';
	downloadImageBaseUrl: string = environment.downloadImageBaseUrl;
	
	@ViewChild('countup') numeroPorcentaje: any;
	@ViewChild('circle') barraPorcentaje: any;

	constructor(private modalService: ModalService,
				private habilidadService: HabilidadService,
				private toastr: ToastrService) { }

	ngOnInit(): void {
		this.modalService.$modalPersonaData.subscribe(value => {
			this.persona = value;
		});
	}

	ngAfterViewInit(): void {
		this.animateCountUp(this.numeroPorcentaje.nativeElement);
		this.animateCircle(this.barraPorcentaje.nativeElement, this.habilidad.porcentaje);
	}

	// Contador Numeros
	animationDuration: number = 1200;
	frameDuration: number = 1000 / 60;
	totalFrames: any = Math.round(this.animationDuration / this.frameDuration);

	easeOutQuad(t: number) {
		return t * (2 - t);
	}

	animateCountUp(el: any) {
		let frame = 0;
		const countTo = parseInt(el.innerText, 10);
		const counter = setInterval(() => {
			frame++;
			const progress = this.easeOutQuad(frame / this.totalFrames);
			const currentCount = Math.round(countTo * progress);
			if (parseInt(el.innerText, 10) !== currentCount) {
				el.innerText = currentCount;
			}
			if (frame === this.totalFrames) {
				clearInterval(counter);
			}
		}, this.frameDuration);
	};

	animateCircle(element: any, percent: number) {
		element.style.strokeDasharray = `${percent}, 100`;
	}

	showModal(action: string, obj?: any): void {
		this.modalService.$modalPersonaData.emit(this.persona);
		this.action = action;
		this.modalService.$modalHabilidadAction.emit(action)
		if(action === 'edit')
			this.modalService.$modalHabilidadData.emit(obj);
		else {
			const ha: HabilidadModel = new HabilidadModel();
			this.modalService.$modalHabilidadData.emit(ha);
		}
		this.modalService.$modalHabilidad.emit(true);
	}

	deleteDialog(id: number): void {
		Swal.fire({
			title: 'Atenci??n!',
			text: '??Esta serguro de eliminar este registro?',
			icon: 'question',
			confirmButtonText: 'S??',
			denyButtonText: 'No',
			showDenyButton: true
		}).then((result) => {
			if (result.isConfirmed) {
				this.deleteItem(id);
			} else if (result.isDenied) {
				return;
			}
		})
	}

	deleteItem(id: number): void {
		this.habilidadService.deleteHabilidad(this.persona.id!, id).subscribe({
			next: res => {
				if (res.code == 1) {
					let index = this.persona.habilidades.indexOf(this.persona.habilidades.find(elem => elem.id === id)!);
					this.persona.habilidades.splice(index, 1)
					this.toastr.success(res.msg);
					this.modalService.$modalPersonaData.emit(this.persona);
				}
			},
			error: e => {
				//console.log(e);
				this.toastr.error('Ocurri?? un error inesperado');
			}
		});
	}
}