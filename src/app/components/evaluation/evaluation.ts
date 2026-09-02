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
  selector: 'app-evaluation',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './evaluation.html',

  styleUrl: './evaluation.css'
})
export class Evaluation implements OnInit {

  result: any = null;

  score = 0;

  answered = 0;

  totalQuestions = 0;

  correctAnswers = 0;

  wrongAnswers = 0;

  unanswered = 0;

  strengths: string[] = [];

  improvements: string[] = [];

  loading = true;

  errorMessage = '';


  private apiUrl =
    'https://ai-interview-um31.onrender.com/api/results';


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  // ==================================================
  // INIT
  // ==================================================

  ngOnInit(): void {

    this.loadEvaluation();

  }


  // ==================================================
  // LOAD EVALUATION
  // ==================================================

  loadEvaluation(): void {

    const token =
      localStorage.getItem('token');


    if (!token) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // --------------------------------------------------
    // FIRST TRY SELECTED RESULT ID
    // --------------------------------------------------

    const resultId =
      localStorage.getItem(
        'selectedResultId'
      );


    // --------------------------------------------------
    // IF RESULT ID EXISTS → GET FROM MONGODB
    // --------------------------------------------------

    if (resultId) {

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
              'Evaluation result from MongoDB:',
              response
            );


            if (
              response?.success &&
              response?.result
            ) {

              this.result =
                response.result;


              // Save latest result locally

              localStorage.setItem(
                'interviewResult',
                JSON.stringify(
                  this.result
                )
              );


              this.calculateEvaluation();

            }

            else {

              this.loadLocalResult();

            }


            this.loading = false;

          },


          error: (error) => {

            console.error(
              'Evaluation API error:',
              error
            );


            /*
             * If API fails, try local result.
             */

            this.loadLocalResult();

            this.loading = false;

          }

        });

      return;

    }


    // --------------------------------------------------
    // FALLBACK LOCAL RESULT
    // --------------------------------------------------

    this.loadLocalResult();

  }


  // ==================================================
  // LOAD LOCAL RESULT
  // ==================================================

  loadLocalResult(): void {

    const data =
      localStorage.getItem(
        'interviewResult'
      );


    if (!data) {

      this.errorMessage =
        'Interview result not found.';

      this.loading = false;

      return;

    }


    try {

      this.result =
        JSON.parse(data);


      this.calculateEvaluation();

    }

    catch (error) {

      console.error(
        'Invalid interview result:',
        error
      );


      this.errorMessage =
        'Invalid interview result.';

    }


    this.loading = false;

  }


  // ==================================================
  // CALCULATE EVALUATION
  // ==================================================

  calculateEvaluation(): void {

    if (!this.result) {

      return;

    }


    // ==================================================
    // TOTAL
    // ==================================================

    this.totalQuestions =
      Number(
        this.result.totalQuestions
      ) ||
      this.result.questions?.length ||
      0;


    // ==================================================
    // ANSWERED
    // ==================================================

    this.answered =
      Number(
        this.result.answered
      );


    if (
      isNaN(this.answered)
    ) {

      this.answered = 0;

    }


    // Fallback

    if (
      this.answered === 0 &&
      this.result.questions
    ) {

      this.answered =
        this.result.questions.filter(
          (item: any) =>
            item?.userAnswer &&
            item.userAnswer.trim().length > 0
        ).length;

    }


    // ==================================================
    // CORRECT
    // ==================================================

    this.correctAnswers =
      Number(
        this.result.correctAnswers
      ) || 0;


    // ==================================================
    // WRONG
    // ==================================================

    this.wrongAnswers =
      Number(
        this.result.wrongAnswers
      ) || 0;


    // ==================================================
    // UNANSWERED
    // ==================================================

    this.unanswered =
      Math.max(
        0,
        this.totalQuestions -
        this.answered
      );


    // ==================================================
    // SCORE
    // ==================================================

    this.score =
      Number(
        this.result.score
      ) || 0;


    console.log(
      'Evaluation:',
      {
        totalQuestions:
          this.totalQuestions,

        answered:
          this.answered,

        correctAnswers:
          this.correctAnswers,

        wrongAnswers:
          this.wrongAnswers,

        unanswered:
          this.unanswered,

        score:
          this.score
      }
    );


    // ==================================================
    // FEEDBACK
    // ==================================================

    this.generateFeedback();

  }


  // ==================================================
  // FEEDBACK
  // ==================================================

  generateFeedback(): void {

    this.strengths = [];

    this.improvements = [];


    // ==================================================
    // STRENGTHS
    // ==================================================

    if (
      this.correctAnswers > 0
    ) {

      this.strengths.push(

        `You answered ${this.correctAnswers} question${this.correctAnswers > 1 ? 's' : ''} correctly.`

      );

    }


    if (
      this.score >= 80
    ) {

      this.strengths.push(
        'Excellent understanding of the interview concepts.'
      );

      this.strengths.push(
        'Your technical responses show strong preparation.'
      );

    }

    else if (
      this.score >= 50
    ) {

      this.strengths.push(
        'You have a good understanding of several interview concepts.'
      );

      this.strengths.push(
        'Keep practicing to improve your technical confidence.'
      );

    }


    // ==================================================
    // IMPROVEMENTS
    // ==================================================

    if (
      this.wrongAnswers > 0
    ) {

      this.improvements.push(

        `${this.wrongAnswers} answer${this.wrongAnswers > 1 ? 's were' : ' was'} incorrect. Review the related concepts.`

      );

    }


    if (
      this.unanswered > 0
    ) {

      this.improvements.push(

        `You left ${this.unanswered} question${this.unanswered > 1 ? 's' : ''} unanswered.`

      );

    }


    if (
      this.score < 50
    ) {

      this.improvements.push(
        'Practice the fundamental concepts before attempting another interview.'
      );

    }


    if (
      this.improvements.length === 0
    ) {

      this.improvements.push(
        'Continue practicing with more advanced interview questions.'
      );

    }


    if (
      this.strengths.length === 0
    ) {

      this.strengths.push(
        'You completed the interview attempt.'
      );

    }

  }


  // ==================================================
  // SCORE MESSAGE
  // ==================================================

  get scoreMessage(): string {

    if (
      this.score >= 80
    ) {

      return 'Excellent Performance!';

    }


    if (
      this.score >= 50
    ) {

      return 'Good Start — Keep Improving!';

    }


    return 'Keep Practicing!';

  }


  // ==================================================
  // SCORE CLASS
  // ==================================================

  get scoreClass(): string {

    if (
      this.score >= 80
    ) {

      return 'excellent';

    }


    if (
      this.score >= 50
    ) {

      return 'average';

    }


    return 'needs-improvement';

  }


  // ==================================================
  // VIEW DETAILED RESULT
  // ==================================================

  viewResult(): void {

    this.router.navigate([
      '/result'
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
  // RETAKE
  // ==================================================

  retakeInterview(): void {

    const interview =
      this.result?.interviewId ||
      this.result?.interview;


    if (interview) {

      localStorage.setItem(
        'currentInterview',
        JSON.stringify(
          interview
        )
      );

    }


    this.router.navigate([
      '/interview'
    ]);

  }

}