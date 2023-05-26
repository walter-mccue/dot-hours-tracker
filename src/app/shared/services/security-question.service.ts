/**
 * Title: security-question.service.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Security Question service to direct API calls
 * References: See references.log: line 1
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SecurityQuestion } from '../models/security-question';

@Injectable({
  providedIn: 'root'
})

export class SecurityQuestionService {

  constructor(private http: HttpClient) { }

  // findAllSecurityQuestions
  findAllSecurityQuestions(): Observable<any> {
    return this.http.get('/api/security');
  }

  // findSecurityQuestionById
  findSecurityQuestionById(questionId: string): Observable<any> {
    return this.http.get('/api/security/' + questionId);
  }

  // createSecurityQuestion
  createSecurityQuestion(newSecurityQuestion: SecurityQuestion): Observable<any> {
    return this.http.post('/api/security', {
      text: newSecurityQuestion.text
    })
  }

  // updateSecurityQuestion
  updateSecurityQuestion(questionId: string, updateSecurityQuestion: SecurityQuestion): Observable<any> {
    return this.http.put('/api/security/' + questionId, {
      text: updateSecurityQuestion.text
    })
  }

  // deleteSecurityQuestion
  deleteSecurityQuestion(questionId: string): Observable<any> {
    return this.http.delete('/api/security/' + questionId);
  }

}
