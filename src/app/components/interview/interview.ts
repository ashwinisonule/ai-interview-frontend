import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

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
  HttpClient,
  HttpHeaders
} from '@angular/common/http';


@Component({
  selector: 'app-interview',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './interview.html',
  styleUrl: './interview.css'
})
export class Interview
  implements OnInit, OnDestroy {


  interview: any = null;

  currentQuestion = 0;

  answers: string[] = [];

  questions: string[] = [];

  correctAnswers: string[] = [];

  timeLeft = 1800;

  timer: any;

  submitting = false;


  private resultApi =
    'http://localhost:5000/api/results';


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  // ==================================================
  // INIT
  // ==================================================

  ngOnInit(): void {

    /*
     * IMPORTANT:
     * Always start a fresh answer array.
     *
     * This prevents answers from an old interview/retake
     * from appearing in the new interview.
     */

    this.currentQuestion = 0;

    this.answers = [];

    this.questions = [];

    this.correctAnswers = [];


    const data =
      localStorage.getItem(
        'currentInterview'
      );


    if (!data) {

      this.router.navigate([
        '/create-interview'
      ]);

      return;
    }


    try {

      this.interview =
        JSON.parse(data);

    } catch (error) {

      console.error(
        'Invalid current interview:',
        error
      );

      localStorage.removeItem(
        'currentInterview'
      );

      this.router.navigate([
        '/create-interview'
      ]);

      return;
    }


    /*
     * Generate questions first.
     */

    this.generateQuestions();


    /*
     * VERY IMPORTANT:
     *
     * Create a completely NEW answers array.
     *
     * Every answer is empty when a retake starts.
     */

    this.answers =
      this.questions.map(
        () => ''
      );


    /*
     * Make sure no previous temporary result
     * is accidentally reused.
     */

    localStorage.removeItem(
      'interviewResult'
    );


    this.startTimer();

  }


  // ==================================================
  // QUESTIONS
  // ==================================================

  generateQuestions(): void {

    const role =
      this.interview?.jobRole ||
      'Software Developer';


    if (
      role === 'Angular Developer'
    ) {

      this.questions = [

        'What is Angular and why is it used for building web applications?',

        'What is the difference between components and services in Angular?',

        'Explain data binding in Angular with examples.',

        'What are Angular directives and what are their types?',

        'What is dependency injection in Angular?',

        'What is the purpose of Angular routing?',

        'What is the difference between Observable and Promise?',

        'What are lifecycle hooks in Angular?',

        'How does Angular communicate with a REST API?',

        'What is the difference between reactive forms and template-driven forms?'

      ];


      this.correctAnswers = [

        'Angular is a TypeScript framework used to build web applications and single page applications.',

        'Components control UI while services contain reusable business logic and data logic.',

        'Data binding connects component data with the template using property binding, event binding and two way binding.',

        'Directives change the behavior or structure of elements and include structural and attribute directives.',

        'Dependency injection provides required services or dependencies to a component or class.',

        'Angular routing is used for navigation between different components and URLs in an application.',

        'Observable can provide multiple asynchronous values while a Promise normally resolves one value.',

        'Lifecycle hooks allow developers to run code during different stages of a component lifecycle.',

        'Angular communicates with REST APIs using HttpClient and HTTP requests such as GET and POST.',

        'Reactive forms are defined mainly in TypeScript while template driven forms are defined mainly in the template.'

      ];

    }


    else if (
      role === 'Frontend Developer'
    ) {

      this.questions = [

        'What is the difference between HTML, CSS and JavaScript?',

        'Explain the CSS box model.',

        'What is responsive web design?',

        'What is the difference between let, const and var?',

        'What is DOM manipulation?',

        'Explain event bubbling in JavaScript.',

        'What are JavaScript promises?',

        'What is the difference between Flexbox and CSS Grid?',

        'How do you improve frontend performance?',

        'What is the purpose of browser localStorage?'

      ];


      this.correctAnswers = [

        'HTML provides structure, CSS provides styling and JavaScript provides behavior and interactivity.',

        'The CSS box model consists of content, padding, border and margin.',

        'Responsive web design makes a website adapt to different screen sizes and devices using flexible layouts and media queries.',

        'let and const are block scoped while var is function scoped. const cannot be reassigned.',

        'DOM manipulation means using JavaScript to access and change HTML elements in the document.',

        'Event bubbling means an event moves from the child element upward through its parent elements.',

        'A Promise represents the eventual result of an asynchronous operation and can be resolved or rejected.',

        'Flexbox is mainly for one dimensional layouts while CSS Grid is designed for two dimensional layouts.',

        'Frontend performance can be improved using optimization, lazy loading, caching and optimized images.',

        'localStorage stores key value data in the browser and keeps it after the page is refreshed.'

      ];

    }


    else if (
      role === 'Backend Developer'
    ) {

      this.questions = [

        'What is a REST API?',

        'What is the difference between authentication and authorization?',

        'What is middleware in backend development?',

        'Explain HTTP methods such as GET, POST, PUT and DELETE.',

        'What is database indexing?',

        'What is the difference between SQL and NoSQL databases?',

        'What is JWT authentication?',

        'What is an API endpoint?',

        'How do you handle errors in a backend application?',

        'What is asynchronous programming?'

      ];


      this.correctAnswers = [

        'REST API is an application programming interface that uses HTTP requests to communicate with resources.',

        'Authentication verifies identity while authorization determines permissions.',

        'Middleware is code that runs between a request and response and can process the request or response.',

        'GET retrieves data, POST creates data, PUT updates data and DELETE removes data.',

        'Database indexing improves query performance by creating an index for faster data lookup.',

        'SQL databases are relational while NoSQL databases commonly use document or other non relational structures.',

        'JWT authentication uses a signed token to identify an authenticated user.',

        'An API endpoint is a URL where a client sends a request to access a specific API resource.',

        'Backend errors can be handled using validation, try catch blocks and appropriate HTTP error responses.',

        'Asynchronous programming allows tasks to run without blocking other operations and commonly uses promises async and await.'

      ];

    }


    else {

      this.questions = [

        `What do you understand about ${role}?`,

        'Tell me about your technical skills.',

        'Explain one of your recent projects.',

        'What programming languages are you comfortable with?',

        'How do you debug a programming problem?',

        'What is your approach to learning a new technology?',

        'How do you handle errors in an application?',

        'Explain the difference between frontend and backend development.',

        'How do you work on a team project?',

        'Why should we hire you for this role?'

      ];


      this.correctAnswers = [

        `${role} is a technology role that requires relevant technical knowledge and practical development skills.`,

        'My technical skills include programming web development databases problem solving and software development.',

        'I have developed a project using programming technologies and implemented features to solve a specific problem.',

        'I am comfortable with JavaScript TypeScript Java Python PHP and other programming languages.',

        'I debug problems by reproducing the error checking logs and console messages and testing the code.',

        'I learn new technology by studying documentation practicing examples and building projects.',

        'I handle errors using validation exception handling logging and proper error responses.',

        'Frontend development focuses on client side UI while backend development focuses on server side logic and data.',

        'I work in a team using communication collaboration task sharing and version control.',

        'You should hire me because I have technical skills willingness to learn problem solving ability and teamwork skills.'

      ];

    }


    const total =
      Number(
        this.interview?.numberOfQuestions
      ) || 10;


    this.questions =
      this.questions.slice(
        0,
        total
      );


    this.correctAnswers =
      this.correctAnswers.slice(
        0,
        total
      );


    this.timeLeft =
      (
        Number(
          this.interview?.duration
        ) || 30
      ) * 60;

  }


  // ==================================================
  // TIMER
  // ==================================================

  startTimer(): void {

    clearInterval(
      this.timer
    );


    this.timer =
      setInterval(() => {

        if (
          this.timeLeft > 0
        ) {

          this.timeLeft--;

        } else {

          clearInterval(
            this.timer
          );

          this.submitInterview();

        }

      }, 1000);

  }


  get minutes(): string {

    return Math.floor(
      this.timeLeft / 60
    )
      .toString()
      .padStart(2, '0');

  }


  get seconds(): string {

    return (
      this.timeLeft % 60
    )
      .toString()
      .padStart(2, '0');

  }


  // ==================================================
  // PROGRESS
  // ==================================================

  get progress(): number {

    if (
      !this.questions.length
    ) {

      return 0;

    }


    return (
      (
        (this.currentQuestion + 1) /
        this.questions.length
      ) * 100
    );

  }


  // ==================================================
  // NEXT
  // ==================================================

  nextQuestion(): void {

    if (
      this.currentQuestion <
      this.questions.length - 1
    ) {

      this.currentQuestion++;

    }

  }


  // ==================================================
  // PREVIOUS
  // ==================================================

  previousQuestion(): void {

    if (
      this.currentQuestion > 0
    ) {

      this.currentQuestion--;

    }

  }


  // ==================================================
  // SUBMIT
  // ==================================================

  submitInterview(): void {

    if (
      this.submitting
    ) {

      return;

    }


    this.submitting = true;


    clearInterval(
      this.timer
    );


    const token =
      localStorage.getItem(
        'token'
      );


    if (!token) {

      this.submitting = false;

      alert(
        'Session expired. Please login again.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    /*
     * IMPORTANT:
     *
     * Build payload directly from THIS attempt's
     * current answers array.
     *
     * No old interviewResult is used here.
     */

    const questionsPayload =
      this.questions.map(
        (question, index) => ({

          question:

            question,

          correctAnswer:

            this.correctAnswers[index] || '',

          userAnswer:

            (this.answers[index] || '').trim()

        })
      );


    const interviewId =
      this.interview?._id ||
      this.interview?.id;


    if (!interviewId) {

      this.submitting = false;

      alert(
        'Interview ID is missing. Please create the interview again.'
      );

      return;

    }


    const data = {

      interviewId,

      questions:
        questionsPayload

    };


    console.log(
      'Submitting NEW interview answers:',
      data
    );


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    this.http
      .post<any>(
        this.resultApi,
        data,
        { headers }
      )
      .subscribe({

        next: response => {

          console.log(
            'New result saved:',
            response
          );


          /*
           * IMPORTANT:
           *
           * Store ONLY the latest response.
           *
           * Evaluation and Result pages will read this
           * latest result.
           */

          const latestResult =
            response?.result ||
            response;


          localStorage.setItem(
            'interviewResult',
            JSON.stringify(
              latestResult
            )
          );


          /*
           * Small flag so other Angular pages know that
           * this is the latest retake/result.
           */

          localStorage.setItem(
            'latestInterviewResultTime',
            Date.now().toString()
          );


          this.router.navigate([
            '/evaluation'
          ]);

        },


        error: error => {

          this.submitting = false;

          console.error(
            'Save result error:',
            error
          );


          alert(
            error?.error?.message ||
            'Failed to save interview result.'
          );

        }

      });

  }


  // ==================================================
  // EXIT
  // ==================================================

  exitInterview(): void {

    const confirmExit =
      confirm(
        'Are you sure you want to exit this interview? Your progress will be lost.'
      );


    if (confirmExit) {

      clearInterval(
        this.timer
      );


      localStorage.removeItem(
        'currentInterview'
      );


      /*
       * Do not delete interviewResult here because
       * the previous completed result may still be needed
       * when returning to the result/evaluation pages.
       */


      this.router.navigate([
        '/my-interviews'
      ]);

    }

  }


  // ==================================================
  // DESTROY
  // ==================================================

  ngOnDestroy(): void {

    clearInterval(
      this.timer
    );

  }

}