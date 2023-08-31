import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICartItems, IOrderTotals, IShoppingCart } from 'src/app/Models/ICart';
import { IUserAddress } from 'src/app/Models/IUser';
import { AccountService } from 'src/app/account/account.service';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { CheckoutService } from '../checkout.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, loadStripe } from '@stripe/stripe-js';
import { NavigationExtras, Router } from '@angular/router';
import { IActualOrder } from 'src/app/Models/IOrder';
// 
@Component({
  selector: 'app-actualcheckout',
  templateUrl: './actualcheckout.component.html',
  styleUrls: ['./actualcheckout.component.scss']
})
export class ActualcheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  order:IActualOrder
  ShoppingCart$!:Observable<IShoppingCart|null>
  OrderService$!:Observable<IOrderTotals|null>
  address:IUserAddress
  billingaddress:IUserAddress
  checkoutForm!:FormGroup 
  checkoutBillingForm!:FormGroup 
  paymentForm!:FormGroup
  amount!:ICartItems
  setAddressInfo:boolean = false
  setAddressBillingInfo:boolean = false
  savebillingInfo:boolean = false
  shippingAdd:string = "shipping"
  @ViewChild('cardNumber') cardNumberElement!: ElementRef
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef
  @ViewChild('cardCvc') cardCvcElement!: ElementRef
  stripe: Stripe|null = null;
  cardCvc?:StripeCardCvcElement;
  cardExpiry?:StripeCardExpiryElement;
  cardNumber?:StripeCardNumberElement;
  cardError:any;
  loading = false;
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCVCValid = false;
  constructor(private account:AccountService, private shopService:ShoppingCartService, private checkoutSerice:CheckoutService,private router:Router) {}
  ngOnInit(): void {
    const bodyTag = document.getElementById('bod')
    bodyTag.classList.remove('no-pointer-events')
    this.OrderService$ = this.shopService.shoppingCartTotalSource$
    this.ShoppingCart$ = this.shopService.shoppingCartSource$
    this.createForm()
    this.createBillingForm()
    this.getUserAddress()
    this.createPaymentForm()
  }
  ngAfterViewInit(){
    loadStripe('pk_test_51JjtO5F0pfFIlxfwQ69mIRu6NH34lX2vw86F6fXpXRWIBcfYynd7rB8IODhgYE09J1rDBy4DuUzuDX2nd4HwMst300Je0Qkio6').then(stripe =>{
      this.stripe = stripe
      const elements = stripe?.elements();
      if(elements){
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement.nativeElement);
        this.cardNumber.on('change', x =>{
          this.cardNumberValid = x.complete
          if(x.error) this.cardError = x.error.message
          else this.cardError = null
        })

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
        this.cardExpiry.on('change', x =>{
          this.cardExpiryValid = x.complete
          if(x.error) this.cardError = x.error.message
          else this.cardError = null
        })
        
        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement.nativeElement);
        this.cardCvc.on('change', x =>{
          this.cardCVCValid = x.complete
          if(x.error) this.cardError = x.error.message
          else this.cardError = null
        })
      }
    });

  }

  get PaymentFormValid(){
    return this.paymentForm.valid
    && this.cardCVCValid
    && this.cardNumberValid
    && this.cardExpiryValid
  }
  ngOnDestroy(){

  }

  createForm(){
    this.checkoutForm = new FormGroup({
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
      addressLine1: new FormControl('',Validators.required),
      addressLine2: new FormControl('',Validators.required),
      city: new FormControl('',Validators.required),
      state: new FormControl('',Validators.required),
      zipCode: new FormControl('',Validators.required),
      phoneNumber:new FormControl('',Validators.required),
      saveAddressInfo:new FormControl(false),
      shippingIsBilling:new FormControl(false)
    })
  }

  createBillingForm(){
    this.checkoutBillingForm = new FormGroup({
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
      addressLine1: new FormControl('',Validators.required),
      addressLine2: new FormControl('',Validators.required),
      city: new FormControl('',Validators.required),
      state: new FormControl('',Validators.required),
      zipCode: new FormControl('',Validators.required),
      phoneNumber:new FormControl('',Validators.required),
      saveAddressInfo:new FormControl(false),
      shippingIsBilling:new FormControl(false)
    })
  }

  createPaymentForm(){
    this.paymentForm = new FormGroup({
      nameOnCard: new FormControl('',Validators.required)
    })
  }

 async submitOrder(){
  if(!this.checkoutBillingForm.valid && !this.checkoutForm.valid){
    this.checkoutBillingForm.markAllAsTouched()
    this.checkoutForm.markAllAsTouched()
    alert('Complete both Checkout and Billing forms!')
    return
  }
  if(!this.checkoutBillingForm.valid){
    debugger
    this.checkoutBillingForm.markAllAsTouched()
    alert('Complete Billing form!')
    return
  }
  if(!this.checkoutForm.valid){
    this.checkoutForm.markAllAsTouched()
    alert('Complete Checkout form!')
    return
  }
  this.loading = true
  const shoppingCart = this.shopService.getShoppingCartValue()
  if(!shoppingCart) throw new Error('Can not find your shopping cart!')
  try{
    const createAnOrder = await this.CreateAnOrder(shoppingCart)
    const paymentResult = await this.confirmPayments(shoppingCart)
    if(paymentResult.paymentIntent){
      this.shopService.deleteShoppingCart(shoppingCart!)
      const navi:NavigationExtras = {state:createAnOrder}
      this.order = navi.state as IActualOrder;
      this.router.navigate(['checkout/success',this.order.id],navi)
    }
    else{
      alert(paymentResult.error.message)
    }
  }catch(err){
    console.log(err)
    //create a toast that will display an error message to the current user!
  }finally{
    this.loading = false
  }

 }
  private async confirmPayments(shoppingCart: IShoppingCart | null) {
    if (!shoppingCart)  throw new Error('The Shopping-Cart is null')
    const results = this.stripe?.confirmCardPayment(shoppingCart.clientSecret!,{
      payment_method:{
        card:this.cardNumber!,
        billing_details:{
          name: this.paymentForm.get('nameOnCard')?.value
        }
      }
    })
    if(!results) throw new Error('Problem with payments!')
    return results
  }

  //Add up shipping with order
  private async CreateAnOrder(shoppingCart: IShoppingCart | null) {
    if (!shoppingCart)  throw new Error('The Shopping-Cart is null')
    const order = this.getOrderToCreate(shoppingCart)
    return firstValueFrom(this.checkoutSerice.createOrder(order))
  }

  //Change billing address
  private getOrderToCreate(Cart: IShoppingCart) {
    if(!Cart) throw new Error('Problem with your shopping cart!')
    return {
      id:Cart.id,
      shippingAddress: this.checkoutForm.value,
      billingAddress: this.checkoutBillingForm.value,
      shippingHandlingPrice: this.shopService.shipping
    }
  }

  changeShippingAddress(){
    this.address = undefined
  }

  changeBillingAddress(){
    this.billingaddress = undefined
  }

  getUserAddress(){
    this.account.GetUserAddress().subscribe({
      next:(results)=>{
        if(results){
          const addInformation = results.find(x=>x.addressType == 'shipping')
          const billInformation = results.find(x=>x.addressType == 'billing')
          this.address = addInformation
          console.log(this.address)
          if(this.address?.shippingIsBilling){
            this.billingaddress = addInformation
          }else{
            this.billingaddress = billInformation
          }
          this.checkoutForm.patchValue(addInformation)
          this.checkoutBillingForm.patchValue(billInformation)
          this.setAddressInfo = addInformation?.saveAddressInfo
          this.setAddressBillingInfo = addInformation?.shippingIsBilling
        }
      } 
    })
  }
  
  saveUserAddress(){
    this.setAddressInfo = !this.setAddressInfo
    this.checkoutForm.get('saveAddressInfo').setValue(this.setAddressInfo)
    if(this.setAddressInfo){
      alert('Your shipping address will be saved to our database!')
    }else{
      alert('Your shipping address will NOT be saved!')
    }
  }
  saveUserBillingAddress(){
    this.savebillingInfo = !this.savebillingInfo
    this.checkoutBillingForm.get('saveAddressInfo').setValue(this.savebillingInfo)
    if(this.savebillingInfo){
      alert('Your billing address will be saved to our database!')
    }else{
      alert('Your billing address will NOT be saved!')
    }
  }

  billingIsShippingAddress(){
    this.setAddressBillingInfo = !this.setAddressBillingInfo
    this.checkoutBillingForm.setValue(this.checkoutForm.value)
    this.checkoutBillingForm.get('shippingIsBilling').setValue(this.setAddressBillingInfo)
    this.checkoutForm.get('shippingIsBilling').setValue(this.setAddressBillingInfo)
    if(this.setAddressBillingInfo){
      alert('Your billing address will match your shipping')
    }else{
      alert('Your billing address will NOT match your shipping')
    }
  }
  

  

}
