import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { LoadingService } from '../loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loading:LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loading.loading()
    // if(request.url.includes('email') || request.method === 'POST' && request.url.includes('Order')){
      
    // }
    return next.handle(request).pipe(
      finalize(()=>{
        this.loading.idle()
      })
    );
  }
}
export const LoadingInterceptorProvider = {
  provide:HTTP_INTERCEPTORS,
  useClass:LoadingInterceptor,
  multi:true
};
