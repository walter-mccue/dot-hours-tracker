/**
 * Title: role.guard.ts
 * Author: Walter McCue
 * Date: 06/02/23
 * Description: Defines the guard to protect routes for "admin" users
*/

import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot, Router
} from '@angular/router';
import { GuardService } from './guard.service';

export const roleGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
  ) => {
    return inject(GuardService).isAdmin()
      ? true
      : inject(Router).createUrlTree(['/']);
  }
