/**
 * Title: profile.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for users to edit their profile.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../../shared/services/session.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  user: User = {} as User;
  hubId: string;
  role: string;
  userId: string = '';
  serverMessages: Message[] = [];

  profileForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])],
    lastName: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])],
    email: [null, Validators.compose([ Validators.required, Validators.email ])],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService,
    private cookieService: CookieService
  ) {

    this.hubId = this.cookieService.get('hubId') ?? '';
    this.role = this.cookieService.get('role') ?? 'standard';

    // findUserById
    this.sessionService.verifyUser(this.hubId).subscribe({
      next: (res) => {
        this.user = res.data;
        this.userId = res.data._id;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.profileForm.controls['firstName'].setValue(this.user.firstName);
        this.profileForm.controls['lastName'].setValue(this.user.lastName);
        this.profileForm.controls['email'].setValue(this.user.email);

        console.log(this.user);
      }
    })
  }

  // updateUser
  saveUser(): void {
    const updateUser = {
      hubId: this.hubId,
      firstName: this.profileForm.controls['firstName'].value,
      lastName: this.profileForm.controls['lastName'].value,
      email: this.profileForm.controls['email'].value,
      role: { text: this.role }
    }

    // Success
    this.userService.updateUser(this.userId, updateUser).subscribe({
      next: (res) => {
        this.router.navigate(['/profile']);
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: "Profile Successfully Updated"
          }
        ]
      },

      // Error
      error: (e) => {
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: e.message
          }
        ]
        console.log(`Node.js server error; httpCode:${e.httpcode}; message:${e.message}`)
        console.log(e);
      }
    })
  }

  // Cancel edit and return
  cancel(): void {
    this.router.navigate(['/'])
  }

  ngOnInit(): void {
  }

}
