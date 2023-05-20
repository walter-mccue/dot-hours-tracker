/**
 * Title: roles.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for "admin" users to create roles and view the list of active roles.
*/

import { Component, OnInit } from '@angular/core';
import { Role } from '../../../shared/models/role';
import { RoleService } from '../../../shared/services/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit {

  roles: Role[] = [];
  serverMessages: Message[] = [];

  roleForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  })

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private dialog: MatDialog) {


    this.roleService.findAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  // createRole
  create() {
    const newRole: Role = {
      text: this.roleForm.controls['text'].value
    }

    this.roleService.createRole(newRole).subscribe({
      next: (res) => {
        if (res.data) {
          this.roles.push(res.data);
          return
        }

        // Error
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: res.message
          }
        ]
        window.scroll(0, 0);
      },
      error: (e) => {
        console.log(e)
      },

      // Success
      complete: () => {
        this.roleForm.controls['text'].setErrors({ 'incorrect': false })
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Role Added Successfully'
          }
        ]
        window.scroll(0, 0);
      }
    })
  }

  // deleteRole
  delete(roleId: string): void {

    // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Role?',
        body: 'Are you sure you want to delete this role?'
      },
      disableClose: true
    })

    // If Confirmed
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'confirm') {
          this.roleService.deleteRole(roleId).subscribe({

            // Success
            next: (res) => {
              console.log('Role deleted successfully!');
              this.roles = this.roles.filter(role => role._id !== roleId);
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Role Deleted Successfully'
                }
              ]
              window.scroll(0, 0);
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
              window.scroll(0, 300);
            }
          })
          return
        }

        // If Canceled
        this.serverMessages = [
          {
            severity: 'info',
            summary: 'Info:',
            detail: ' Deletion Canceled'
          }
        ]
        window.scroll(0, 0);
      }
    })
  }

  ngOnInit(): void {
  }

}
