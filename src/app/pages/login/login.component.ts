/**
 * Title: login.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component that allows users to login.
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../shared/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  ngOnInit(): void { }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private sessionService: SessionService,
    private http: HttpClient
  ) { }

  serverMessages: Message[] = [];

  loginForm: FormGroup = this.fb.group({
    hubId: [null, Validators.compose([ Validators.required ])],
    password: [ null, Validators.compose([ Validators.required ])],
  });

  login() {
    const hubId = this.loginForm.controls['hubId'].value;
    const password = this.loginForm.controls['password'].value;
    this.sessionService.login(hubId, password).subscribe({

      // Login success
      next: (res) => {
        console.log(res);
        this.cookieService.set('hubId', res.data.hubId, 1);
        this.cookieService.set('role', res.data.role.text, 1);
        this.router.navigate(['/']);
      },

      // Error if login unsuccessful
      error: (e) => {
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: "Invalid Hub Id or Password."
          },
        ];
        console.log(e);
      },
    });
  }

}
