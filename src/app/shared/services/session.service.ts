/**
 * Title: session.service.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Session service to direct API calls
 * References: See references.log: line 1
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { VerifySecurityQuestions } from '../models/verify-security-questions';

@Injectable({
  providedIn: 'root'
})

export class SessionService {

  constructor(private http: HttpClient) { }

  // login
  login(hubId: string, password: string): Observable<any> {
    return this.http.post('/api/session/login', {
      hubId,
      password,
    });
  }

  // register
  register(user: User): Observable<any> {
    return this.http.post('/api/session/register', {
      hubId: user.hubId,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      selectedSecurityQuestions: user.selectedSecurityQuestions
    })
  }

  // verifyUser
  verifyUser(hubId: string): Observable<any> {
    return this.http.get('/api/session/verify/users/' + hubId);
  }

  // verifySecurityQuestions
  verifySecurityQuestions(model: VerifySecurityQuestions, hubId: string): Observable<any> {
    return this.http.post('/api/session/verify/users/' + hubId + '/security-questions', {
      questionText1: model.question1,
      questionText2: model.question2,
      questionText3: model.question3,
      answerText1: model.answerToQuestion1,
      answerText2: model.answerToQuestion2,
      answerText3: model.answerToQuestion3
    })
  }

  // resetPassword
  updatePassword(password: string, hubId: string): Observable<any> {
    return this.http.post('/api/session/users/' + hubId + '/reset-password', {
      password
    })
  }
  
}
