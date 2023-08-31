import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-starr-rating',
  templateUrl: './starr-rating.component.html',
  styleUrls: ['./starr-rating.component.scss']
})
export class StarrRatingComponent implements OnInit {
  @Input() maxStarrs = 5
  @Input() selectedRating:number = 0 
  @Output() onRating: EventEmitter<number> = new EventEmitter<number>()
  previousRating:number = 0
  maxStarrsArray = []

  constructor(private route:Router) {}
  ngOnInit(): void {
    this.maxStarrsArray = Array(this.maxStarrs).fill(0)
  }

  handleMouseEnter(i:number){
    this.selectedRating = i +1
  }
  handleMouseLeave(){
    if(this.previousRating !== 0){
      this.selectedRating = this.previousRating
    }else{
      this.selectedRating = 0
    }
  }
  actualRating(i:number){
    if(localStorage.getItem('user') === null){
      let info = confirm('You have to create an account if you want rate products. Would like to create one now?')
      if(info.valueOf()){
        this.route.navigateByUrl("/account/login")
        return
      }
      return
    }
    this.selectedRating = i+1
    this.previousRating = this.selectedRating 
    this.onRating.emit(this.selectedRating)
  }
}
