/**
 * Title: security-questions.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for "admin" users to create security questions and view the current active list of security questions..
*/

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Message } from 'primeng/api/message';
import { SecurityQuestionService } from '../../../shared/services/security-question.service';
import { SecurityQuestion } from '../../../shared/models/security-question';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})

export class SecurityQuestionsComponent implements OnInit {

  securityQuestions: SecurityQuestion[] = [];
  serverMessages: Message[] = [];

  securityForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([ Validators.required ])]
  });

  constructor(
    private securityQuestionService: SecurityQuestionService,
    private fb: FormBuilder,
    private dialog: MatDialog) {

    this.securityQuestionService.findAllSecurityQuestions().subscribe({
      next: (res) => {
        this.securityQuestions = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  // createSecurityQuestion
  create(): void {
    const securityQuestion = this.securityForm.controls['text'].value;

    const newSecurityQuestion = {
      text: securityQuestion
    }

    this.securityQuestionService.createSecurityQuestion(newSecurityQuestion).subscribe({
      next: (res) => {
        this.securityQuestions.push(res.data);
      },

      // Error
      error: (e) => {
        console.log(e);
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: e.message
          }
        ]
        window.scroll(0,0);
      },

      // Success
      complete: () => {
        this.securityForm.controls['text'].setErrors({ 'incorrect': false })
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Security Question Added Successfully'
          }
        ]
        window.scroll(0,0);
      }
    })
  }

  //deleteSecurityQuestion
  delete(sqId: string): void {

    // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Security Question?',
        body: 'Are you sure you want to delete this security question?'
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe({
      next: (result) => {

        // If Confirmed
        if (result === 'confirm') {
          this.securityQuestionService.deleteSecurityQuestion(sqId).subscribe({

            // Success
            next: (res) => {
              console.log('Security question deleted successfully!');
              this.securityQuestions = this.securityQuestions.filter(sq => sq._id !== sqId);
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Security Question Deleted Successfully'
                }
              ]
              window.scroll(0,0);
            },

            // Error
            error: (err) => {
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error',
                  detail: err.message
                }
              ]
              window.scroll(0,0);
            }
          })
          return
        }

          // If Cancelled
          this.serverMessages = [
            {
              severity: 'info',
              summary: 'Info:',
              detail: ' Deletion Canceled'
            }
          ]
          window.scroll(0,0);

      }
    })
  }

  ngOnInit(): void {
  }

}
