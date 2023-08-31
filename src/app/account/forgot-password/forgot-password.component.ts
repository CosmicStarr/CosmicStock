import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm:FormGroup
  constructor(private account:AccountService) {}
  ngOnInit(): void {
    this.forgotPasswordForm()
  }
  
  onSubmit(){
    if(!this.forgotForm?.valid){
      alert("Enter an email address!")
      this.forgotForm.markAllAsTouched()
      return
    }else{
      this.account.forgotPassword(this.forgotForm.value).subscribe({
        next:()=>{
          this.forgotForm.reset()
          alert("We sent you a password reset link to your email!")
        }
      })
    }
  }

  forgotPasswordForm(){
    this.forgotForm = new FormGroup({
      email:new FormControl('',[Validators.required])
    })
  }
}
