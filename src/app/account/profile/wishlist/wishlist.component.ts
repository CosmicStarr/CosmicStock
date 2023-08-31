import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/Models/IUser';
import { AccountService } from '../../account.service';
import { IWishList } from 'src/app/Models/wishlist';
import { StarrParams } from 'src/app/Models/params';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, AfterViewInit {
  @ViewChildren('lastOnTheWishList', {read: ElementRef}) 
  lastOnTheWishList: QueryList<ElementRef>
  observer:IntersectionObserver
  sunParams = new StarrParams
  lastElement: any
  wishlist:IWishList[]=[]
  constructor(private account:AccountService) {}

  ngAfterViewInit(): void {
    this.lastOnTheWishList.changes.subscribe({
      next:(x)=>{
        console.log(x)
        if(x.last){
          this.lastElement = x.last
          console.log(x.last.nativeElement)
          this.observer.observe(x.last.nativeElement)
        }
      }
    })
  }

  ngOnInit(): void {
    this.getWishlist()
    this.intersectionObserver()
  }
  
  getWishlist(){
    this.sunParams.pageSize = 8
    this.account.GetWishlist(this.sunParams).subscribe({
      next:(x)=> {
        console.log(x)
        if(x){
          x.result.forEach(i =>{
            this.wishlist.push(i)
          })
        }
      }
    })
  }

  getWishlistAgain(){
    this.account.GetWishlist().subscribe({
      next:(x)=>{
        this.wishlist = x.result
      }
    })
  }

  deleteWishedItem(id:number){
    console.log(id)
    this.account.DeleteWishedItem(id).subscribe({
      error:(x)=> alert(x.error),
      complete:()=>{
        alert("You deleted one of your wishes successfully!")
        this.getWishlistAgain()
      }
    })
  }


  intersectionObserver(){
    let options = {
      root: document.querySelector('#flexContainer'),
      rootMargin: '0px',
      threshold: 0.5,
    };
    this.observer = new IntersectionObserver((x)=>{
      if(x[0].isIntersecting){
        if(this.account.PaginatedResult.Pagination.CurrentPage < this.account.PaginatedResult.Pagination.TotalPages){
          this.sunParams.pageNumber++
          this.getWishlist()
        }
      }
    },options)
  }
}
