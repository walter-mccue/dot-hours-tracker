/**
 * Title: reset-password.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component that allows users to reset their password during the final step of the forgot password path.
*/

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../../../shared/services/session.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {

  isAuthenticated: string;
  hubId: string;

  // Password reset FormGroup
  form: FormGroup = this.fb.group({
    password: [null, Validators.compose([ Validators.required,
      Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')])],
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private sessionService: SessionService,
  ) {

    this.isAuthenticated =
      this.route.snapshot.queryParamMap.get('isAuthenticated') ?? '';

    this.hubId = this.route.snapshot.queryParamMap.get('hubId') ?? '';
  }

  // updatePassword
  updatePassword() {
    const password = this.form.controls['password'].value;
    this.sessionService.updatePassword(password, this.hubId).subscribe({

      // If reset password is Successful
      next: (res) => {
        this.sessionService.verifyUser(this.hubId).subscribe({

          // If verifyUser is Successful
          next: (res) => {
            this.cookieService.set('hubId', this.hubId, 1);
            this.cookieService.set('role', res.data.role.text, 1);
          },

          // If verifyUser Error
          error: (e) => {
            console.log(e);
          }
        })

        // If reset password is Successful and verifyUser is Successful
        this.router.navigate(['/']);
      },

      // If Error
      error: (e) => {
        console.log(e);
      }
    })
  }

  ngOnInit(): void {
  }

}
