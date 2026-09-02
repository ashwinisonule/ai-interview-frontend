import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';


@Component({
  selector: 'app-my-interviews',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './my-interviews.html',

  styleUrl: './my-interviews.css'
})


export class MyInterviews
  implements OnInit {


  // ==================================================
  // VARIABLES
  // ==================================================

  interviews: any[] = [];

  loading = false;

  errorMessage = '';


  private interviewApiUrl =
    'https://ai-interview-um31.onrender.com/api/interviews';


  private resultApiUrl =
    'https://ai-interview-um31.onrender.com/api/results';


  // ==================================================
  // CONSTRUCTOR
  // ==================================================

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}


  // ==================================================
  // INIT
  // ==================================================

  ngOnInit(): void {

    this.loadInterviews();

  }


  // ==================================================
  // LOAD ALL COMPLETED INTERVIEWS
  // ==================================================

  loadInterviews(): void {

    const token =
      localStorage.getItem('token');


    if (!token) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    this.http
      .get<any>(
        this.interviewApiUrl,
        { headers }
      )
      .subscribe({

        next: (response) => {

          this.loading = false;


          const allInterviews =
            response?.interviews || [];


          // ==========================================
          // ONLY COMPLETED INTERVIEWS
          // ==========================================

          this.interviews =
            allInterviews.filter(
              (interview: any) =>
                interview.status === 'Completed'
            );


          // ==========================================
          // LATEST COMPLETED FIRST
          // ==========================================

          this.interviews.sort(
            (a: any, b: any) => {

              const dateA =
                new Date(
                  a.completedAt ||
                  a.updatedAt ||
                  a.createdAt
                ).getTime();


              const dateB =
                new Date(
                  b.completedAt ||
                  b.updatedAt ||
                  b.createdAt
                ).getTime();


              return dateB - dateA;

            }
          );


          // ==========================================
          // FORCE UI UPDATE
          // ==========================================

          this.cdr.detectChanges();


          console.log(
            'My Interviews:',
            this.interviews
          );

        },


        error: (error) => {

          this.loading = false;


          console.error(
            'Load interviews error:',
            error
          );


          if (
            error?.status === 401 ||
            error?.status === 403
          ) {

            localStorage.removeItem(
              'token'
            );

            localStorage.removeItem(
              'user'
            );

            this.router.navigate([
              '/login'
            ]);

            return;

          }


          this.errorMessage =
            error?.error?.message ||
            'Failed to load interviews.';


          this.cdr.detectChanges();

        }

      });

  }


  // ==================================================
  // VIEW SPECIFIC RESULT
  // ==================================================

  viewResult(
    interview: any
  ): void {

    const token =
      localStorage.getItem('token');


    if (!token) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    const interviewId =
      interview?._id ||
      interview?.id;


    if (!interviewId) {

      alert(
        'Interview ID is missing.'
      );

      return;

    }


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    this.http
      .get<any>(
        this.resultApiUrl,
        { headers }
      )
      .subscribe({

        next: (response) => {

          const results =
            response?.results || [];


          // ==========================================
          // FIND RESULT OF SELECTED INTERVIEW
          // ==========================================

          const selectedResult =
            results.find(
              (item: any) => {

                const resultInterviewId =
                  item?.interviewId?._id ||
                  item?.interviewId;


                return String(
                  resultInterviewId
                ) === String(
                  interviewId
                );

              }
            );


          if (!selectedResult) {

            alert(
              'Result is not available for this interview.'
            );

            return;

          }


          // ==========================================
          // SAVE SELECTED RESULT
          // ==========================================

          localStorage.setItem(
            'interviewResult',
            JSON.stringify(
              selectedResult
            )
          );


          // ==========================================
          // GO TO RESULT
          // ==========================================

          this.router.navigate([
            '/result'
          ]);

        },


        error: (error) => {

          console.error(
            'Load result error:',
            error
          );


          alert(
            error?.error?.message ||
            'Unable to load interview result.'
          );

        }

      });

  }


  // ==================================================
  // DELETE INTERVIEW
  // ==================================================

  deleteInterview(
    interview: any
  ): void {

    const interviewId =
      interview?._id ||
      interview?.id;


    if (!interviewId) {

      alert(
        'Interview ID is missing.'
      );

      return;

    }


    const confirmed =
      confirm(
        `Are you sure you want to delete "${interview.title}"?`
      );


    if (!confirmed) {

      return;

    }


    const token =
      localStorage.getItem('token');


    if (!token) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    // ==========================================
    // DELETE FROM MONGODB
    // ==========================================

    this.http
      .delete<any>(
        `${this.interviewApiUrl}/${interviewId}`,
        { headers }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Interview deleted:',
            response
          );


          // ==========================================
          // UPDATE UI IMMEDIATELY
          // ==========================================

          this.interviews =
            this.interviews.filter(
              (item: any) => {

                const itemId =
                  item?._id ||
                  item?.id;


                return String(itemId) !==
                  String(interviewId);

              }
            );


          // ==========================================
          // FORCE UI UPDATE
          // ==========================================

          this.cdr.detectChanges();


          // ==========================================
          // REMOVE CURRENT RESULT
          // ==========================================

          const currentResult =
            localStorage.getItem(
              'interviewResult'
            );


          if (currentResult) {

            try {

              const parsed =
                JSON.parse(
                  currentResult
                );


              const currentInterviewId =
                parsed?.interviewId?._id ||
                parsed?.interviewId;


              if (
                String(
                  currentInterviewId
                ) ===
                String(
                  interviewId
                )
              ) {

                localStorage.removeItem(
                  'interviewResult'
                );

              }

            }

            catch {

              localStorage.removeItem(
                'interviewResult'
              );

            }

          }


          alert(
            'Interview deleted successfully.'
          );

        },


        error: (error) => {

          console.error(
            'Delete interview error:',
            error
          );


          if (
            error?.status === 401 ||
            error?.status === 403
          ) {

            localStorage.removeItem(
              'token'
            );

            localStorage.removeItem(
              'user'
            );

            this.router.navigate([
              '/login'
            ]);

            return;

          }


          alert(
            error?.error?.message ||
            'Failed to delete interview.'
          );

        }

      });

  }


  // ==================================================
  // DASHBOARD
  // ==================================================

  cancel(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }


  // ==================================================
  // CREATE NEW INTERVIEW
  // ==================================================

  backToDashboard(): void {

    this.router.navigate([
      '/create-interview'
    ]);

  }

}