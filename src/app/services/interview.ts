import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  private apiUrl =
    'http://localhost:5000/api/interviews';


  constructor(
    private http: HttpClient
  ) {}


  private getHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  }


  createInterview(
    data: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data,
      {
        headers: this.getHeaders()
      }
    );

  }


  getMyInterviews(): Observable<any> {

    return this.http.get(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );

  }

}