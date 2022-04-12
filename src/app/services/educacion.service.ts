import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EducacionModel } from '../models/Educacion';
import { GenericResponseModel } from '../models/GenericResponse';

@Injectable({
	providedIn: 'root'
})
export class EducacionService {

	private baseUrl: string = environment.baseApiUrl; //'http://localhost:8080/api';

	constructor(private _httpClient: HttpClient) { }

	getAllEducacionPersonaById(personaId: number) : Observable<EducacionModel[]>{
		return this._httpClient.get<EducacionModel[]>(`${this.baseUrl}/persona/${personaId}/educacion`);
	}

	getEducacionById(personaId: number, id: number) : Observable<EducacionModel> {
		return this._httpClient.get<EducacionModel>(`${this.baseUrl}/persona/${personaId}/educacion/${id}`);
	}

    createEducacion(personaId: number, educacion: EducacionModel) : Observable<EducacionModel> {
        const token : string | null = localStorage.getItem('token');

        let res : any = {
            Code: -1,
            Msg: 'No auth token'
        };

        if(!token) {
            return res;
        }

        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
        return this._httpClient.post<EducacionModel>(`${this.baseUrl}/persona/${personaId}/educacion/`, educacion, {headers : headers});
    }

	updateEducacion(personaId: number,id: number, educacion: EducacionModel) : Observable<EducacionModel> {
        const token : string | null = localStorage.getItem('token');

        let res : any = {
            Code: -1,
            Msg: 'No auth token'
        };

        if(!token) {
            return res;
        }

        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
        return this._httpClient.put<EducacionModel>(`${this.baseUrl}/persona/${personaId}/educacion/${id}`, educacion, {headers : headers});
    }

    deleteEducacion(personaId: number, id: number): Observable<GenericResponseModel> {
        const token : string | null = localStorage.getItem('token');

        let res : any = {
            Code: -1,
            Msg: 'No auth token'
        };

        if(!token) {
            return res;
        }

        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`).set('Content-Type', 'application/json');
        return this._httpClient.delete<GenericResponseModel>(`${this.baseUrl}/persona/${personaId}/educacion/${id}`, {headers : headers});
    }
}
