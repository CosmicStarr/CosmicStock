import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './profile/address/address.component';
import { OrdersComponent } from './profile/orders/orders.component';
import { PersonalInfoComponent } from './profile/personal-info/personal-info.component';
import { WishlistComponent } from './profile/wishlist/wishlist.component';
import { OrderDetailsComponent } from './profile/orders/order-details/order-details.component';
import { AddressDetailsComponent } from './profile/address/address-details/address-details.component';
import { LoginComponent } from './login/login.component';
import { redirectGuard } from '../guard/authGuard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ChangeEmailComponent } from './profile/change-email/change-email.component';
import { ConfirmChangeEmailRequestComponent } from './confirm-change-email-request/confirm-change-email-request.component';

const routes: Routes = [
  {path:'forgot-password',component:ForgotPasswordComponent},
  {path:'confirm-email',component:ConfirmEmailComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'login',component:LoginComponent},
  {path:'confirm-change-email-request',component:ConfirmChangeEmailRequestComponent},
  {path:'profile',canActivate:[redirectGuard],component:ProfileComponent,children:[
    {path:'address',component:AddressComponent},
    {path:'',component:OrdersComponent,pathMatch:'full'},
    {path:'order-details/:id',component:OrderDetailsComponent},
    {path:'address-details/:id',component:AddressDetailsComponent},
    {path:'personal-info',component:PersonalInfoComponent},
    {path:'wishlist',component:WishlistComponent},
    {path:'change-email',component:ChangeEmailComponent},
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
