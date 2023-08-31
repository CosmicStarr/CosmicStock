import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {
  @Output() FilesInformation: EventEmitter<any> = new EventEmitter();

  @HostBinding("style.background") private background = "#eee";
  constructor(private sand:DomSanitizer) { }
  @HostListener("dragover",["$event"])
  public onDragOver(e:DragEvent){
    e.preventDefault()
    e.stopPropagation();
    this.background = "#999"
  }

  @HostListener("dragLeave",["$event"])
  public onDragLeave(e:DragEvent){
    e.preventDefault()
    e.stopPropagation();
    this.background = "#eee"
  }
  @HostListener("drop",["$event"])
  public onDrop(e:DragEvent){
    e.preventDefault()
    e.stopPropagation();
    this.background = "#eee"

    const file = e.dataTransfer.files[0]
    this.FilesInformation.emit(file)
    
  }


}
