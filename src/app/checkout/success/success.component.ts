import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IActualOrder } from 'src/app/Models/IOrder';
import { CheckoutService } from '../checkout.service';
import { IUserAddress } from 'src/app/Models/IUser';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit{
  id?:number
  order?:IActualOrder
  actualShippingAddresses?:IUserAddress
  actualBillingAddresses?:IUserAddress
  constructor(private router:ActivatedRoute,private check:CheckoutService,private account:AccountService){}
  ngOnInit(): void {
    this.router.params.subscribe({
      next: (x)=> this.id = +x['id']
     })
     this.LoadOrderInfo()
  }

  //I have to load billing address from actualOrder! comment out loadaddress
  LoadOrderInfo(){
    this.check.getOrder(this.id).subscribe({
      next:(x) => {
        this.order = x
        this.actualShippingAddresses = x.shippingAddress
        this.actualBillingAddresses = x.billingAddress
      }
    })
  }

}
