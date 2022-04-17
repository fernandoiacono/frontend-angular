import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { HabilidadModel } from 'src/app/models/Habilidad';
import { PersonaModel } from 'src/app/models/Persona';
import { HabilidadService } from 'src/app/services/habilidad.service';
import { ModalService } from 'src/app/services/modal.service';

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
	
	@ViewChild('countup') numeroPorcentaje: any;
	@ViewChild('circle') barraPorcentaje: any;

	constructor(private modalService: ModalService, private habilidadService: HabilidadService) { }

	ngOnInit(): void {
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

	deleteItem(id: number): void {
		this.habilidadService.deleteHabilidad(this.persona.id!, id).subscribe({
			next: res => {
				if (res.code == 1) {
					let index = this.persona.habilidades.indexOf(this.persona.habilidades.find(elem => elem.id === id)!);
					this.persona.habilidades.splice(index, 1)
					alert(res.msg);
				}
			},
			error: e => {
				console.log(e);
			}
		});
	}
}