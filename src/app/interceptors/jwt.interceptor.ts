import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('token');
      if(token){
          req = req.clone({
              setHeaders:{
                  Authorization: `Bearer ${token}`
              }
          });
      }
      return next.handle(req);
  }
}
export const AuthInterceptorProvider = {
  provide:HTTP_INTERCEPTORS,
  useClass:JwtInterceptor,
  multi:true
};
