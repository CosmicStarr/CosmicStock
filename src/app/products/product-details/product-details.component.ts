import { Component, OnInit } from '@angular/core';
import { IProducts } from 'src/app/Models/products';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { AccountService } from 'src/app/account/account.service';
import { Observable } from 'rxjs';
import { ICartItems, IOrderTotals, IShoppingCart } from 'src/app/Models/ICart';
import { IRatings } from 'src/app/Models/RatingsDTO';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  ShoppingCart$!:Observable<IShoppingCart|null>
  OrderService$!:Observable<IOrderTotals|null>
  products?:IProducts
  id?:number
  amount = 1
  rateAmount:number = 0
  showMenu:boolean
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(
    private productService:ProductsService,
    private route:Router,
    private account:AccountService,
    private router:ActivatedRoute,
    private cartService:ShoppingCartService) {}


  ngOnInit(): void {
    this.ShoppingCart$ = this.cartService.shoppingCartSource$ 
    this.OrderService$ = this.cartService.shoppingCartTotalSource$
    this.router.params.subscribe({
     next: (x)=> this.id = +x['id']
    })
    this.loadProduct(+this.id!)
    this.getCurrentRating()
    this.galleryOptions = [
      {
        width: '100%',
        height: '600px',
        thumbnailsColumns: 4,
        thumbnailsRows:1,
        imageAnimation: NgxGalleryAnimation.Fade,
        preview:true
      },
      {
        breakpoint: 916,
        height: '438px',
      },
      {
        breakpoint: 896,
        height: '460px',
      },
      {
        breakpoint: 800,
        height: '700px',
      },
      {
        breakpoint: 769,
        height: '463px',
      },
      {
        breakpoint: 741,
        height: '480px',
      },
      {
        breakpoint: 415,
        height: '435px',
      },
      {
        breakpoint: 375,
        height: '300px',
      },
    ]
  }

  classToBody(){
    const bodyTag = document.getElementById('bod')
    if(this.showMenu == true){
      bodyTag.classList.add('no-pointer-events')
      return
    }else{
      bodyTag.classList.remove('no-pointer-events')
      return
    }
  }

  toggleMenu(){
    this.showMenu = true
  }

  toggleMenuClose(){
    this.showMenu = false
    this.classToBody()
  }
  
  galleryPics():NgxGalleryImage[]{
    const pics = [];
    for (const item of this.products?.imageUrl) {
      pics.push({
        small:item?.photoUrl,
        medium:item?.photoUrl,
        big:item?.photoUrl
      })
    }
    return pics;
  }
  

  AddItemToShoppingCart(){
    this.cartService.addToShoppingCart(this.products!,this.amount)
    this.toggleMenu()
    this.classToBody()
  }

  createPaymentIntent(){
    this.cartService.createPaymentIntent().subscribe({})
    this.route.navigate(["/checkout/checkout"])
  }
  
  onRatingEvent(rate:number){
    this.productService.postRating(this.id,rate).subscribe({
      next:(x)=> {
        alert(`You gave the product ${x.actualRating} stars!`)
      },
      error:(x)=>{
        alert(x.message)
      },complete:()=>{
        this.getCurrentRating()
      }
    })
  }
  
  getCurrentRating(){
    this.productService.getRating(this.id).subscribe({
      next:(x)=>{
        if(x){
          this.rateAmount = x.actualRating
        }
      },
      error:(x)=>{
        alert(x.message)
      }
    })
  }

  AddToWishlist(){
    this.account.WishList(this.id).subscribe({
      next:(x) =>{
        alert(`You've added ${x.name} to your wishlist!`)
      },
      error:(x)=>{
        alert(x.error.message)
      }
    })
  }

  loadProduct(id:number){
    this.productService.getProduct(id).subscribe({
      next:(x)=>{
        this.products = x
        this.galleryImages = this.galleryPics()
      }
    })
  }

  removeItem(item:ICartItems){
    this.cartService.removeItem(item)
  }


}


