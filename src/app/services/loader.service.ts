import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  $showLoader = new EventEmitter<boolean>();
  $loaderState= new EventEmitter<boolean>();
}
