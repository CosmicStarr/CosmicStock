import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductsModule } from './products/products.module';
import { NaviBarModule } from './navi-bar/navi-bar.module';
import { AccountModule } from './account/account.module';
import { AuthInterceptorProvider } from './interceptors/jwt.interceptor';
import { ErrorInterceptorProvider } from './interceptors/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingInterceptorProvider } from './interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ProductsModule,
    NaviBarModule,
    AccountModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  exports:[
    NgxSpinnerModule

  ],
  providers: [
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    LoadingInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
