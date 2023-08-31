import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit  {
  ngOnInit(): void {
    const bodyTag = document.getElementById('bod')
    bodyTag.classList.remove('no-pointer-events')
  }

}
