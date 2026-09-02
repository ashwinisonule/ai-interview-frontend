import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../services/auth';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})


export class Dashboard
  implements OnInit {


  userName = 'Candidate';


  constructor(
    private router: Router,

    private authService: AuthService
  ) {}


  // ==========================================
  // LOAD USER
  // ==========================================

  ngOnInit(): void {

    const user =
      this.authService.getUser();


    if (user) {

      this.userName =
        user.name ||
        user.fullName ||
        user.username ||
        'Candidate';

    }

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    this.authService.logout();


    this.router.navigate([
      '/login'
    ]);

  }

}