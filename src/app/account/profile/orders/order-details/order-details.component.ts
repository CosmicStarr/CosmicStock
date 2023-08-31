import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IActualOrder, IOrderedItems } from 'src/app/Models/IOrder';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  ordereditems!:IActualOrder[]
  id?:number
  constructor(private router:ActivatedRoute,private account:AccountService) {}
  ngOnInit(): void {
    this.router.params.subscribe({
      next: (x)=> this.id = +x['id']
     })
     this.getAllOrderedItems(+this.id!)
  }

  getAllOrderedItems(id:number){
    this.account.GetAllOrderedItems(id).subscribe({
      next:(x)=>this.ordereditems = x
    })
  }

}
