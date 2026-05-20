import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberToWordPipe } from './number-to-word.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NumberToWordPipe],
  exports : [NumberToWordPipe]
})
export class CustomePipeModule { }
