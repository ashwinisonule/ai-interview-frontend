import { Routes } from '@angular/router';

import { Login }
  from './components/login/login';

import { Register }
  from './components/register/register';

import { Dashboard }
  from './components/dashboard/dashboard';

import { CreateInterview }
  from './components/create-interview/create-interview';

import { MyInterviews }
  from './components/my-interviews/my-interviews';

import { Interview }
  from './components/interview/interview';

import { Evaluation }
  from './components/evaluation/evaluation';

import { Result }
  from './components/result/result';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'create-interview',
    component: CreateInterview
  },

  {
    path: 'my-interviews',
    component: MyInterviews
  },

  {
    path: 'interview',
    component: Interview
  },

  {
    path: 'evaluation',
    component: Evaluation
  },

  {
    path: 'result',
    component: Result
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];