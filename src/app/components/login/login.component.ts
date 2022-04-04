import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  private showPassword: boolean = false;

  ngOnInit(): void {
  }

  toggleEye(elem: string) {

    if(elem.indexOf('Show') != -1) {
      document.getElementById(elem)?.classList.add('eye-hide');
      document.getElementById('eyeContainerHide')?.classList.remove('eye-hide');
    } else {
      document.getElementById(elem)?.classList.add('eye-hide');
      document.getElementById('eyeContainerShow')?.classList.remove('eye-hide');
    }

    if(document.getElementById('loginPassword')?.getAttribute('type') === 'text') {
      document.getElementById('loginPassword')?.setAttribute('type', 'password');
    } else {
      document.getElementById('loginPassword')?.setAttribute('type', 'text')
    }

  }
}
