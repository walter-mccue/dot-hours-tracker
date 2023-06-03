/**
 * Title: verify-account.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for verifying security questions during the second step of the forgot password path.
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { SelectedSecurityQuestion } from '../../models/selected-security-question';
import { VerifySecurityQuestions } from '../../models/verify-security-questions';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})

export class VerifyAccountComponent implements OnInit {

  selectedSecurityQuestions: SelectedSecurityQuestion[] = [];
  VerifySecurityQuestions: VerifySecurityQuestions  = {} as VerifySecurityQuestions;
  hubId: string;
  serverMessages: Message[] = [];

  // Security questions FormGroup
  form: FormGroup = this.fb.group({
    answerToSecurityQuestion1: [null,Validators.compose([Validators.required])],
    answerToSecurityQuestion2: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion3: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService
  ) {

    // Collects hubId from previous step
    this.hubId = this.route.snapshot.queryParamMap.get('hubId') ?? '';

    // findSelectedSecurityQuestions
    this.userService.findSelectedSecurityQuestions(this.hubId).subscribe({
      next: (res) => {
        this.selectedSecurityQuestions = res.data;
        console.log(this.selectedSecurityQuestions);
      },
      error: (e) => {
        console.log(e);
      },

      // Displays the security questions for the user to answer
      complete: () => {
        this.VerifySecurityQuestions.question1 =
          this.selectedSecurityQuestions[0].questionText;
        this.VerifySecurityQuestions.question2 =
          this.selectedSecurityQuestions[1].questionText;
        this.VerifySecurityQuestions.question3 =
          this.selectedSecurityQuestions[2].questionText;

        console.log('Verify security questions model');
        console.log(this.VerifySecurityQuestions);
      },
    });
  }

  ngOnInit(): void {}

  VerifyQuestions() {
    this.VerifySecurityQuestions.answerToQuestion1 =
      this.form.controls['answerToSecurityQuestion1'].value;
    this.VerifySecurityQuestions.answerToQuestion2 =
      this.form.controls['answerToSecurityQuestion2'].value;
    this.VerifySecurityQuestions.answerToQuestion3 =
      this.form.controls['answerToSecurityQuestion3'].value;

    console.log(this.VerifySecurityQuestions);

    this.sessionService
      .verifySecurityQuestions(this.VerifySecurityQuestions, this.hubId)
      .subscribe({
        next: (res) => {
          console.log(res);

          // If Success
          if (res.message === 'success') {
            this.router.navigate(['/session/reset-password'], {
              queryParams: { isAuthenticated: 'true', hubId: this.hubId },
              skipLocationChange: true,
            });
            return
          }

          // If Error
          this.serverMessages = [
            {
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to verify security question answers',
            }
          ];
          console.log('Unable to verify security question answers');
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
}
