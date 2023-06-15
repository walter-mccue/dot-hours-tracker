/**
 * Title: role-edit.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for "admin" users to edit the name of an active role.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { RoleService } from '../../../shared/services/role.service';
import { Role } from '../../../shared/models/role';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit {

  role: Role = {} as Role;
  roleId: string = this.route.snapshot.paramMap.get('roleId') ?? '';;
  serverMessage: Message[] = [];

  editForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  })

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private roleService: RoleService) {

    // findRoleById
    this.roleService.findRoleById(this.roleId).subscribe({
      next: (res) => {
        this.role = res.data;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.editForm.controls['text'].setValue(this.role.text);
      }
    })
  }

  // updateRole
  save(): void {
    const updatedRole: Role = {
      text: this.editForm.controls['text'].value
    }

    this.roleService.updateRole(this.roleId, updatedRole).subscribe({
      next: (res) => {
        this.router.navigate(['/admin/roles']);
      },
      error: (e) => {
        this.serverMessage = [
          {
            severity: 'error',
            summary: 'Error',
            detail: e.message
          }
        ]
        console.log('Error occurred while saving the updated role')
      }

    })
  }

  // Cancel edit and return
  cancel(): void {
    this.router.navigate(['/admin/roles'])
  }

  ngOnInit(): void {
  }

}
