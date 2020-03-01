// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpResponse,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { ApiService } from './api.service';
// import { Observable } from 'rxjs';
// import { tap, catchError } from 'rxjs/operators';
// import { throwError } from "rxjs";

// @Injectable()
// export class TokenCheckerService implements HttpInterceptor {
//   constructor(public auth: ApiService) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
//     var token = localStorage.getItem("userKey")
//     request = request.clone({
//       headers: request.headers.set('authorization', token)
//     });
//     return next
//     .handle(request)
//     .pipe(
//       tap((ev: HttpEvent<any>) => {
//         if (ev instanceof HttpResponse) {
//           console.log('processing response', ev);
//         }
//       }), 
//       catchError(response => {
//         if (response instanceof HttpErrorResponse) {
//           console.log('Processing http error', response);
//         }
//         return throwError(response);	 
// })
//     )
//   }
// }