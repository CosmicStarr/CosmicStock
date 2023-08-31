import { IProducts } from "./products"

export interface IUser{
    email?:string
    password:string
    confirmPassword:string
    token: string;
    emailConfirmed:boolean
    JobDepartment?:string;
    role?:string[];
    wishList:IProducts[]
    registerErrors:string[]
}
export interface ILoginUser{
    email?:string
    token: string;
    emailConfirmed:boolean
    jobDepartment?:string;
    role?:string[];
}
export interface IUserAddress{
    id:number
    firstName:string
    lastName:string
    addressLine1:string
    addressLine2:string
    city:string
    phoneNumber:string
    state:string
    zipCode:number
    appUser:string
    addressType:string
    saveAddressInfo:boolean
    shippingIsBilling:boolean
}

export interface IEmailChangeModel{
    newEmail:string
    confirmNewEmail:string
    currentPassword:string
}

export interface IForgotPassword{
    newpassword:string
    confirmpassword:string
}
export interface IResetPassword{
    email:string
    token:string
    newPassword:string
    comfirmPassword:string
}
