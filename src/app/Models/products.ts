import { IPhotoDTO } from "./IPhotoDTO";
import { IRatings } from "./RatingsDTO";

export interface IProducts{
    id: number;
    name: string;
    featuredName:string
    description: string;
    details:IProductDetails
    imageUrl:IPhotoDTO[]
    msrp:number
    price: number;
    savings:number
    isAvailable: boolean;
    isFeatured:boolean
    isOnSale: boolean;
    ratings:IRatings[]    
    category:string;
    brand:string;
    totalRate:number
}
export interface IProductDetails{
    actualDetails:string
    actualDetails1:string
    actualDetails2:string
    actualDetails3:string
    actualDetails4:string
    actualDetails5:string
    actualDetails6:string
    actualDetails7:string
    actualDetails8:string
    actualDetails9:string
}