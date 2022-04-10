import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private showPassword: boolean = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService : AuthService, private router : Router) { 
    this.form = this.fb.group({
			usernameOrEmail: ['', Validators.required],
			password: ['', Validators.required]
		});
  }

  ngOnInit(): void {
  }

	doLogin(): void {
		const usernameOrEmailValue = this.form.value.usernameOrEmail;
		const passwordValue = this.form.value.password;

    this.authService.doLogin(usernameOrEmailValue, passwordValue).subscribe(data => {
      console.log(data);
      if(data.token !== null && data.token !== undefined && data.token !== '') {
        localStorage.setItem('token', data.token);
        this.router.navigate(['/home']);
      } else {
        alert('Ocurrio un error');
      }
    });
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
