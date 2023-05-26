/**
 * Title: role.guard.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Defines the guard to protect routes for "admin" users
*/

import { Injectable } from '@angular/core';
import { CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';



export const roleGuard: CanActivateFn = (route, state) => {

  return true;
};
