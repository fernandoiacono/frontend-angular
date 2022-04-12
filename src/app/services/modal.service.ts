import { Injectable, EventEmitter } from '@angular/core';
import { EducacionModel } from '../models/Educacion';
import { ExperienciaLaboralModel } from '../models/ExperienciaLaboral';
import { HabilidadModel } from '../models/Habilidad';
import { ProyectoModel } from '../models/Proyecto';

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

	$modalHabilidad = new EventEmitter<any>();
	$modalHabilidadData = new EventEmitter<HabilidadModel>();
	$modalHabilidadAction = new EventEmitter<string>();

	$modalProyecto = new EventEmitter<any>();
	$modalProyectoData = new EventEmitter<ProyectoModel>();
	$modalProyectoAction = new EventEmitter<string>();
}