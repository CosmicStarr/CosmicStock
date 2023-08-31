import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard, shopauthGuard } from './guard/authGuard';



const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'products', loadChildren:()=>import('./products/products.module').then(mod =>mod.ProductsModule)},
  {path:'account', loadChildren:()=>import('./account/account.module').then(mod =>mod.AccountModule)},
  {path:'admin', loadChildren:()=>import('./admin/admin.module').then(mod =>mod.AdminModule)},
  {path:'shopping-cart',loadChildren:()=>import('./shopping-cart/shopping-cart.module').then(mod =>mod.ShoppingCartModule)},
  {path:'checkout', canActivate:[authGuard],canActivateChild:[shopauthGuard],loadChildren:()=>import('./checkout/checkout.module').then(mod =>mod.CheckoutModule)},
  {path:'**',redirectTo:'home',pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
