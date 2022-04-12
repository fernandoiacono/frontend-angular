import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericResponseModel } from '../models/GenericResponse';
import { HabilidadModel } from '../models/Habilidad';

@Injectable({
  providedIn: 'root'
})
export class HabilidadService {

  private baseUrl: string = environment.baseApiUrl; //'http://localhost:8080/api';

	constructor(private _httpClient: HttpClient) { }

	getAllHabilidadPersonaById(personaId: number): Observable<HabilidadModel[]> {
		return this._httpClient.get<HabilidadModel[]>(`${this.baseUrl}/persona/${personaId}/habilidad`);
	}

	getHabilidadById(personaId: number, id: number): Observable<HabilidadModel> {
		return this._httpClient.get<HabilidadModel>(`${this.baseUrl}/persona/${personaId}/habilidad/${id}`);
	}

	createHabilidad(personaId: number, habilidad: HabilidadModel): Observable<HabilidadModel> {
		const token: string | null = localStorage.getItem('token');

		let res: any = {
			Code: -1,
			Msg: 'No auth token'
		};

		if (!token) {
			return res;
		}

		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
		return this._httpClient.post<HabilidadModel>(`${this.baseUrl}/persona/${personaId}/habilidad/`, habilidad, { headers: headers });
	}

	updateHabilidad(personaId: number, id: number, habilidad: HabilidadModel): Observable<HabilidadModel> {
		const token: string | null = localStorage.getItem('token');

		let res: any = {
			Code: -1,
			Msg: 'No auth token'
		};

		if (!token) {
			return res;
		}

		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
		return this._httpClient.put<HabilidadModel>(`${this.baseUrl}/persona/${personaId}/habilidad/${id}`, habilidad, { headers: headers });
	}

	deleteHabilidad(personaId: number, id: number): Observable<GenericResponseModel> {
		const token: string | null = localStorage.getItem('token');

		let res: any = {
			Code: -1,
			Msg: 'No auth token'
		};

		if (!token) {
			return res;
		}

		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
		return this._httpClient.delete<GenericResponseModel>(`${this.baseUrl}/persona/${personaId}/habilidad/${id}`, { headers: headers });
	}
}
