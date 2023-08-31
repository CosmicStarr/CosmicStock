import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  constructor(private account:AccountService) {}
  
  ngOnInit(): void {}


  logout(){
    this.account.logOut()
  }

}
