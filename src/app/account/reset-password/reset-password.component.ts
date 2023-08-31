import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{
  emailConfirmed:boolean = false
  params?:any = {}
  resetPasswordForm:FormGroup
  constructor(private route:ActivatedRoute,private router:Router,private accountService:AccountService) { }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl(''),
      token: new FormControl(''),
      newPassword:new FormControl('',[Validators.required]),
      confirmPassword:new FormControl('',[Validators.required])
    })
    this.resetPasswordForm.get('token').setValue(this.route.snapshot.queryParamMap.get('token'))
    this.resetPasswordForm.get('email').setValue(this.route.snapshot.queryParamMap.get('email'))
    this.getParams()
  }

  getParams(){
    //I have to check for null values
    this.params!.token = this.route.snapshot.queryParamMap.get('token')
    this.params!.email = this.route.snapshot.queryParamMap.get('email')
  }

  resetPasswordMethod(){
    this.accountService.resetPassword(this.resetPasswordForm.value).subscribe({
      next:()=>{
        alert("Your password reset is successful!")
        this.router.navigate(["/account/login"])
        // this.emailConfirmed = true
      },error:(x)=> console.log(x.error)
    })
  }

}
