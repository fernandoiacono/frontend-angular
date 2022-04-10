import { Injectable, EventEmitter } from '@angular/core';
import { EducacionModel } from '../models/Educacion';
import { ExperienciaLaboralModel } from '../models/ExperienciaLaboral';

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	constructor() { }
	$modalPersona = new EventEmitter<any>();
	
	$modalEducacion = new EventEmitter<any>();
	$modalEducacionData = new EventEmitter<EducacionModel>();
	$modalEducacionAction = new EventEmitter<string>();

	$modalExpLaboral = new EventEmitter<any>();
	$modalExpLaboralData = new EventEmitter<ExperienciaLaboralModel>();
	$modalExpLaboralAction = new EventEmitter<string>();
}