import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepaymentRoutingModule } from './repayment-routing.module';
import { InstallmentReceiptComponent } from './installment-receipt/installment-receipt.component';

import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../directives/directive.module';
// import { ManualEntryApprovalComponent } from './manual-entry-approval/manual-entry-approval.component';
// import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { AppModule } from '../../app.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DirectivesModule,
    ReactiveFormsModule,
    SharedModule,
    RepaymentRoutingModule,
    AppModule
  ],
  declarations: [InstallmentReceiptComponent]
})
export class RepaymentModule { }
