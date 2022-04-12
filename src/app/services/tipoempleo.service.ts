import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericResponseModel } from '../models/GenericResponse';
import { TipoEmpleoModel } from '../models/TipoEmpleo';

@Injectable({
	providedIn: 'root'
})
export class TipoempleoService {

	private baseUrl: string = environment.baseApiUrl; //'http://localhost:8080/api';

	constructor(private _httpClient: HttpClient) { }

	getAllTipoEmpleo(): Observable<TipoEmpleoModel[]> {
		return this._httpClient.get<TipoEmpleoModel[]>(`${this.baseUrl}/tipoempleo`);
	}

	getProyectoById(personaId: number, id: number): Observable<TipoEmpleoModel> {
		return this._httpClient.get<TipoEmpleoModel>(`${this.baseUrl}/persona/${personaId}/tipoempleo/${id}`);
	}

	createProyecto(personaId: number, tipoEmpleo: TipoEmpleoModel): Observable<TipoEmpleoModel> {
		const token: string | null = localStorage.getItem('token');

		let res: any = {
			Code: -1,
			Msg: 'No auth token'
		};

		if (!token) {
			return res;
		}

		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
		return this._httpClient.post<TipoEmpleoModel>(`${this.baseUrl}/persona/${personaId}/tipoempleo/`, tipoEmpleo, { headers: headers });
	}

	updateProyecto(personaId: number, id: number, tipoEmpleo: TipoEmpleoModel): Observable<TipoEmpleoModel> {
		const token: string | null = localStorage.getItem('token');

		let res: any = {
			Code: -1,
			Msg: 'No auth token'
		};

		if (!token) {
			return res;
		}

		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
		return this._httpClient.put<TipoEmpleoModel>(`${this.baseUrl}/persona/${personaId}/tipoempleo/${id}`, tipoEmpleo, { headers: headers });
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
		return this._httpClient.delete<GenericResponseModel>(`${this.baseUrl}/persona/${personaId}/tipoempleo/${id}`, { headers: headers });
	}
}