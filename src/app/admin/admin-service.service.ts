import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPost } from '../Models/IPost';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }
  

  createAPost(post:any){
    return this.http.post<IPost>(this.baseUrl + 'Create',post)
  }
  updateAPost(id:number,post:any){
    return this.http.put<IPost>(this.baseUrl + 'Create/UpdateProduct/' + id,post)
  }

  deleteProduct(id:number){
   return this.http.delete(this.baseUrl + 'Create/Delete/' + id,{})
  }


}
