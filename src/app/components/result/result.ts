import {
  Component,
  OnInit
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
  selector: 'app-result',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './result.html',

  styleUrl: './result.css'
})
export class Result implements OnInit {

  result: any = null;

  score = 0;

  totalQuestions = 0;

  answered = 0;

  correctAnswers = 0;

  wrongAnswers = 0;

  unanswered = 0;

  loading = true;

  errorMessage = '';

  private apiUrl =
    'http://localhost:5000/api/results';


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  // ==================================================
  // INIT
  // ==================================================

  ngOnInit(): void {

    this.loadResult();

  }


  // ==================================================
  // LOAD RESULT
  // ==================================================

  loadResult(): void {

    const token =
      localStorage.getItem('token');


    if (!token) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    const resultId =
      localStorage.getItem(
        'selectedResultId'
      );


    /*
     * If a specific result is selected from
     * My Interviews, load that result from MongoDB.
     */

    if (resultId) {

      this.loadResultById(
        resultId,
        token
      );

      return;

    }


    /*
     * Otherwise use latest result.
     *
     * This is especially useful after RETAKE.
     */

    const localData =
      localStorage.getItem(
        'interviewResult'
      );


    if (localData) {

      try {

        this.result =
          JSON.parse(localData);

        this.calculateResult();

        this.loading = false;

        return;

      }

      catch (error) {

        console.error(
          'Invalid local result:',
          error
        );

        localStorage.removeItem(
          'interviewResult'
        );

      }

    }


    this.errorMessage =
      'Result not found.';

    this.loading = false;

  }


  // ==================================================
  // LOAD RESULT BY ID
  // ==================================================

  private loadResultById(
    resultId: string,
    token: string
  ): void {

    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    this.http
      .get<any>(
        `${this.apiUrl}/${resultId}`,
        {
          headers
        }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Result fetched from MongoDB:',
            response
          );


          if (
            response?.success &&
            response?.result
          ) {

            this.result =
              response.result;


            localStorage.setItem(
              'interviewResult',
              JSON.stringify(
                this.result
              )
            );


            this.calculateResult();

          }

          else {

            this.errorMessage =
              'Result data not found.';

          }


          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Get result error:',
            error
          );


          this.loading = false;


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
            'Failed to load interview result.';

        }

      });

  }


  // ==================================================
  // CALCULATE RESULT
  // ==================================================

  calculateResult(): void {

    if (!this.result) {

      return;

    }


    // ----------------------------------------------
    // TOTAL QUESTIONS
    // ----------------------------------------------

    this.totalQuestions =
      Number(
        this.result.totalQuestions
      ) ||
      this.result.questions?.length ||
      0;


    // ----------------------------------------------
    // ANSWERED
    // ----------------------------------------------

    this.answered =
      Number(
        this.result.answered
      );


    if (
      isNaN(this.answered) ||
      this.answered === 0
    ) {

      this.answered =
        this.result.questions?.filter(
          (item: any) =>
            item?.userAnswer &&
            item.userAnswer.trim().length > 0
        ).length || 0;

    }


    // ----------------------------------------------
    // CORRECT
    // ----------------------------------------------

    this.correctAnswers =
      Number(
        this.result.correctAnswers
      ) || 0;


    // ----------------------------------------------
    // WRONG
    // ----------------------------------------------

    this.wrongAnswers =
      Number(
        this.result.wrongAnswers
      ) || 0;


    // ----------------------------------------------
    // UNANSWERED
    // ----------------------------------------------

    this.unanswered =
      Math.max(
        0,
        this.totalQuestions -
        this.answered
      );


    // ----------------------------------------------
    // SCORE
    // ----------------------------------------------

    this.score =
      Number(
        this.result.score
      ) || 0;


    console.log(
      'Final Result:',
      {
        total:
          this.totalQuestions,

        answered:
          this.answered,

        correct:
          this.correctAnswers,

        wrong:
          this.wrongAnswers,

        unanswered:
          this.unanswered,

        score:
          this.score
      }
    );

  }


  // ==================================================
  // INTERVIEW TITLE
  // ==================================================

  get interviewTitle(): string {

    return (
      this.result?.interviewId?.title ||
      this.result?.interview?.title ||
      'Interview'
    );

  }


  // ==================================================
  // JOB ROLE
  // ==================================================

  get jobRole(): string {

    return (
      this.result?.interviewId?.jobRole ||
      this.result?.interview?.jobRole ||
      ''
    );

  }


  // ==================================================
  // CHECK QUESTION STATUS
  // ==================================================

  isCorrect(question: any): boolean {

    return question?.isCorrect === true;

  }


  isAnswered(question: any): boolean {

    return !!(
      question?.userAnswer &&
      question.userAnswer.trim().length > 0
    );

  }


  // ==================================================
  // SCORE MESSAGE
  // ==================================================

  get scoreMessage(): string {

    if (this.score >= 80) {

      return 'Excellent Performance!';

    }


    if (this.score >= 50) {

      return 'Good Start — Keep Improving!';

    }


    return 'Keep Practicing!';

  }


  // ==================================================
  // SCORE CLASS
  // ==================================================

  get scoreClass(): string {

    if (this.score >= 80) {

      return 'excellent';

    }


    if (this.score >= 50) {

      return 'average';

    }


    return 'needs-improvement';

  }


  // ==================================================
  // BACK TO EVALUATION
  // ==================================================

  backToEvaluation(): void {

    this.router.navigate([
      '/evaluation'
    ]);

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
  // RETAKE INTERVIEW
  // ==================================================

  retakeInterview(): void {

    /*
     * Get ONLY interview information.
     *
     * We do NOT copy answers.
     */

    const interview =
      this.result?.interviewId ||
      this.result?.interview;


    if (!interview) {

      alert(
        'Interview information not found.'
      );

      return;

    }


    /*
     * Create a clean interview object.
     *
     * This removes old result/answer information.
     */

    const cleanInterview = {

      _id:
        interview?._id ||
        interview?.id,

      id:
        interview?.id ||
        interview?._id,

      title:
        interview?.title ||
        'AI Interview',

      jobRole:
        interview?.jobRole ||
        '',

      numberOfQuestions:
        Number(
          interview?.numberOfQuestions
        ) || 10,

      duration:
        Number(
          interview?.duration
        ) || 30

    };


    /*
     * IMPORTANT:
     *
     * Remove the old selected result.
     *
     * Otherwise Result page may load the old result
     * again instead of the new retake result.
     */

    localStorage.removeItem(
      'selectedResultId'
    );


    /*
     * Remove old temporary result.
     *
     * New result will be stored after submitting
     * the retake.
     */

    localStorage.removeItem(
      'interviewResult'
    );


    /*
     * Remove previous latest-result timestamp.
     */

    localStorage.removeItem(
      'latestInterviewResultTime'
    );


    /*
     * Save ONLY interview details.
     *
     * No old answers are stored here.
     */

    localStorage.setItem(
      'currentInterview',
      JSON.stringify(
        cleanInterview
      )
    );


    console.log(
      'Starting fresh retake:',
      cleanInterview
    );


    /*
     * Go to interview page.
     */

    this.router.navigate([
      '/interview'
    ]);

  }

}