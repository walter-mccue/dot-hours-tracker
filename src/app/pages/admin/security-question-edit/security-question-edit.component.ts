/**
 * Title: security-question-edit.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for "admin" users to edit an active security question.
*/

import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityQuestionService } from '../../../shared/services/security-question.service';
import { SecurityQuestion } from '../../../shared/models/security-question';


@Component({
  selector: 'app-security-question-edit',
  templateUrl: './security-question-edit.component.html',
  styleUrls: ['./security-question-edit.component.scss']
})

export class SecurityQuestionEditComponent implements OnInit {

  question: SecurityQuestion = {} as SecurityQuestion;
  questionId: string = this.route.snapshot.paramMap.get('questionId') ?? '';;
  serverMessages: Message[] = [];

  editForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([ Validators.required ])],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private securityQuestionService: SecurityQuestionService) {

    // findSecurityQuestionById
    this.securityQuestionService
      .findSecurityQuestionById(this.questionId)
      .subscribe({
        next: (res) => {
          this.question = res.data;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.editForm.controls['text'].setValue(this.question.text);
        },
      });
  }

  // updateSecurityQuestion
  save(): void {
    const updateSecurityQuestion: SecurityQuestion = {
      text: this.editForm.controls['text'].value,
    };

    // Success
    this.securityQuestionService
      .updateSecurityQuestion(this.questionId, updateSecurityQuestion)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/security-questions']);
        },

        // Error
        error: (e) => {
          this.serverMessages = [
            {
              severity: 'error',
              summary: 'Error',
              detail: e.message
            },
          ];
          console.log(
            'Error occurred while saving the updated security question.'
          );
        },
      });
  }

  // Cancel edit and return
  cancel(): void {
    this.router.navigate(['/security-questions']);
  }

  ngOnInit(): void {

  }

}
