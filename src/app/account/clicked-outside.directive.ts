import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Inject, OnDestroy, Output } from '@angular/core';
import { Subscription, filter, fromEvent } from 'rxjs';

@Directive({
  selector: '[appclickOutside]'
})
export class ClickedOutsideDirective implements AfterViewInit, OnDestroy {

  @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

  documentClickedSub:Subscription | undefined

  constructor(private elemRef: ElementRef,@Inject(DOCUMENT) private document:Document) {}
  
  ngAfterViewInit(): void {
    this.documentClickedSub = fromEvent(this.document, 'click').pipe(
      filter((event)=>{
        let result = this.isInside(event.target as HTMLElement)
        console.log(result)
        return result
      })
    ).subscribe({
      next:()=> this.clickOutside.emit() 
    })
  }

  ngOnDestroy(): void {
    this.documentClickedSub?.unsubscribe()
  }

  isInside(elementToCheck:HTMLElement):boolean{
    let info = this.document.getElementById("reg-form-container")
    return (elementToCheck === this.elemRef.nativeElement && this.elemRef.nativeElement.contains(elementToCheck) || elementToCheck.isEqualNode(info))
  }

}
