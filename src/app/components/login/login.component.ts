import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	showPassword: boolean = false;
	form: FormGroup;
	loadingState: boolean = false;
	@ViewChild('passwordInput') passwordInput? : ElementRef;

	constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) {
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

		this.loadingState = true;

		this.authService.doLogin(usernameOrEmailValue, passwordValue).subscribe({
			next: data => {
				this.loadingState = false;
				localStorage.setItem('token', data.token);
				this.router.navigate(['/home']);
				//this.authService.$authEmitter.emit(true);
				this.toastr.success('Bienvenido!');
			},
			error: error => {
				this.loadingState = false;
				if(error.error.message !== null && error.error.message !== undefined)
					this.toastr.error(error.error.message);
				else
					this.toastr.error('Ocurrió un error inesperado');
			}
		});
	}

	toggleEye(type: string) {
		this.showPassword = !this.showPassword;
		this.passwordInput?.nativeElement.setAttribute('type', type);
	}
}