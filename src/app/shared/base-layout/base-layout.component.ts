/**
 * Title: base-layout.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Default component for all users who have been authenticated.
*/

import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { TermsOfServiceComponent } from '../account/terms-of-service/terms-of-service.component';


@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})

export class BaseLayoutComponent implements OnInit {

  year: number = Date.now();
  hubId: string;
  role: string;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private dialog: MatDialog
  ) {
    
    this.hubId = this.cookieService.get('hubId') ?? '';
    this.role = this.cookieService.get('role') ?? 'standard';
  }

  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }

  tos() {
    this.dialog.open(TermsOfServiceComponent)
  }

  ngOnInit(): void { }

}
