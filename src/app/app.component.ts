import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { ILoginUser} from './Models/IUser';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { LoadingService } from './loading.service';
import { IShoppingCart } from './Models/ICart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isloading:boolean 
  constructor(private accountService:AccountService, private shopService:ShoppingCartService){}

  ngOnInit(): void {
    this.setCurrentUser()
    let Id = localStorage.getItem('shoppingCartId')
    this.shopService.getShoppingCart(Id)
  }
  
  setCurrentUser(){
    var info = localStorage.getItem('user')
    const user: ILoginUser = JSON.parse(info!);
    if(user){
      this.accountService.setCurrentUser(user);
    }
  }
}
