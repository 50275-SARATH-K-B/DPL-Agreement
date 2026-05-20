import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../directives/directive.module';

import { ChargesRoutingModule } from './charges-routing.module';
import { ChargeEntryComponent } from './charge-entry/charge-entry.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    ChargesRoutingModule
  ],
  declarations: [ChargeEntryComponent]
})
export class ChargesModule { }
