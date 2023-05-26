/**
 * Title: user.service.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: User service to direct API calls
 * References: See references.log: line 1
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) {}

  // findAllUsers
  findAllUsers(): Observable<any> {
    return this.http.get('/api/users');
  }

  // findUserById
  findUserById(userId: string): Observable<any> {
    return this.http.get('/api/users/' + userId);
  }

  // createUser
  createUser(user: User): Observable<any> {
    return this.http.post('/api/users', {
      hubId: user.hubId,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }

  // updateUser
  updateUser(userId: string, user: User): Observable<any> {
    return this.http.put('/api/users/' + userId, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  }

  // deleteUser
  deleteUser(userId: string): Observable<any> {
    return this.http.delete('/api/users/' + userId);
  }

  // findSelectedSecurityQuestions
  findSelectedSecurityQuestions(hubId: string): Observable<any> {
    return this.http.get('api/users/' + hubId + '/security-questions');
  }

}
