import { Component } from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../services/auth';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  password = '';

  loading = false;

  errorMessage = '';

  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.name ||
      !this.email ||
      !this.password
    ) {

      this.errorMessage =
        'Please fill all fields.';

      return;
    }

    this.loading = true;

    const data = {

      name: this.name,

      email: this.email,

      password: this.password

    };

    this.authService
      .register(data)
      .subscribe({

        next: (response) => {

          this.loading = false;

          this.successMessage =
            'Registration successful!';

          setTimeout(() => {

            this.router.navigate([
              '/login'
            ]);

          }, 1000);

        },

        error: (error) => {

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Registration failed.';

        }

      });

  }

}