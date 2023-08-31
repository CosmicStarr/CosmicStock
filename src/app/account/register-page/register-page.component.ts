import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/Models/IUser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})

export class RegisterPageComponent implements OnInit {
  registerForm!:FormGroup
  myDate = new Date();
  genderArray = [
    {value:'Male'},
    {value:'Female'}, 
    {value:'other'}
  ]

  showMenu:boolean
  constructor(private accountService:AccountService,private route:Router) {}

  ngOnInit(): void {
   this.createForm()
  }

  onSubmit(){
    if(!this.registerForm?.valid){
      this.registerForm.markAllAsTouched()
      alert("Complete the form!")
      return
    }else{
      this.accountService.Register(this.registerForm.value).subscribe({
        error:(x:HttpErrorResponse) =>{
          alert(x.error.message)
        },
        complete:()=>{
          alert("Your signed in! We've sent you an email to confirm your account.")
          this.route.navigate([""])
          this.registerForm.reset()
        }
      })
    }
  }

  getInfoById(){
    const bodyTag = document.getElementById('Rmodal')
    bodyTag.classList.remove('nav-open')
  }

  createForm(){
    this.registerForm = new FormGroup({
      email:new FormControl('',[Validators.required]),
      password:new FormControl('',[Validators.required]),
      confirmPassword:new FormControl('',[Validators.required]),
      // gender:new FormControl(''),
      // birthday:new FormControl('',Validators.required),
      // role:new FormControl('',Validators.required),
      // JobDepartment:new FormControl('',Validators.required)
    },{ validators: this.checkPasswords!})
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password').value!;
    let confirmPass = group.get('confirmPassword').value!
    return pass === confirmPass ? null : { notSame: true }
  }

}
