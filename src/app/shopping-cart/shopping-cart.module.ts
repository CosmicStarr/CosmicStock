import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { CartComponent } from './cart/cart.component';
import { NaviBarModule } from '../navi-bar/navi-bar.module';
import { OrdersummaryComponent } from './ordersummary/ordersummary.component';



@NgModule({
  declarations: [
    CartComponent,
    OrdersummaryComponent,
  ],
  imports: [
    CommonModule,
    NaviBarModule,
    ShoppingCartRoutingModule,
  
  ],
  exports:[
    CartComponent,
    OrdersummaryComponent
  ]
})
export class ShoppingCartModule { }
