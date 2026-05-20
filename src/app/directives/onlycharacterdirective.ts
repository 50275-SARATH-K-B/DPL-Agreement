import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyCharacter]'
})
export class OnlyCharacterDirective {

  constructor(private _el: ElementRef) { }

  @Input() OnlyCharacter: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (this.OnlyCharacter) {
      if ((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode == 8) || (e.keyCode == 32) || (e.keyCode == 9)) {
        // let it happen, don't do anything

        return;
      }else {

        e.preventDefault();

      }


    }
  }
}