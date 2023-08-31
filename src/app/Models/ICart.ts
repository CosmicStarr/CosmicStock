import * as cuid from 'cuid';
import { IPhotoDTO } from './IPhotoDTO';
export interface IShoppingCart{
    id:string
    shoppingCartItems?:ICartItems[]
    clientSecret?:string
    paymentId?:string
}
export interface ICartItems{
    id:number
    name:string
    description:string
    price:number
    amount:number
    imageUrl:IPhotoDTO[]
    brand:string
    category:string
}

export class INewShoppingCart implements IShoppingCart{
    id = cuid()
    shoppingCartItems:ICartItems[] = []
}

export interface IOrderTotals{
    shipping:number
    subTotal:number
    total:number
}