import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { RealProductsComponent } from './real-products/real-products.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NaviBarModule } from '../navi-bar/navi-bar.module';
import { StarrRatingComponent } from './starr-rating/starr-rating.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';

@NgModule({
  declarations: [
    RealProductsComponent,
    ProductDetailsComponent,
    StarrRatingComponent
   
  ],
  imports: [
    CommonModule,
    NaviBarModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    NgxGalleryModule,
    ModalModule.forRoot()
  ],
  exports:[
    RealProductsComponent,
    ModalModule
  ]

})
export class ProductsModule { }
