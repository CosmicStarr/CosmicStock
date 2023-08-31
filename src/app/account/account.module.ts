import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AccountRoutingModule } from './account-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './profile/orders/orders.component';
import { PersonalInfoComponent } from './profile/personal-info/personal-info.component';
import { WishlistComponent } from './profile/wishlist/wishlist.component';
import { AddressComponent } from './profile/address/address.component';
import { NaviBarModule } from '../navi-bar/navi-bar.module';
import { OrderDetailsComponent } from './profile/orders/order-details/order-details.component';
import { AddressDetailsComponent } from './profile/address/address-details/address-details.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ClickedOutsideDirective } from './clicked-outside.directive';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ChangeEmailComponent } from './profile/change-email/change-email.component';
import { ConfirmChangeEmailRequestComponent } from './confirm-change-email-request/confirm-change-email-request.component';


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    OrdersComponent,
    PersonalInfoComponent,
    WishlistComponent,
    AddressComponent,
    OrderDetailsComponent,
    AddressDetailsComponent,
    RegisterPageComponent,
    ClickedOutsideDirective,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ConfirmEmailComponent,
    ChangeEmailComponent,
    ConfirmChangeEmailRequestComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NaviBarModule,

  ],exports:[
    RegisterComponent
  ]
})
export class AccountModule { }
