/**
 * Title: auth.guard.ts
 * Author: Walter McCue
 * Date: 06/02/23
 * Description: Defines the guard to only allow access to users that have successfully logged in
*/

import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot, Router
} from '@angular/router';
import { GuardService } from './guard.service';

export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
  ) => {
    return inject(GuardService).isLoggedIn()
      ? true
      : inject(Router).createUrlTree(['/session/login']);
  }
