/**
 * Title: users.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Component for "admin" users to view a list of authorized users
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api/message';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  users: User[] = [];
  serverMessages: Message[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog) {

    // findAllUsers
    this.userService.findAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  // deleteUser
  delete(userId: string) {

    // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete User?',
        body: 'Are you sure you want to delete this user?'
      },
      disableClose: true
    })

    // If confirmed
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'confirm') {
          this.userService.deleteUser(userId).subscribe({

            // Success
            next: (res) => {
              console.log('User deleted successfully');
              this.users = this.users.filter(user => user._id !== userId)
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'User Deleted Successfully'
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
            summary: 'Info',
            detail: 'Deletion Canceled'
          }
        ]
        window.scroll(0,0);
      }
    })
  }

  ngOnInit(): void {
  }

}
