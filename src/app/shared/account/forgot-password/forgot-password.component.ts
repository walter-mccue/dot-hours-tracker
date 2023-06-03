/**
 * Title: forgot-password.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component that verifies hubId and begins the forgot password path.
*/

import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {

  serverMessages: Message[] = [];

  form: FormGroup = this.fb.group({
    hubId: [null, Validators.compose([Validators.required])]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService) {
  }

  // verifyUser
  verifyUser() {
    const hubId = this.form.controls['hubId'].value;
    this.sessionService.verifyUser(hubId).subscribe({

      // If Success
      next: (res) => {
        console.log(res);
        this.router.navigate(['/session/verify-security-questions'], { queryParams: { hubId: hubId }, skipLocationChange: true });
      },

      // If Error
      error: (e) => {
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: e.message
          }
        ]
        console.log(e);
      }
    })
  }

  ngOnInit(): void {
  }

}
