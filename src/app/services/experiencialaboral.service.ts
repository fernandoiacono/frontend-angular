import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExperienciaLaboralModel } from '../models/ExperienciaLaboral';
import { GenericResponseModel } from '../models/GenericResponse';

@Injectable({
	providedIn: 'root'
})
export class ExperiencialaboralService {

	private baseUrl: string = environment.baseApiUrl; //'http://localhost:8080/api';

	constructor(private _httpClient: HttpClient) { }

	getAllExpericiaLaboralByPersonaId(personaId: number): Observable<ExperienciaLaboralModel[]> {
		return this._httpClient.get<ExperienciaLaboralModel[]>(`${this.baseUrl}/persona/${personaId}/experiencialaboral`);
	}

	getExpericiaLaboralById(personaId: number, id: number): Observable<ExperienciaLaboralModel> {
		return this._httpClient.get<ExperienciaLaboralModel>(`${this.baseUrl}/persona/${personaId}/experiencialaboral/${id}`);
	}

	createExperienciaLaboral(personaId: number, experienciaLaboral: ExperienciaLaboralModel) : Observable<ExperienciaLaboralModel> {
		const token : string | null = localStorage.getItem('token');

        let res : any = {
            Code: -1,
            Msg: 'No auth token'
        };

        if(!token) {
            return res;
        }

        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
        return this._httpClient.post<ExperienciaLaboralModel>(`${this.baseUrl}/persona/${personaId}/experiencialaboral/`, experienciaLaboral, {headers : headers});
	}

	updateExperienciaLaboral(personaId: number, id: number, experienciaLaboral: ExperienciaLaboralModel) : Observable<ExperienciaLaboralModel> {
		const token : string | null = localStorage.getItem('token');

        let res : any = {
            Code: -1,
            Msg: 'No auth token'
        };

        if(!token) {
            return res;
        }

        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
        return this._httpClient.put<ExperienciaLaboralModel>(`${this.baseUrl}/persona/${personaId}/experiencialaboral/${id}`, experienciaLaboral, {headers : headers});
	}

	deleteExperienciaLaboral(personaId: number, id: number): Observable<GenericResponseModel> {
        const token : string | null = localStorage.getItem('token');

        let res : any = {
            Code: -1,
            Msg: 'No auth token'
        };

        if(!token) {
            return res;
        }

        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
        return this._httpClient.delete<GenericResponseModel>(`${this.baseUrl}/persona/${personaId}/experiencialaboral/${id}`, {headers : headers});
    }
}
