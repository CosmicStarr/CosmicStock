import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { IOrderTotals, IShoppingCart } from 'src/app/Models/ICart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ordersummary',
  templateUrl: './ordersummary.component.html',
  styleUrls: ['./ordersummary.component.scss']
})
export class OrdersummaryComponent implements OnInit {
  OrderService$!:Observable<IOrderTotals|null>
  ShoppingCart$!:Observable<IShoppingCart|null>
  constructor(private orderInfo: ShoppingCartService) {}
  ngOnInit(): void {
    this.ShoppingCart$ = this.orderInfo.shoppingCartSource$
    this.OrderService$ = this.orderInfo.shoppingCartTotalSource$
  }
  createPaymentIntent(){
    this.orderInfo.createPaymentIntent().subscribe({})
  }

}
