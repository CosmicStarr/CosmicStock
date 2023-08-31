import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import * as $ from 'jquery'
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup
  returnUrl:string
  showMenu:boolean

  constructor(private accountService:AccountService,private route:Router,private activatedRoute:ActivatedRoute,private shopService:ShoppingCartService) {}

  ngOnInit(): void {
    const bodyTag = document.getElementById('bod')
    bodyTag.classList.remove('no-pointer-events')
    this.returnUrl = this.activatedRoute.snapshot.queryParams["returnUrl"] || ''
    this.createForm()
  }

  toggleMenuOpen(){
    const bodyTag = document.getElementById('Rmodal')
    if(bodyTag){
      bodyTag.classList.add('nav-open')
      this.showMenu = true
      return
    }
    this.showMenu = true
  }
  toggleMenuClose(){
    this.showMenu = false
  }


  createForm(){
    this.loginForm = new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email,Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password:new FormControl('',Validators.required),
    })
  }
  
  onSubmit(){
    if(!this.loginForm?.valid){
      this.loginForm.markAllAsTouched()
      alert("Complete the form!")
      return
    }else{
      this.accountService.LoginUser(this.loginForm?.value).subscribe({
        error:(x:HttpErrorResponse)=>{
          alert(x.error.message)
        },
        complete:()=> {
          alert("Wonderful!")
          this.route.navigateByUrl(this.returnUrl)
          this.shopService.getShoppingCart(this.shopService.getShoppingCartValue()?.id!) ?? null
        }
      })
    }
  }
}
