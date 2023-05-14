
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
