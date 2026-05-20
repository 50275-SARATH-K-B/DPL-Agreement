import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstallmentReceiptComponent } from './installment-receipt/installment-receipt.component';
import { ManualEntryApprovalComponent } from './manual-entry-approval/manual-entry-approval.component';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'installment-receipt', component: InstallmentReceiptComponent, data: { breadcrumb: 'INSTALLMENT RECEIPTr' }, pathMatch: 'full' },
      { path: 'manual-entry-request', component: ManualEntryComponent, data: { breadcrumb: 'MANUAL ENTRY REQUEST' }, pathMatch: 'full' },
      { path: 'manual-entry-approval', component: ManualEntryApprovalComponent, data: { breadcrumb: 'MANUAL ENTRY APPROVAL' }, pathMatch: 'full' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepaymentRoutingModule { }
