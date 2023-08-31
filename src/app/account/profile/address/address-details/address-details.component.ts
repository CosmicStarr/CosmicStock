import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserAddress } from 'src/app/Models/IUser';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss']
})
export class AddressDetailsComponent implements OnInit {
  addressForm!:FormGroup
  id:number
  addressInfo:IUserAddress
  addressInfo1:IUserAddress
  addressInfo2:IUserAddress

  constructor(private account:AccountService,private route:Router, private router:ActivatedRoute,) {}

  ngOnInit(): void {
    this.createForm()
    this.router.params.subscribe({
      next: (x)=> this.id = +x['id']
     })
     this.getAddressbyId()

     this.account.GetUserAddress().subscribe({
      next:(x)=>{
        this.addressInfo = x.find(x=>x.id == this.id)
        this.addressInfo1 = x.find(x=>x.addressType == "shipping")
        this.addressInfo2 = x.find(x=>x.addressType == "billing")
        console.log(x)
      }
     })
  }



  createForm(){
    this.addressForm = new FormGroup({
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
      addressLine1: new FormControl('',Validators.required),
      addressLine2: new FormControl('',Validators.required),
      city: new FormControl('',Validators.required),
      state: new FormControl('',Validators.required),
      zipCode: new FormControl('',Validators.required),
      phoneNumber:new FormControl('',Validators.required),
      addressType:new FormControl('',Validators.required),
      saveAddressInfo:new FormControl(true)
    })
  }

  getAddressbyId(){
    return this.account.GetUserAddressbyId(this.id).subscribe({
      next:(x)=>{
        this.addressForm.patchValue(x)
      }
    })
  }

  onSubmit(){
    if(!this.addressForm.valid){
      alert('Complete the form!')
      this.addressForm.markAllAsTouched()
      return
    }
    console.log(this.addressForm.value)
    this.account.CreateUserAddress(this.addressForm.value).subscribe({
      next:(results) => console.log(results),
      error:(x:HttpErrorResponse)=>{
        alert(x.message)
      },
      complete:()=>{
        alert("Success!")
        this.route.navigate(["profile/address"])
      }
    })
  }

}
