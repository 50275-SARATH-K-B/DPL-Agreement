import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[CharactersWithSpaceAndDot]'
})
export class CharactersWithSpaceAndDotDirective {

    constructor(private _el: ElementRef) { }

    @Input() CharactersWithSpaceAndDot: boolean;

    @HostListener('keydown', ['$event']) onInputChange(event) {

        // if (this.CharactersWithSpaceAndDot) {
        //     //alert(e.keyCode)
        //     const initalValue = this._el.nativeElement.value;
        //     this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z /]/g, '');
        //     if (initalValue !== this._el.nativeElement.value) {
        //         event.stopPropagation();
        //     }
        // }

        let e = <KeyboardEvent>event;
        if (this.CharactersWithSpaceAndDot) {
            //alert(e.keyCode)
            if ((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode == 8) || (e.keyCode == 32) || (e.keyCode == 9) || (e.keyCode == 190 && !e.shiftKey) || (e.keyCode == 191 && !e.shiftKey) ) {
                // let it happen, don't do anything

                return;
            }
            // Ensure that it is a number and stop the keypress
            else {

                e.preventDefault();

            }

        }
    }
}