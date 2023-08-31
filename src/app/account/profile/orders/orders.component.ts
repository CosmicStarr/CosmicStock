import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IActualOrder } from 'src/app/Models/IOrder';
import { AccountService } from '../../account.service';
import { StarrParams } from 'src/app/Models/params';
import { Pagination } from 'src/app/Models/pagination';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterViewInit{
  @ViewChildren('lastOnTheList', {read: ElementRef}) 
  lastOnTheList: QueryList<ElementRef>
  observer:IntersectionObserver
  allOrders:IActualOrder[] = []
  sunParams = new StarrParams
  lastElement: any
  constructor(private account:AccountService) {}
  ngAfterViewInit(): void {
   this.lastOnTheList.changes.subscribe({
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
    this.getAllOrders()
    this.intersectionObserver()
  }

  getAllOrders(){
    this.account.GetAllOrders(this.sunParams).subscribe({
      next:(x)=> {
        console.log(x)
        if(x){
          x.result.forEach(i =>{
            this.allOrders.push(i)
          })
        }
      }
    })
  }

  intersectionObserver(){
    let options = {
      root: document.querySelector('#outter-Order-Container'),
      rootMargin: '0px',
      threshold: 0.5,
    };
    this.observer = new IntersectionObserver((x)=>{
      if(x[0].isIntersecting){
        if(this.account.PaginatedResult.Pagination.CurrentPage < this.account.PaginatedResult.Pagination.TotalPages){
          this.sunParams.pageNumber++
          this.getAllOrders()
        }
      }
    },options)
  }
}
