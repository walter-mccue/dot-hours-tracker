/**
 * Title: register.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for user registration
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SecurityQuestionService } from '../../../shared/services/security-question.service';
import { User } from '../../../shared/models/user';
import { SessionService } from '../../../shared/services/session.service';
import { SecurityQuestion } from '../../../shared/models/security-question';
import { SelectedSecurityQuestion } from '../../../shared/models/selected-security-question';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  // Variables
  securityQuestions: SecurityQuestion[] = [];
  serverMessages: Message[] = [];
  user: User = {} as User;
  selectedSecurityQuestions: SelectedSecurityQuestion[] = [];
  securityMenu1 = '';
  securityMenu2 = '';
  securityMenu3 = '';

  // Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private securityQuestionsService:
    SecurityQuestionService,
    private sessionService: SessionService
  ) {

    // API call to find all active security questions
    this.securityQuestionsService.findAllSecurityQuestions().subscribe({
      next: (res) => {
        this.securityQuestions = res.data;
        console.log('register component --> ' + this.securityQuestions);
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  // Register Form Controls
  registerForm: FormGroup = this.fb.group({
    hubId: [null, Validators.compose([ Validators.required,
      Validators.pattern('^[a-zA-Z]{5}[0-9]{3}' )])],
    password: [null, Validators.compose([ Validators.required,
      Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}' )])],
    firstName: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])],
    lastName: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])],
    email: [null, Validators.compose([ Validators.required, Validators.email ])],
    securityQuestion1: [null, Validators.compose([ Validators.required ])],
    securityQuestion2: [null, Validators.compose([ Validators.required ])],
    securityQuestion3: [null, Validators.compose([ Validators.required ])],
    answerToSecurityQuestion1: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])],
    answerToSecurityQuestion2: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])],
    answerToSecurityQuestion3: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])]
  })

  // Disables second security question drop down until first is selected
  isSelectedMenu1() {
    if (this.securityMenu1) {
      return false
    } else {
      return true
    }
  }

  // Disables third security question drop down until second is selected
  isSelectedMenu2() {
    if (this.securityMenu2) {
      return false
    } else {
      return true
    }
  }

  // Registration function
  register() {
    const registration = this.registerForm.value;

    // Compiles the selected security questions and answers into an array.
    this.selectedSecurityQuestions = [
      {
        questionText: registration.securityQuestion1,
        answerText: registration.answerToSecurityQuestion1
      },
      {
        questionText: registration.securityQuestion2,
        answerText: registration.answerToSecurityQuestion2
      },
      {
        questionText: registration.securityQuestion3,
        answerText: registration.answerToSecurityQuestion3
      }
    ]
    console.log(this.selectedSecurityQuestions);

    // Compiles all input from the form into a new user object.
    this.user = {
      hubId: registration.hubId,
      password: registration.password,
      firstName: registration.firstName,
      lastName: registration.lastName,
      email: registration.email,
      selectedSecurityQuestions: this.selectedSecurityQuestions
    }
    console.log(this.user);

    // API call to save the new user object
    this.sessionService.register(this.user).subscribe({
      next: (res) => {

        // sets the cookies for authentication and authorization within the application
        this.cookieService.set('hubId', registration.hubId, 1);
        this.cookieService.set('role', "standard", 1);

        // Navigates user to the home page.
        this.router.navigate(['/']);
      },

      // Error handling
      error: (e) => {
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: e.message}
        ]
        console.log(`Node.js server error; message: ${e.message}`);
        console.log(e);
        window.scroll(0,0);
      }
    });
  }

  ngOnInit(): void { }

}
