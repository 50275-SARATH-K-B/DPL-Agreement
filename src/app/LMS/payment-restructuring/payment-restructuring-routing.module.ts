import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentRestructuringApprovalComponent } from './payment-restructuring-approval/payment-restructuring-approval.component';
import { PaymentRestructuringRequestComponent } from './payment-restructuring-request/payment-restructuring-request.component';

const routes: Routes = [  {
  path: 'payment-restructuring-request',
  component: PaymentRestructuringRequestComponent,
  data: {
    breadcrumb: 'Payment Restructuring Request'
  },
  pathMatch: 'full'
},
{
  path: 'payment-restructuring-approval',
  component: PaymentRestructuringApprovalComponent,
  data: {
    breadcrumb: 'Payment Restructuring Approval'
  },
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRestructuringRoutingModule { }
