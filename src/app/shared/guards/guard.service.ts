/**
 * Title: guard.service.ts
 * Author: Walter McCue
 * Date: 06/02/23
 * Description: Service to authenticate users for the guards
*/

import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class GuardService {

  constructor (private cookieService: CookieService) {}

  // Function to authenticate users who are logged in.
  isLoggedIn() {
    const hubId = this.cookieService.get('hubId')
    if (!hubId) {
      return false
    }
    return true
  }

  // Function to Authorize admin users for access to the admin section of the site.
  isAdmin() {
    const role = this.cookieService.get('role')
    if (role === 'admin') {
      return true
    }
    return false
  }
}
