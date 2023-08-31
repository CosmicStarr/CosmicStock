import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NaviBarModule } from '../navi-bar/navi-bar.module';
import { ActualcheckoutComponent } from './actualcheckout/actualcheckout.component';
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module';
import { SuccessComponent } from './success/success.component';


@NgModule({
  declarations: [
    ActualcheckoutComponent,
    SuccessComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ReactiveFormsModule,
    NaviBarModule,
    ShoppingCartModule
  ]
})
export class CheckoutModule { }
