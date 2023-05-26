/**
 * Title: auth-layout.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Default component for all users who have NOT been authenticated.
*/

import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TermsOfServiceComponent } from '../account/terms-of-service/terms-of-service.component';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})

export class AuthLayoutComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  tos() {
    this.dialog.open(TermsOfServiceComponent)
  }

  ngOnInit(): void { }

}
