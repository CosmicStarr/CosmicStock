import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';
import { ILoginUser } from 'src/app/Models/IUser';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  emailConfirmed:boolean = false
  params:any = {};
  constructor(private route:ActivatedRoute,private accountService:AccountService) { }

  ngOnInit(): void {
    this.getParams()
    this.confirmEmail()
  }

  getParams(){
    //I have to check for null values
    this.params.token = this.route.snapshot.queryParamMap.get('token')
    this.params.userId = this.route.snapshot.queryParamMap.get('userId')
  }
  confirmEmail(){
    this.accountService.confirmEmail(this.params).subscribe({
      next:(x:ILoginUser)=>{
        this.emailConfirmed = true
        console.log(x)
        this.accountService.setCurrentUser(x)
      },error:(x)=> {
        this.emailConfirmed = false
        alert(x.error.errors)
      }
    })
  }

}
