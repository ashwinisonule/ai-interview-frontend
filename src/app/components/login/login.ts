import { Component } from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';

  password = '';

  loading = false;

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (
      !this.email ||
      !this.password
    ) {

      this.errorMessage =
        'Please enter email and password.';

      return;
    }

    this.loading = true;


    const data = {

      email: this.email,

      password: this.password

    };


    this.authService
      .login(data)
      .subscribe({

        next: (response) => {

          this.loading = false;


          this.authService
            .saveLoginData(response);


          this.router.navigate([
            '/dashboard'
          ]);

        },

        error: (error) => {

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Invalid email or password.';

        }

      });

  }

}