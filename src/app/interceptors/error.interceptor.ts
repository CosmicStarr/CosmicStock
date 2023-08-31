import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error =>{
        if(error){
          if(error.status === 400){
            if(error.error.errors){
              throw error.error; 
            }else{
              // this.toastr.error(error.error.message,error.error.statusCode);
            }
          }
          if(error.status === 401){
            // this.toastr.error(error.error.message,error.error.statusCode);
          }
          if(error.status === 404){
            this.router.navigateByUrl('/notfound');
            // this.toastr.error(error.error.message,error.error.statusCode);
          }
          if(error.status === 500){
            const naviExtra: NavigationExtras ={state:{error:error.error}};
            this.router.navigateByUrl('/servererror',naviExtra);
            // this.toastr.error(error.error.message,error.error.statusCode);
          }
        }
        return throwError(()=>error);
      })
    );
  }
}
export const ErrorInterceptorProvider = {
  provide:HTTP_INTERCEPTORS,
  useClass:ErrorInterceptor,
  multi:true
};
