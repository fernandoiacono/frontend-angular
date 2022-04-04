import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { PersonaModel } from '../models/Persona';

@Injectable({
  providedIn: 'root'
})

export class PersonaService {

  private baseUrl : string = 'http://localhost:8080/api';
  
  constructor(private _httpClient: HttpClient)  { }

  // getPersonaById(id: number) {
    
  //   const token : string | null = localStorage.getItem('ACCESS_TOKEN');
    
  //   let res : any = {
  //       Code: -1,
  //       Msg: 'No auth token'
  //   };
    
  //   if(!token) {
  //       return res;
  //   }
    
  //   const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    
  //   return this._httpClient.get<any>(`${this.baseUrl}/persona/${id}`, { headers: headers }).pipe(map((res: any) => {
  //       return res;
  //   }));
  // }

  getPersonaById(id: number) : Observable<PersonaModel> {
    return this._httpClient.get<PersonaModel>(`${this.baseUrl}/persona/${id}`);
  }
}
