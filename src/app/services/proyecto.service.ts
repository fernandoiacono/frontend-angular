import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericResponseModel } from '../models/GenericResponse';
import { ProyectoModel } from '../models/Proyecto';

@Injectable({
	providedIn: 'root'
})
export class ProyectoService {
	private baseUrl: string = environment.baseApiUrl; //'http://localhost:8080/api';

	constructor(private _httpClient: HttpClient) { }

	getAllProyectoPersonaById(personaId: number): Observable<ProyectoModel[]> {
		return this._httpClient.get<ProyectoModel[]>(`${this.baseUrl}/persona/${personaId}/proyecto`);
	}

	getProyectoById(personaId: number, id: number): Observable<ProyectoModel> {
		return this._httpClient.get<ProyectoModel>(`${this.baseUrl}/persona/${personaId}/proyecto/${id}`);
	}

	createProyecto(personaId: number, proyecto: ProyectoModel): Observable<ProyectoModel> {
		const token: string | null = localStorage.getItem('token');

		let res: any = {
			Code: -1,
			Msg: 'No auth token'
		};

		if (!token) {
			return res;
		}

		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
		return this._httpClient.post<ProyectoModel>(`${this.baseUrl}/persona/${personaId}/proyecto/`, proyecto, { headers: headers });
	}

	updateProyecto(personaId: number, id: number, proyecto: ProyectoModel): Observable<ProyectoModel> {
		const token: string | null = localStorage.getItem('token');

		let res: any = {
			Code: -1,
			Msg: 'No auth token'
		};

		if (!token) {
			return res;
		}

		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
		return this._httpClient.put<ProyectoModel>(`${this.baseUrl}/persona/${personaId}/proyecto/${id}`, proyecto, { headers: headers });
	}

	deleteProyecto(personaId: number, id: number): Observable<GenericResponseModel> {
		const token: string | null = localStorage.getItem('token');

		let res: any = {
			Code: -1,
			Msg: 'No auth token'
		};

		if (!token) {
			return res;
		}

		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
		return this._httpClient.delete<GenericResponseModel>(`${this.baseUrl}/persona/${personaId}/proyecto/${id}`, { headers: headers });
	}
}