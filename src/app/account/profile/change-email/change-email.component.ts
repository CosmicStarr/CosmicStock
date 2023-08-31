import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginUser, IUser } from 'src/app/Models/IUser';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  currentUser$?:Observable<ILoginUser>

  constructor(private userInfo:AccountService) {}
  ngOnInit(): void {
    this.currentUser$ = this.userInfo.currentUser$
  }

  ///Create method to confirm email if they did not receive the last one
  startRequestToConfirmEmailAgain(){
    this.userInfo.secondRequestToConfirmEmail().subscribe({
      next:()=>{
        alert('A verification email has been sent')
      },error:(x)=>{
        alert(x.errors)
      }
    })
  }

  onSubmit(){
    this.userInfo.beginRequestToChangeEmail().subscribe({
      next:()=>{
        alert('Check the email associated with this account for further instructions!')
      },error:(x)=>{
        alert(`We ran into a problem ${x}`)
      }
    })
  }
}
