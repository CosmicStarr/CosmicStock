import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IPost } from 'src/app/Models/IPost';
import { IProductDetails, IProducts } from 'src/app/Models/products';
import { toBase64 } from 'src/app/Models/uploadToBase64';
import { environment } from 'src/environments/environment';
import { AdminServiceService } from '../admin-service.service';
import { ProductsService } from 'src/app/products/products.service';
import { ICategory } from 'src/app/Models/category';
import { IBrand } from 'src/app/Models/brand';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adminedit',
  templateUrl: './adminedit.component.html',
  styleUrls: ['./adminedit.component.scss']
})
export class AdmineditComponent implements OnInit {
  uploadedImage:string[]=[]
  uploadedPicVidApi:File[]=[]
  uploadedVideo:string[]=[]
  show:boolean = true
  @ViewChild("pTag") private paragraph:ElementRef
  uploadPostForm:FormGroup
  baseUrl = environment.baseUrl;
  products:IProducts
  post:IPost
  category:ICategory[]=[]
  brand:IBrand[]=[]
  id:number
  @Output() onUploadImageSelected = new EventEmitter<File>()
    constructor(private adminService:AdminServiceService,private productService:ProductsService,private router:ActivatedRoute) {}
    ngOnInit(): void {
      this.router.params.subscribe({
        next: (x)=> this.id = +x['id']
       })
      this.createForm()
      this.getCategory()
      this.getbrands()
      this.loadProduct()
    }

    loadProduct(){
      this.productService.getProduct(+this.router.snapshot.paramMap.get('id')).subscribe({
        next:(results)=>{
          this.products = results
          this.uploadPostForm.patchValue(this.products)
          console.log(results)
        }
      })
    }

    pictureSelect(event){ 
      if(event.type == 'video/mp4'){
        console.log(`yes! Im coming from picSelect ${event}`)
        //pushing the video to an Array of files i will send to the api
        this.uploadedPicVidApi.push(event)
        //pushing the video to the src so user can confirm video will be uploaded!
        toBase64(event).then((value:string)=>this.uploadedVideo.push(value))
        this.removeDragandDropaPicElement()
        return
      }
      this.uploadedPicVidApi.push(event)
      toBase64(event).then((value:string)=>this.uploadedImage.push(value))
      this.removeDragandDropaPicElement()
    }

    getbrands(){
      this.productService.getBrands().subscribe({
        next:(results)=>{
          this.brand = results
        }
      })
    }
    
    getCategory(){
      this.productService.getCategory().subscribe({
        next:(results)=>{
          this.category = results
        }
      })
    }
  
    pictureSelected(event){
      if(event.target.files.length > 0){      
        const file:File = event.target.files[0]
        if(file.type == 'video/mp4'){
          console.log(`yes! Im coming from pictureSelected! ${file}`)
          //pushing the video to an Array of files i will send to the api
          this.uploadedPicVidApi.push(file)
          //pushing the video to the src so user can confirm video will be uploaded!
          toBase64(file).then((value:string)=>this.uploadedVideo.push(value))
          this.removeDragandDropaPicElement()
          return
        }
        this.uploadedPicVidApi.push(file)
        toBase64(file).then((value:string)=>this.uploadedImage.push(value))
        this.removeDragandDropaPicElement()
        this.onUploadImageSelected.emit(file)
      }
    }
  
    createForm(){
      this.uploadPostForm = new FormGroup({
        name:new FormControl(''),
        featuredName:new FormControl(''),
        description:new FormControl(''),
        details: new FormGroup({
          actualDetails:new FormControl(''),
          actualDetails1:new FormControl(''),
          actualDetails2:new FormControl(''),
          actualDetails3:new FormControl(''),
          actualDetails4:new FormControl(''),
          actualDetails5:new FormControl(''),
          actualDetails6:new FormControl(''),
          actualDetails7:new FormControl(''),
          actualDetails8:new FormControl(''),
          actualDetails9:new FormControl(''),
        }),
        msrp:new FormControl(''),
        price:new FormControl(''),
        isAvailable:new FormControl(''),
        isFeatured:new FormControl(''),
        isOnSale:new FormControl(''),
        category:new FormControl(''),
        brand:new FormControl(''),
        file:new FormControl('')
      })
     
      this.uploadPostForm.get('file').setValue(this.uploadedPicVidApi)
    }

    // AddDetails(){
    //   const productInfo = {title:this.title.nativeElement.value,actualDetails:this.actual.nativeElement.value} 
    //   console.log(this.uploadPostForm.get('details').value)
    //   console.log(this.productDetails)
    //   this.productDetails.push(productInfo)
    // }

    buildFormData = (post:IProducts):FormData => {
      const data = new FormData
      data.append('name',post.name)
      data.append('featuredName',post.featuredName)
      data.append('description',post.description)
      data.append('details',JSON.stringify(post.details))
      data.append('actualDetails',post.details.actualDetails)
      data.append('actualDetails1',post.details.actualDetails1)
      data.append('actualDetails2',post.details.actualDetails2)
      data.append('actualDetails3',post.details.actualDetails3)
      data.append('actualDetails4',post.details.actualDetails4)
      data.append('actualDetails5',post.details.actualDetails5)
      data.append('actualDetails6',post.details.actualDetails6)
      data.append('actualDetails7',post.details.actualDetails7)
      data.append('actualDetails8',post.details.actualDetails8)
      data.append('actualDetails9',post.details.actualDetails9)
      data.append('msrp',post.price.toString())
      data.append('price',post.price.toString())
      data.append('isAvailable',post.isAvailable.toString())
      data.append('isFeatured',post.isFeatured.toString())
      data.append('isOnSale',post.isOnSale.toString())
      data.append('category',post.category)
      data.append('brand',post.brand)
      for(let i of this.uploadedPicVidApi)
      data.append('file',i)
      return data
    }
  
    onSubmit(){
      const info = this.buildFormData(this.uploadPostForm.value)
      console.log(this.uploadPostForm.value)
      this.adminService.updateAPost(this.id,info).subscribe({
        next: (results)=> console.log(results),
        error:(err)=> alert(err.error.message),
        complete:()=>{
          this.uploadPostForm.reset(true)
        } 
      })
    }
  

    removeDragandDropaPicElement(){
      if(this.uploadedImage || this.uploadedVideo){
        this.paragraph.nativeElement.remove()
        this.show = false
      }
    }

}
