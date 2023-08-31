import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service';
import { IProducts } from 'src/app/Models/products';
import { StarrParams } from 'src/app/Models/params';
import { IPagination } from 'src/app/Models/pagination';
import { LoadingService } from 'src/app/loading.service';


@Component({
  selector: 'app-real-products',
  templateUrl: './real-products.component.html',
  styleUrls: ['./real-products.component.scss']
})
export class RealProductsComponent implements OnInit {
  @ViewChild('prodID') id?:ElementRef
  sunParams = new StarrParams
  products?:IProducts[]=[]
  product?:IProducts
  p?:IPagination
  Loading:boolean = false
  // bsModalRef?:BsModalRef<any> = new BsModalRef<any>();
  showMenu:boolean = false
  constructor(private productService:ProductsService,private isLoading:LoadingService) {
  }
  ngOnInit(): void {
    this.getAllProducts()
  }
  toggleMenu(){
    this.showMenu = !this.showMenu
  }
  getAllProducts(){
    this.Loading = true
    this.productService.getProducts(this.sunParams).subscribe({
      next:(results) => this.products = results.result,
      complete:()=>{
        this.Loading = false
      }
    })
  }

}
