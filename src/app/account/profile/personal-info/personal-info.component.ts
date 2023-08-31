import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ILoginUser, IUser } from 'src/app/Models/IUser';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  userInfoForm!:FormGroup
  currentUser$?:Observable<ILoginUser>
  constructor(private userInfo:AccountService) {}
  ngOnInit(): void {
    this.currentUser$ = this.userInfo.currentUser$
    this.createForm()
  }

  createForm(){
    this.userInfoForm = new FormGroup({
      currentPassword:new FormControl('',Validators.required),
      newPassword:new FormControl('',Validators.required),
      retypenewPassword:new FormControl('',Validators.required)
    },{ validators: this.checkPasswords!})
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('newPassword').value!;
    let confirmPass = group.get('retypenewPassword').value!
    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit(){
    if(!this.userInfoForm?.valid){
      this.userInfoForm.markAllAsTouched()
      alert("Complete the form!")
      return
    }else{
      this.userInfo.PatchValues(this.userInfoForm.value).subscribe({
        complete:()=>{
              //create some route logic here
              alert("Your information is updated!")
          }
        })
      }
    }

}
