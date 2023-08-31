import { Component, OnInit } from '@angular/core';
import { IUserAddress } from 'src/app/Models/IUser';
import { AccountService } from '../../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit{
  address:IUserAddress[] = []
  constructor(private account:AccountService,private route:Router) {}
  
  ngOnInit(): void {
    this.getAddress()
  }

  removeAnAddress(id:number){
    let info = confirm('You are about to delete one of your addresses on file. Are you sure you want to continue?')
    if(info.valueOf()){
      this.account.DeleteAnAddress(id).subscribe({
        error:(x)=> alert(x.error),
        complete:()=>{
          alert("You've successfully deleted your address!")
          this.getAddress()
        }
      })
    }
  }

  addAnAddress(){
    if(this.address.length > 1){
      alert("Remove one of your current addresses on file!")
      return
    }
    this.route.navigate(["/profile/address-details/0"])
  }

  getAddress(){
    this.account.GetUserAddress().subscribe({
      next:(results)=> {
        if(results) this.address = results
        else return
      }
    })
  }
}
