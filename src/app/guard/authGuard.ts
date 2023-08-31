import {inject} from '@angular/core';
import { Router } from '@angular/router';
export const authGuard = () => {
  const router = inject(Router);
  if(localStorage.getItem('user')){
    return true;
  } 
  else {
    alert('You must create an account!')
    router.navigate(['/account/login'], {queryParams: {returnUrl: router.url}});
    return false
  }
}
export const shopauthGuard = () => {
  const router = inject(Router);
  if(localStorage.getItem('shoppingCartId')){
    return true;
  } 
  else {
    router.navigate([''], {queryParams: {returnUrl: router.url}});
    return false
  }
}
export const redirectGuard = () => {
  const router = inject(Router);
  if(localStorage.getItem('user')){
    return true;
  } 
  else {
    router.navigate(['/account/login']);
    return false
  }
}
