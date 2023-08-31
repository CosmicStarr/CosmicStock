import { Injectable, OnInit } from '@angular/core';
import { IEmailChangeModel, IForgotPassword, ILoginUser, IResetPassword, IUser, IUserAddress } from '../Models/IUser';
import { HttpClient,HttpParams } from '@angular/common/http';
import { ReplaySubject, map} from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { IActualOrder, IOrderedItems } from '../Models/IOrder';
import { IWishList } from '../Models/wishlist';
import { PaginatedResults } from '../Models/pagination';
import { StarrParams } from '../Models/params';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';


@Injectable({
  providedIn: 'root'
})

export class AccountService implements OnInit {
  baseUrl = environment.baseUrl;
  public currentUserSource = new ReplaySubject<ILoginUser>(1)
  PaginatedResult:PaginatedResults<IActualOrder[]> = new PaginatedResults<IActualOrder[]>()
  PaginatedWished:PaginatedResults<IWishList[]> = new PaginatedResults<IWishList[]>()
  currentUser$ = this.currentUserSource.asObservable()
  constructor(private http:HttpClient,private route:Router,private shop:ShoppingCartService) { }
  ngOnInit(): void {

  }

  WishList(id:number){
    return this.http.post<IWishList>(this.baseUrl + 'Account/WishList/' + id,{})
  }

  DeleteWishedItem(id:number){
    return this.http.delete<IWishList>(this.baseUrl + 'Account/WishList/' + id,{})
  }

  GetWishlist(sunParams?:StarrParams){
    let params = new HttpParams
    if(sunParams?.pageNumber !== undefined && sunParams?.pageSize !== undefined){
      params = params.append('pageNumber',sunParams.pageNumber.toString());
      params = params.append('pageSize',sunParams.pageSize.toString());
      params = params.append('TotalItems',sunParams.TotalItems.toString()); 
    }
    return this.http.get<IWishList[]>(this.baseUrl + 'Account/WishList', { observe:'response', params})
    .pipe(
      map(response =>{
        this.PaginatedWished.result = response.body;
        if(response.headers.get('Pagination') !== undefined || response.headers.get('Pagination') == null){
          this.PaginatedResult.Pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return this.PaginatedWished
      },(error: any)=>{
        console.log(error)
      })
    )
  }
  CreateUserAddress(address:IUserAddress){
    return this.http.post<IUserAddress>(this.baseUrl + 'Account/Address',address)
  }

  DeleteAnAddress(id:number){
   return this.http.delete<IUserAddress>(this.baseUrl + 'Account/Address/' + id )
  }
  
  PatchUserAddress(address:IUserAddress){
    return this.http.patch<IUserAddress>(this.baseUrl + 'Account/Address',address)
  }

  GetUserAddress(){
    return this.http.get<IUserAddress[]>(this.baseUrl + 'Account/Address')
  }
  
  GetUserAddressbyId(id:number){
    return this.http.get<IUserAddress>(this.baseUrl + 'Account/Address/' + id)
  }

  GetAllOrders(sunParams?:StarrParams){
    let params = new HttpParams
    if(sunParams?.pageNumber !== undefined && sunParams?.pageSize !== undefined){
      params = params.append('pageNumber',sunParams.pageNumber.toString());
      params = params.append('pageSize',sunParams.pageSize.toString());
      params = params.append('TotalItems',sunParams.TotalItems.toString()); 
    }
    return this.http.get<IActualOrder[]>(this.baseUrl + 'Order/User', { observe:'response', params})
    .pipe(
      map(response =>{
        this.PaginatedResult.result = response.body;
        if(response.headers.get('Pagination') !== undefined || response.headers.get('Pagination') == null){
          this.PaginatedResult.Pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return this.PaginatedResult
      },(error: any)=>{
        console.log(error)
      })
    )
  }

  GetAllOrderedItems(id:number){
    return this.http.get<IActualOrder[]>(this.baseUrl + 'Order/' + id)
  }

  secondRequestToConfirmEmail(){
    return this.http.post(this.baseUrl + 'Account/SecondRequest',{})
  }

  beginRequestToChangeEmail(){
    return this.http.post(this.baseUrl + 'Account/EmailChange',{})
  }

  actualRequestToChangeEmail(info:IEmailChangeModel){
    return this.http.post<IEmailChangeModel>(this.baseUrl + 'Account/RequestToChange',info)
  }

  PatchValues(user:IUser){
    return this.http.patch<IUser>(this.baseUrl + 'Account/UpdateUser',user)
    .pipe(
      map((user:IUser)=>{
      if(user){
        console.log(user)
        this.setCurrentUser(user)
      }
    }))
  }
  
  Register(values:any){
   return this.http.post<IUser>(this.baseUrl + 'Account/Register',values)
    .pipe(
      map((user:IUser)=>{
      if(user){
        this.setCurrentUser(user)
      }
    }))
  }

  LoginUser(values:ILoginUser){
    return this.http.post<ILoginUser>(this.baseUrl + 'Account/Login',values)
    .pipe(
      map((results:ILoginUser)=>{
        if(results){
          const decodeToken = this.getDecodedAccessToken(results.token)
          results.email = decodeToken?.email;
          results.jobDepartment = decodeToken?.JobDepartment;
          results.role = decodeToken?.role;
          this.setCurrentUser(results)
        }
      })
    )
  }

  forgotPassword(email:IForgotPassword){
    return this.http.post(this.baseUrl + 'Account/ForgotPassword', email)
  }

  resetPassword(confirmP:IResetPassword){
    return this.http.post<IResetPassword>(this.baseUrl + 'Account/ResetPassword',confirmP,{})
  }

  confirmEmail(model:any){
    return this.http.post(this.baseUrl + 'Account/ConfirmEmail',model)
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
  setCurrentUser(user:ILoginUser){
    if(user){
      user.role = [];
      const roles = this.getDecodedAccessToken(user.token).role;
      Array.isArray(roles)? user.role = roles : user.role.push(roles);
      localStorage.setItem('user',JSON.stringify(user))
      localStorage.setItem('token',user.token);
      this.currentUserSource.next(user);
    }
  }
  
  logOut(){
    let info = confirm('are you sure?')
    if(info.valueOf()){
      localStorage.clear()
      this.currentUserSource.next(null);
      this.shop.changeShoppingCartValue(null)
      this.route.navigateByUrl("/account/login")
    }
  }

}
