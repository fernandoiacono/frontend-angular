import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { JWTResponse } from '../models/JWTResponse';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private authUrl: string = environment.baseAuthUrl;
	$authEmitter = new EventEmitter<boolean>();

	token: string = '';

	constructor(private _httpClient: HttpClient) { }


	doLogin(usernameOrEmail: string, password: string): Observable<JWTResponse> {
		return this._httpClient.post<JWTResponse>(this.authUrl + '/login', { usernameOrEmail: usernameOrEmail, password: password });
	}

	doLogOut() {
		localStorage.removeItem('token');
	}

	public get logIn(): boolean {
		//this.$authEmitter.emit((localStorage.getItem('token') !== null));
		return (localStorage.getItem('token') !== null);
	}
}