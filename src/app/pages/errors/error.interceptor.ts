/**
 * Title: error.interceptor.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Error handling for server errors and incorrect user paths or actions
*/

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable,catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {

      // 400 errors redirects user to 404 page
      if ([400, 404].indexOf(err.status) !== -1) {
        this.router.navigate(['/session/404']);
      }

      // 500 errors redirects user to 500 page
      if ([500, 501, 504].indexOf(err.status) !== -1) {
        this.router.navigate(['/session/500']);
      }

      const error = {
        message: err.error.message || err.message,
        httpCode: err.error.httpCode || err.status,
        url: err.url
      }

      console.log(`HttpInterceptor error; origin:${error.url};message:${error.message};httpCode:${error.httpCode}`);
      return throwError(() => error);
    }));
  }
}
