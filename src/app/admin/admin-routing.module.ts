import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { AdmineditComponent } from './adminedit/adminedit.component';
import { AdmindashComponent } from './admindash/admindash.component';

const routes: Routes = [
  {path:'home',component:AdminhomeComponent},
  {path:'dash',component:AdmindashComponent},
  {path:'edit/:id',component:AdmineditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
