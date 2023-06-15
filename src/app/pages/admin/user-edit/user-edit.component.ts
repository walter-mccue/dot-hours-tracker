/**
 * Title: user-list.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for "admin" users edit or disable a particular user.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Role } from '../../../shared/models/role';
import { RoleService } from '../../../shared/services/role.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit {

  user: User = {} as User;
  userId: string = this.route.snapshot.paramMap.get('userId') ?? '';
  roles: Role[] = [];
  serverMessages: Message[]  = [];

  editForm: FormGroup = this.fb.group({
    hubId: [null, Validators.compose([ Validators.required,
  Validators.pattern('^[a-zA-Z]{5}[0-9]{3}' )])],
    firstName: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])],
    lastName: [null, Validators.compose([ Validators.required,
      Validators.minLength(3), Validators.maxLength(35) ])],
    email: [null, Validators.compose([ Validators.required, Validators.email ])],
    role: [null,Validators.compose([Validators.required])]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService) {

    // findUserById
    this.userService.findUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.editForm.controls['hubId'].setValue(this.user.hubId);
        this.editForm.controls['firstName'].setValue(this.user.firstName);
        this.editForm.controls['lastName'].setValue(this.user.lastName);
        this.editForm.controls['email'].setValue(this.user.email);
        this.editForm.controls['role'].setValue(this.user.role?.text ?? 'standard');

        console.log(this.user);

        this.roleService.findAllRoles().subscribe({
          next: (res) => {
            this.roles = res.data;
          },
          error: (e) => {
            console.log(e);
          }
        })
      }
    })
  }

  // updateUser
  saveUser(): void {
    const updateUser = {
      hubId: this.editForm.controls['hubId'].value,
      firstName: this.editForm.controls['firstName'].value,
      lastName: this.editForm.controls['lastName'].value,
      email: this.editForm.controls['email'].value,
      role: { text: this.editForm.controls['role'].value }
    }

    // Success
    this.userService.updateUser(this.userId, updateUser).subscribe({
      next: (res) => {
        this.router.navigate(['/admin/users']);
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
    this.router.navigate(['/admin/users'])
  }

  ngOnInit(): void {
  }

}
