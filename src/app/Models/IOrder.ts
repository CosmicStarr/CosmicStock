import { IPhotoDTO } from "./IPhotoDTO";
import { IUserAddress } from "./IUser";

export interface IActualOrder{
    id:number
    email:string
    orderDate:Date
    shippingAddress:IUserAddress
    billingAddress:IUserAddress
    shippingHandlingPrice:number
    orderedProducts:IOrderedItems[]
    subtotal:number
    trueTotal:number
    paymentStatus:string
}

export interface IOrderedItems{
    id: number;
    actualOrderId: number
    name: string;
    price: number;
    imageUrl:IPhotoDTO[]
    amount:number
    category:string;
    brand:string;
}

export interface ICreateOrder{
    id:string
    shippingAddress:IUserAddress
    billingAddress:IUserAddress
    shippingHandlingPrice:number 
}