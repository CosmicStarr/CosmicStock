import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ICartItems, INewShoppingCart, IOrderTotals, IShoppingCart } from '../Models/ICart';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProducts } from '../Models/products';

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService  {
  baseUrl = environment.baseUrl;
  private shoppingCartMainSource = new BehaviorSubject<IShoppingCart | null>(null)
  //componets outside this service can call this obserable
  shoppingCartSource$ = this.shoppingCartMainSource.asObservable() 
  private shoppingCartTotal = new BehaviorSubject<IOrderTotals | null>(null)
  //componets outside this service can call this obserable
  shoppingCartTotalSource$ = this.shoppingCartTotal.asObservable() 
  shipping:number = 7.99
  constructor(private http:HttpClient) {}

  getInfo(){
    return this.shoppingCartSource$
  }

  createPaymentIntent(){
    return this.http.post<IShoppingCart>(this.baseUrl + 'Payment/' + this.getShoppingCartValue()?.id,{})
    .pipe(
      tap(x =>{
        this.shoppingCartMainSource.next(x)
        console.log(x)
      })
    )
  }

  getShoppingCart(id:string){
    return this.http.get<IShoppingCart>(this.baseUrl + 'ShoppingCart?id=' + id).subscribe({
      next: x=> {
        if(x.id != null){
          console.log(x)
          this.shoppingCartMainSource.next(x)
          localStorage.setItem("shoppingCartId",x.id)
          this.calculateShoppingCartTotal()
        }
        else{
          return
        }
      }
    })
  }
  
  setShoppingCart(cart:IShoppingCart){
    return this.http.post<IShoppingCart>(this.baseUrl + 'ShoppingCart', cart).subscribe({
      next: x=> {
        console.log(x)
        this.shoppingCartMainSource.next(x)
        this.calculateShoppingCartTotal()
      }
    })
  }

  //Getting the current value of the shopping Cart
  getShoppingCartValue(){
    return this.shoppingCartMainSource.value
  }

  changeShoppingCartValue(info){
    this.shoppingCartMainSource.next(info)
  }

  //adding or updating the shopping cart items
  addToShoppingCart(items:IProducts | ICartItems, amount = 1){
    if(this.isProduct(items)) items = this.mapIProductObjectToIShoppingCartObject(items,amount)
    //returning a mapped product => ICartItem
    //getting the shopping Cart if it exist. If it does not, create a new one
    const getShoppingCart = this.getShoppingCartValue() ?? this.createAShoppingCart() 
    //checking to the quantity of each item in the cart. If they have a value update it.
    getShoppingCart!.shoppingCartItems = this.addOrUpdateItems(getShoppingCart?.shoppingCartItems,items,amount)
    //place the shopping cart in localStorage
    this.setShoppingCart(getShoppingCart!)
  }

  addOrUpdateItems(items: ICartItems[] | undefined, itemsAdding: ICartItems, amount = 1): ICartItems[] | undefined {
    const item = items?.find(x=>x.id === itemsAdding.id)
    if(item) item.amount += amount
    else{
      itemsAdding.amount = amount
      items?.push(itemsAdding)
    }
    return items
  }

  removingItemsFromShoppingCart(id:number, amount = 1){
    const shoppingCart = this.getShoppingCartValue()
    if(!shoppingCart) return
    const item = shoppingCart.shoppingCartItems?.find(x=>x.id === id)
    if(item){
      item.amount -= amount
      if(item.amount === 0){
        shoppingCart.shoppingCartItems = shoppingCart.shoppingCartItems?.filter(x=>x.id !== id)
      }
      if(shoppingCart.shoppingCartItems!.length > 0) this.setShoppingCart(shoppingCart)
      else this.deleteShoppingCart(shoppingCart)
    }
  }

  removeItem(item: ICartItems) {
    const Cart = this.getShoppingCartValue()
    if(Cart?.shoppingCartItems!.some(x => x.id === item.id)){
      Cart.shoppingCartItems = Cart.shoppingCartItems!.filter(x => x.id !== item.id)
      if(Cart.shoppingCartItems.length > 0){
        this.setShoppingCart(Cart)
      }else{
        this.deleteShoppingCart(Cart)
      }  
    }
  }

  deleteShoppingCart(shoppingCart: IShoppingCart) {
    this.http.delete<IShoppingCart>(this.baseUrl + 'ShoppingCart?id=' + shoppingCart.id).subscribe({
      next:()=>{
          this.deleteShoppingCartLocally()
      }
    })
  }

  deleteShoppingCartLocally(){
    this.shoppingCartMainSource.next(null)
    this.shoppingCartTotal.next(null)
    localStorage.removeItem('shoppingCartId')
  }

  createAShoppingCart(): INewShoppingCart | null {
    const nuShoppingCart = new INewShoppingCart()
    localStorage.setItem('shoppingCartId',nuShoppingCart.id)
    return nuShoppingCart
  }

  private isProduct(item:IProducts|ICartItems):item is IProducts{
    return (item as IProducts).isAvailable == undefined
  }

  private mapIProductObjectToIShoppingCartObject(items:IProducts,amount:number): ICartItems{
    return {
      id:items.id,
      name:items.featuredName,
      description:items.description,
      price: items.price,
      imageUrl: items.imageUrl,
      amount:amount,
      brand:items.brand,
      category:items.category
    }
  }

  private calculateShoppingCartTotal(){
    const shoppingCart = this.getShoppingCartValue()
    if(!shoppingCart) return
    const shipping:number = this.shipping
    const subTotal = shoppingCart.shoppingCartItems!.reduce((a,b) => (b.price * b.amount) + a, 0)
    if(subTotal > 1500) {
      this.shipping = 0
    }else{
      this.shipping = 7.99
    }
    const total = subTotal! + shipping 
    this.shoppingCartTotal.next({shipping,subTotal,total})
  }
  
}
