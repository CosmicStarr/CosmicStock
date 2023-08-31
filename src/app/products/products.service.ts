import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IProducts } from '../Models/products';
import { StarrParams } from '../Models/params';
import { map, of } from 'rxjs';
import { PaginatedResults } from '../Models/pagination';
import { IRatings } from '../Models/RatingsDTO';
import { ICategory } from '../Models/category';
import { IBrand } from '../Models/brand';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  baseUrl = environment.baseUrl;
  PaginatedResult:PaginatedResults<IProducts[]> = new PaginatedResults<IProducts[]>()
  header = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('token'),})
  product:IProducts[] = []
  constructor(private http:HttpClient) { }
  getProducts(sunParams?:StarrParams){
    let params = new HttpParams
    if(sunParams?.sort){
      params = params.append('sort', sunParams.sort)
    }
    if(sunParams?.brandId){
      params = params.append('brandId',sunParams.brandId.toString())
    }
    if(sunParams?.catId){
      params = params.append('catId',sunParams.catId.toString())
    }
    if(sunParams?.search)
    {
      params = params.append('Search',sunParams.search)
    }
    if(sunParams?.pageNumber !== undefined && sunParams?.pageSize !== undefined){
      params = params.append('pageNumber',sunParams.pageNumber.toString());
      params = params.append('pageSize',sunParams.pageSize.toString());
      params = params.append('TotalItems',sunParams.TotalItems.toString()); 
    }
    return this.http.get<any>(this.baseUrl + 'Products',{ observe:'response', params, headers: this.header})
    .pipe(map(response =>{
        this.PaginatedResult.result = response.body;
        this.product = response.body
        if(response.headers.get('Pagination') !== undefined || response.headers.get('Pagination') == null){
          this.PaginatedResult.Pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return this.PaginatedResult
      },(error: any)=>{
        console.log(error)
      })
    )
  }
  //do the same for brands and category
  getProduct(id:number){
    const prod = this.product.find(x =>x.id == id)
    if(prod){
      return of(prod)
    } 
    return this.http.get<IProducts>(this.baseUrl + 'Products/' + id)
  }

  getCategory(){
    return this.http.get<ICategory[]>(this.baseUrl + 'Products/Category')
  }

  getBrands(){
    return this.http.get<IBrand[]>(this.baseUrl + 'Products/Brands')
  }

  postRating(id:number, rating:number){
    return this.http.post<IRatings>(this.baseUrl + 'Products/Rating/' + id,rating)
  }

  getRating(id){
    return this.http.get<IRatings>(this.baseUrl + 'Products/GetRatings/' + id)
  }

}
