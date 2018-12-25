import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(public snackbar: MatSnackBar) {}

  // intercept(
  //   request: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(
  //     tap(
  //       (event: HttpEvent<any>) => {
  //         console.log('hello');
  //       },
  //       (err: any) => {
  //         if (err instanceof HttpErrorResponse) {
  //           this.snackbar.open(err.message);
  //         }
  //       }
  //     )
  //   );
  // }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('http', request);
    return next.handle(request);
  }
}
