import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { ICartItems, IOrderTotals, IShoppingCart } from 'src/app/Models/ICart';
import { Observable } from 'rxjs';
import { IProducts } from 'src/app/Models/products';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  OrderService$!:Observable<IOrderTotals|null>
  ShoppingCart$!:Observable<IShoppingCart|null>
  constructor(private shoppingCart:ShoppingCartService) {}

  ngOnInit(): void {
    const bodyTag = document.getElementById('bod')
    bodyTag.classList.remove('no-pointer-events')
    this.OrderService$ = this.shoppingCart.shoppingCartTotalSource$
    this.ShoppingCart$ = this.shoppingCart.shoppingCartSource$ 
  }

  increment(item:ICartItems|IProducts){
    this.shoppingCart.addToShoppingCart(item)
  }
    
  decrement(id:number){
    this.shoppingCart.removingItemsFromShoppingCart(id)
  }

  removeItem(item:ICartItems){
    this.shoppingCart.removeItem(item)
  }

}
