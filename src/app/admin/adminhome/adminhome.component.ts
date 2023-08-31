import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IPost } from 'src/app/Models/IPost';
import { IProductDetails } from 'src/app/Models/products';
import { toBase64 } from 'src/app/Models/uploadToBase64';
import { environment } from 'src/environments/environment';
import { AdminServiceService } from '../admin-service.service';
import { ICategory } from 'src/app/Models/category';
import { IBrand } from 'src/app/Models/brand';
import { ProductsService } from 'src/app/products/products.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.scss']
})
export class AdminhomeComponent implements OnInit{
  uploadedImage:string[]=[]
  uploadedPicVidApi:File[]=[]
  uploadedVideo:string[]=[]
  show:boolean = true
  @ViewChild("pTag") private paragraph:ElementRef
  uploadPostForm:FormGroup
  categoryForm:FormGroup
  brandForm:FormGroup
  baseUrl = environment.baseUrl;
  post:IPost
  category:ICategory[]=[]
  brand:IBrand[]=[]
  @Output() onUploadImageSelected = new EventEmitter<File>()
    constructor(private adminService:AdminServiceService,private productService:ProductsService) {}
    ngOnInit(): void {
      this.createForm()
      this.getCategory()
      this.getbrands()
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
    createForm(){
      this.uploadPostForm = new FormGroup({
        name:new FormControl(''),
        featuredName:new FormControl(''),
        description:new FormControl(''),
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

    categoryform(){
      this.categoryForm = new FormGroup({
        name:new FormControl(''),
      })
    }

    buildFormData = (post:IPost):FormData => {
      const data = new FormData
      data.append('name',post.name)
      data.append('featuredName',post.featuredName)
      data.append('description',post.description)
      data.append('actualDetails',post.actualDetails)
      data.append('actualDetails1',post.actualDetails1)
      data.append('actualDetails2',post.actualDetails2)
      data.append('actualDetails3',post.actualDetails3)
      data.append('actualDetails4',post.actualDetails4)
      data.append('actualDetails5',post.actualDetails5)
      data.append('actualDetails6',post.actualDetails6)
      data.append('actualDetails7',post.actualDetails7)
      data.append('actualDetails8',post.actualDetails8)
      data.append('actualDetails9',post.actualDetails9)
      data.append('msrp',post.msrp.toString())
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
      this.adminService.createAPost(info).subscribe({
        next: (results)=> {
          console.log(results)
          alert(`${results.name} was created successfully!`)
        },
        error:(err)=> alert(err.error.message),
        complete:()=>{
          this.uploadPostForm.reset(true)
          location.reload()
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
