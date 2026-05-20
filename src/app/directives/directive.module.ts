import { NgModule } from '@angular/core';
import { OnlyNumberDirective } from './onlynumberdirective';
import { OnlyCharacterDirective } from './onlycharacterdirective';
import { TwoDigitDecimaNumberDirective } from './twodecimalnumber.directive';
import { BlockCopyPasteDirective } from './preventcopypaste';
import { ChangeDirective } from './uppercasedirective';
import { AutofocusDirective } from './autofocusdirctive';
import {CharactersWithSpaceAndDotDirective} from './characterswithspaceanddotdirective';
import {OnlyNumberDecimal} from './onlyNumberDecimal';
@NgModule({
    imports: [],
    declarations: [OnlyCharacterDirective,
        OnlyNumberDirective,
        TwoDigitDecimaNumberDirective,
        ChangeDirective,
        BlockCopyPasteDirective,
        AutofocusDirective,
        CharactersWithSpaceAndDotDirective,
        OnlyNumberDecimal],
    exports: [OnlyCharacterDirective,
        OnlyNumberDirective,
        ChangeDirective,
        TwoDigitDecimaNumberDirective,
        BlockCopyPasteDirective,
        AutofocusDirective,
        CharactersWithSpaceAndDotDirective,
        OnlyNumberDecimal]
})
export class DirectivesModule { }