import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditShieldInsuranceComponent } from './credit-shield-insurance/credit-shield-insurance.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../theme/directives/directives.module';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { CustomePipeModule } from '../Pipes/custome-pipe/custome-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    AmazingTimePickerModule,
    CustomePipeModule,
  ],
  declarations: [CreditShieldInsuranceComponent],
  exports: [CreditShieldInsuranceComponent]
})
export class SharedComponentModule { }
