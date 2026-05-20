import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRestructuringRoutingModule } from './payment-restructuring-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../directives/directive.module';
import { PaymentRestructuringRequestComponent } from './payment-restructuring-request/payment-restructuring-request.component';
import { PaymentRestructuringApprovalComponent } from './payment-restructuring-approval/payment-restructuring-approval.component';
import { PaymentRestructuringService } from '../../services/LMS/payment-restructuring.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    PaymentRestructuringRoutingModule
  ],
  declarations: [PaymentRestructuringRequestComponent, PaymentRestructuringApprovalComponent],
  providers: [PaymentRestructuringService]
})
export class PaymentRestructuringModule { }
