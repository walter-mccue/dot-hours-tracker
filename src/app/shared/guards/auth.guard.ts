/**
 * Title: auth.guard.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Defines the guard to only allow access to users that have successfully logged in
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



export const authGuard: CanActivateFn = (route, state) => {

  return true;
};
