import { IPhotoDTO } from "./IPhotoDTO";

export interface IPost{
    name: string;
    featuredName:string
    description: string;
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
    file:IPhotoDTO[]
    price: number;
    msrp:number
    isAvailable: boolean;
    isFeatured:boolean
    isOnSale: boolean;  
    category:string;
    brand:string;
}
