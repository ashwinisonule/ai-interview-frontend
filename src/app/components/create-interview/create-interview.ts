import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Component({
  selector: 'app-create-interview',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './create-interview.html',
  styleUrl: './create-interview.css'
})
export class CreateInterview {

  interviewTitle = '';
  jobRole = '';
  experience = '';
  difficulty = '';
  interviewType = '';

  numberOfQuestions = 10;
  duration = 30;

  loading = false;

  private apiUrl =
    'http://localhost:5000/api/interviews';


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  createInterview(): void {

    if (
      !this.interviewTitle ||
      !this.jobRole ||
      !this.experience ||
      !this.difficulty ||
      !this.interviewType
    ) {

      alert(
        'Please fill all required fields.'
      );

      return;
    }


    const token =
      localStorage.getItem('token');


    if (!token) {

      alert(
        'Please login before creating an interview.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    this.loading = true;


    const data = {

      title:
        this.interviewTitle.trim(),

      jobRole:
        this.jobRole.trim(),

      experience:
        this.experience,

      difficulty:
        this.difficulty,

      interviewType:
        this.interviewType,

      numberOfQuestions:
        Number(this.numberOfQuestions),

      duration:
        Number(this.duration)

    };


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    this.http
      .post<any>(
        this.apiUrl,
        data,
        { headers }
      )
      .subscribe({

        next: response => {

          this.loading = false;


          const interview =
            response?.interview;


          if (!interview) {

            alert(
              'Interview created but data was not received.'
            );

            return;
          }


          localStorage.setItem(
            'currentInterview',
            JSON.stringify(
              interview
            )
          );


          localStorage.removeItem(
            'interviewResult'
          );


          this.router.navigate([
            '/interview'
          ]);

        },


        error: error => {

          this.loading = false;

          console.error(
            'Create interview error:',
            error
          );


          if (
            error.status === 401 ||
            error.status === 403
          ) {

            localStorage.removeItem(
              'token'
            );

            localStorage.removeItem(
              'user'
            );

            alert(
              'Session expired. Please login again.'
            );

            this.router.navigate([
              '/login'
            ]);

            return;
          }


          alert(
            error?.error?.message ||
            'Failed to create interview.'
          );

        }

      });

  }


  cancel(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }

}