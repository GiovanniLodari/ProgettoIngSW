import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string = '';
  hasError: boolean = false;
  check: boolean = false;

  constructor(
    private router: Router,
    @Inject(LoginService) private loginService: LoginService
  ) {}

  login(event: Event) {
    event.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    this.loginService.login(email, password).subscribe(
      response => {
        console.log('Accesso effettuato');
        this.check = true;
        const queryParams = { check: this.check };
        this.router.navigate(['/home'], { queryParams });
      },
      error => {
        if (error.status === 401) {
          this.hasError = true;
          this.errorMessage = 'Email o password non valide';
        }
        console.log('Errore durante l\'accesso', error);
      }
    );
  }
}
