import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IActualOrder, ICreateOrder } from '../Models/IOrder';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService implements OnInit {
  baseUrl = environment.baseUrl
  constructor(private http:HttpClient) { }
  ngOnInit(): void {
    
  }

  createOrder(order:ICreateOrder){
   return this.http.post<ICreateOrder>(this.baseUrl + 'Order', order)
  }

  getOrder(id:number){
    return this.http.get<IActualOrder>(this.baseUrl + 'Order/PurchaseInfo/' + id)
  }
}
