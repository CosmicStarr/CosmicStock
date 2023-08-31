import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualcheckoutComponent } from './actualcheckout/actualcheckout.component';
import { SuccessComponent } from './success/success.component';


const routes: Routes = [
  {path:'checkout',component:ActualcheckoutComponent},
  {path:'success/:id',component:SuccessComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
