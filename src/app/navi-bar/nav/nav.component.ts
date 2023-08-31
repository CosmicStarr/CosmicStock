import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IShoppingCart } from 'src/app/Models/ICart';
import { ILoginUser, IUser } from 'src/app/Models/IUser';
import { AccountService } from 'src/app/account/account.service';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  currentUser$?:Observable<ILoginUser>
  shoppingCart$?:Observable<IShoppingCart>
  showMenu:boolean = false

  constructor(private userInfo:AccountService, private shoppingCart:ShoppingCartService) {}

  ngOnInit(): void {
    this.currentUser$ = this.userInfo.currentUser$
    this.shoppingCart$ = this.shoppingCart.shoppingCartSource$
  }

  toggleMenu(){
    this.showMenu = !this.showMenu
  }

  logout(){
    this.userInfo.logOut()
  }

}
