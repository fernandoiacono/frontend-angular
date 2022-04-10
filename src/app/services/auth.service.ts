import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { JWTResponse } from '../models/JWTResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl : string = environment.baseAuthUrl;
  
  token: string = '';
  
  constructor(private _httpClient : HttpClient) { }


  doLogin(usernameOrEmail: string, password: string) : Observable<JWTResponse> {
    return this._httpClient.post<JWTResponse>(this.authUrl + '/login', {usernameOrEmail: usernameOrEmail, password: password});
  }

  doLogOut() {
    localStorage.removeItem('token');
  }

  public get logIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }
}