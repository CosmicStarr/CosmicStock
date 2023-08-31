import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ILoginUser, IUser } from 'src/app/Models/IUser';

@Component({
  selector: 'app-confirm-change-email-request',
  templateUrl: './confirm-change-email-request.component.html',
  styleUrls: ['./confirm-change-email-request.component.scss']
})
export class ConfirmChangeEmailRequestComponent implements OnInit {
  emailConfirmed:boolean = false
  params:any = {};
  changeEmailForm:FormGroup
  currentUser$?:Observable<ILoginUser>
  constructor(private route:ActivatedRoute,private router:Router,private accountService:AccountService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$
    this.getParams()
    this.confirmEmail()
    this.createForm()
  }

  getParams(){
    //I have to check for null values
    this.params.token = this.route.snapshot.queryParamMap.get('token')
    this.params.userId = this.route.snapshot.queryParamMap.get('userId')
  }
  confirmEmail(){
    this.accountService.confirmEmail(this.params).subscribe({
      next:()=>{
        this.emailConfirmed = true
      },error:(x)=> {
        this.emailConfirmed = false
        alert(x.error.errors)
      }
    })
  }

  /*Change email logic*/
  createForm(){
    this.changeEmailForm = new FormGroup({
      newEmail:new FormControl('',Validators.required),
      confirmNewEmail:new FormControl('',Validators.required),
      currentPassword:new FormControl('',Validators.required)
    },{ validators: this.checkPasswords!})
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('newEmail').value!;
    let confirmPass = group.get('confirmNewEmail').value!
    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit(){
    if(!this.changeEmailForm?.valid){
      this.changeEmailForm.markAllAsTouched()
      alert("Complete the form!")
      return
    }else{
      this.accountService.actualRequestToChangeEmail(this.changeEmailForm.value).subscribe({
        complete:()=>{
              //create some route logic here
              alert("Your information is updated! You wil be log out now!")
              localStorage.clear()
              this.router.navigateByUrl("/account/login")
          }
        })
      }
    }
}
