import { Injectable, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner/lib/ngx-spinner.service';




@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnInit {

  
  requestCount: number = 0
  constructor(private ngxSpinner:NgxSpinnerService) { }
  ngOnInit(): void {
    
  }
  loading(){
    this.requestCount++
    this.ngxSpinner.show(undefined,{
      type:'timer',
      bdColor:'rgba(255,255,255,0.4)',
      color:'#333333'
    })
  }

  idle(){
    this.requestCount--
    if(this.requestCount <= 0){
      this.requestCount = 0
      this.ngxSpinner.hide()
    }
  }

}
