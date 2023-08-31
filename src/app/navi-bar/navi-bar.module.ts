import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaviBarRoutingModule } from './navi-bar-routing.module';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from '../footer/footer.component';


@NgModule({
  declarations: [
    NavComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    NaviBarRoutingModule
  ],
  exports:[
    NavComponent,
    FooterComponent
  ]
})
export class NaviBarModule { }
